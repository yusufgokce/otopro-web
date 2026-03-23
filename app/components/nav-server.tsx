import { createClient } from '@/lib/supabase/server'
import { Nav } from './nav'

export async function NavServer() {
  let user: { name: string; email: string } | null = null

  try {
    const supabase = await createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (authUser) {
      // Try to get the user's name from the users table
      const { data: profile } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', authUser.id)
        .single()

      user = {
        name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        email: profile?.email || authUser.email || '',
      }
    }
  } catch {
    // Not authenticated — that's fine
  }

  return <Nav user={user} />
}
