window.BALN_CONFIG = {
  // If provided, CTA opens the App Store URL. If empty, CTA leads to onsite waitlist section.
  appStoreUrl: "",

  // Optional event ingestion endpoint.
  eventsEndpoint: "https://YOUR_PROJECT.supabase.co/functions/v1/landing-events",

  // Optional waitlist signup endpoint.
  waitlistEndpoint: "https://YOUR_PROJECT.supabase.co/functions/v1/waitlist-signup",

  // Optional public key sent as Authorization Bearer token.
  publicApiKey: "",

  // Starting count displayed on waitlist card.
  waitlistBaseCount: 120
};
