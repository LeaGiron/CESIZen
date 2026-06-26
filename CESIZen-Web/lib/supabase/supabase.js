import { createBrowserClient } from '@supabase/ssr'

let _supabase = null

export const getSupabase = () => {
  if (!_supabase) {
    _supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    )
  }
  return _supabase
}

export const supabase = {
  get auth() { return getSupabase().auth },
  get from() { return getSupabase().from.bind(getSupabase()) },
  get rpc() { return getSupabase().rpc.bind(getSupabase()) },
  get storage() { return getSupabase().storage },
  get functions() { return getSupabase().functions },
  get realtime() { return getSupabase().realtime },
  get channel() { return getSupabase().channel.bind(getSupabase()) },
}
