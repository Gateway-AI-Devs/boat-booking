import { supabase } from './supabase'

/**
 * Upload an avatar for a user and update their profile.
 * Returns the new public URL.
 */
export async function uploadAvatar(userId, file) {
  // Always store as the userId (overwrite previous) — keep extension from file
  const ext  = file.name.split('.').pop().toLowerCase()
  const path = `${userId}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) throw uploadError

  // Get the public URL (bucket is public)
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  // Bust the browser cache with a timestamp query param
  const url = `${publicUrl}?t=${Date.now()}`

  // Save back to the profile
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: url })
    .eq('id', userId)

  if (updateError) throw updateError

  return url
}
