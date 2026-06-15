// src/App.tsx — кореневий компонент
import { useState } from 'react'
import type { Profile } from '@/types'
import { ProfileScreen } from '@/components/ProfileScreen'
import { MovieScreen } from '@/components/MovieScreen'
import { SceneSelection } from '@/components/SceneSelection'

export function App() {
  const [scene, setScene] = useState<'profile' | 'selection' | 'main'>('profile')
  const [profile, setProfile] = useState<Profile | null>(null)

  // Initial: choose profile
  if (scene === 'profile') {
    return (
      <ProfileScreen
        onSelect={(p) => {
          setProfile(p)
          setScene('selection')
        }}
      />
    )
  }

  // After profile: choose scene
  if (scene === 'selection') {
    return <SceneSelection onChooseMain={() => setScene('main')} />
  }

  // Main scene: requires profile
  if (scene === 'main' && profile) {
    return (
      <MovieScreen
        profile={profile}
        onSwitchProfile={() => {
          setProfile(null)
          setScene('profile')
        }}
      />
    )
  }

  return null
}
