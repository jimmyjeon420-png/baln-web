import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") || "https://baln.app,http://localhost:3000,http://localhost:5173")
  .split(",")
  .map((v) => v.trim())
  .filter(Boolean);

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function getCorsHeaders(origin: string | null) {
  const resolvedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": resolvedOrigin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const headers = getCorsHeaders(origin);

  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "Method not allowed" }), {
      status: 405,
      headers,
    });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ ok: false, error: "Server env missing" }), {
      status: 500,
      headers,
    });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return badRequest("Invalid JSON body", origin);
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!email || !emailRegex.test(email)) return badRequest("Valid email is required", origin);

  const consent = Boolean(body.consent);
  if (!consent) return badRequest("consent=true is required", origin);

  const createdAt = body.created_at ? String(body.created_at) : new Date().toISOString();
  const source = body.source ? String(body.source) : "landing_waitlist";
  const channel = body.channel ? String(body.channel) : "remote";

  const experiments = typeof body.experiments === "object" && body.experiments !== null ? body.experiments : {};
  const utm = typeof body.utm === "object" && body.utm !== null ? body.utm : {};

  const { error } = await supabase.from("waitlist_signups").insert({
    email,
    consent,
    source,
    channel,
    created_at: createdAt,
    experiments,
    utm,
  });

  if (error) {
    // Unique(lower(email)) conflict
    if (error.code === "23505") {
      return new Response(JSON.stringify({ ok: true, duplicate: true }), { status: 200, headers });
    }
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers,
    });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
});
