import { createBrowserClient } from '@supabase/ssr'

const getSupabaseUrl = () => process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const getSupabaseKey = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

export const supabase = createBrowserClient(
  getSupabaseUrl(),
  getSupabaseKey()
)
