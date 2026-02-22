import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ||
  "";
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ||
  "https://baln.app,http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const allowedEvents = new Set([
  "landing_view",
  "landing_cta_click",
  "pricing_cta_click",
  "section_view",
  "experiment_exposure",
  "waitlist_submit",
]);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function getCorsHeaders(origin: string | null) {
  const resolvedOrigin = origin && ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": resolvedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Content-Type": "application/json",
  };
}

function badRequest(message: string, origin: string | null) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status: 400,
    headers: getCorsHeaders(origin),
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = getCorsHeaders(origin);

  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method not allowed" }),
      {
        status: 405,
        headers,
      },
    );
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(
      JSON.stringify({ ok: false, error: "Server env missing" }),
      {
        status: 500,
        headers,
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body", origin);
  }

  const eventName = String(body.event_name || "").trim();
  if (!eventName) return badRequest("event_name is required", origin);
  if (!allowedEvents.has(eventName)) {
    return badRequest("event_name is not allowed", origin);
  }

  const createdAt = body.created_at
    ? String(body.created_at)
    : new Date().toISOString();
  const sessionId = body.session_id ? String(body.session_id) : null;
  const pagePath = body.page_path ? String(body.page_path) : null;
  const pageUrl = body.page_url ? String(body.page_url) : null;
  const referrerHost = body.referrer_host ? String(body.referrer_host) : null;
  const userAgent = body.user_agent ? String(body.user_agent) : null;

  const properties =
    typeof body.properties === "object" && body.properties !== null
      ? body.properties
      : {};
  const experiments =
    typeof body.experiments === "object" && body.experiments !== null
      ? body.experiments
      : {};
  const utm = typeof body.utm === "object" && body.utm !== null ? body.utm : {};

  const { error } = await supabase.from("landing_events").insert({
    event_name: eventName,
    created_at: createdAt,
    session_id: sessionId,
    page_path: pagePath,
    page_url: pageUrl,
    referrer_host: referrerHost,
    user_agent: userAgent,
    properties,
    experiments,
    utm,
  });

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers,
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
});
