// src/App.tsx — кореневий компонент
import { useState } from 'react'
import type { Profile } from '@/types'
import { ProfileScreen } from '@/components/ProfileScreen'
import { MainScreen } from '@/components/MainScreen'

export function App() {
  const [profile, setProfile] = useState<Profile | null>(null)

  if (!profile) return <ProfileScreen onSelect={setProfile} />

  return <MainScreen profile={profile} onSwitchProfile={() => setProfile(null)} />
}
