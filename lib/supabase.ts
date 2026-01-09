import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy-loaded clients to avoid build-time errors when env vars aren't available
let _supabase: SupabaseClient | null = null;

// Public client for client-side operations (respects RLS)
// Returns null during build if credentials aren't available
export function getSupabase(): SupabaseClient | null {
  if (!_supabase) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      // During build, credentials may not be available
      return null;
    }
    _supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _supabase;
}

// Build-time mock that returns empty data for any chained query
// Handles Supabase's chainable query pattern: supabase.from().select().eq()...
function createBuildTimeMock(): unknown {
  const result = { data: [], error: null, count: 0 };

  const chainable: unknown = new Proxy(function(){}, {
    // Handle function calls like .from("table"), .select(), .eq(), etc.
    apply() {
      return chainable;
    },
    get(_, prop) {
      // Make it awaitable - returns { data: [], error: null, count: 0 }
      if (prop === 'then') {
        return (resolve: (value: typeof result) => void) => resolve(result);
      }
      // Direct property access
      if (prop === 'data') return [];
      if (prop === 'error') return null;
      if (prop === 'count') return 0;
      // Everything else is chainable
      return chainable;
    }
  });

  return chainable;
}

// Backward compat export (lazy getter)
// Returns a proxy that safely returns empty data for build-time calls
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    const client = getSupabase();
    if (!client) {
      // During build, return chainable mock
      if (prop === 'from') return createBuildTimeMock();
      return undefined;
    }
    return client[prop as keyof SupabaseClient];
  }
});

// Server-side admin client (bypasses RLS) - only use in API routes
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase credentials not configured');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });
}
