// ==================================================
// AN:RIEL
// Supabase Configuration
// ==================================================

const SUPABASE_URL =
  "https://meqijoisfsxpyjkfvhdn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_g4cWmcu-eqVxKK86FhjxnQ_ZmikwyjU";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );