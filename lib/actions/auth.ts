'use server'

import { createClient } from '@/lib/supabase/server'

interface AuthResult {
  success: boolean
  userId?: string
  error?: string
}

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  phone?: string,
): Promise<AuthResult> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

  if (error) return { success: false, error: error.message }
  if (!data.user) return { success: false, error: 'Sign up failed' }

  await supabase.from('users').upsert({
    id: data.user.id,
    email,
    full_name: fullName,
    phone: phone || null,
    user_type: 'customer',
  })

  return { success: true, userId: data.user.id }
}

export async function signIn(
  email: string,
  password: string,
): Promise<AuthResult> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) return { success: false, error: error.message }
  return { success: true, userId: data.user.id }
}
