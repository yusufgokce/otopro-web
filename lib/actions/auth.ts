'use server'

import { createClient } from '@/lib/supabase/server'

interface AuthResult {
  success: boolean
  userId?: string
  error?: string
  needsVerification?: boolean
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

  // Supabase returns a user with identities=[] when email already exists (no error thrown)
  if (data.user.identities?.length === 0) {
    return { success: false, error: 'An account with this email already exists. Please log in.' }
  }

  // If email confirmation is required, the session will be null
  if (!data.session) {
    return { success: false, needsVerification: true, error: 'Check your email to verify your account before continuing.' }
  }

  const { error: upsertErr } = await supabase.from('users').upsert({
    id: data.user.id,
    email,
    full_name: fullName,
    phone: phone || null,
    user_type: 'customer',
  })

  if (upsertErr) {
    console.error('[auth] Failed to create user profile:', upsertErr)
    return { success: false, error: 'Account created but profile setup failed. Please try logging in.' }
  }

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
