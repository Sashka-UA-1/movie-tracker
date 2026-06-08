// ─────────────────────────────────────────────────────────────
// src/context/ProfileContext.tsx
// React Context для зберігання активного профілю.
//
// Навіщо Context замість пропсів?
//   Профіль потрібен у багатьох компонентах (топбар, таблиця,
//   форма, комірки оцінок). Передавати його через пропси на
//   кожному рівні — незручно. Context вирішує це елегантно.
// ─────────────────────────────────────────────────────────────

import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Profile } from '@/types'

// ── Тип контексту ─────────────────────────────────────────────

interface ProfileContextValue {
  profile: Profile | null                // null = профіль ще не обрано
  setProfile: (p: Profile | null) => void
}

// ── Створення контексту з дефолтним значенням ─────────────────

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  setProfile: () => {},
})

// ── Провайдер — обгортає весь застосунок ──────────────────────

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

// ── Хук для зручного доступу до контексту ────────────────────
// Використання: const { profile, setProfile } = useProfile()

export function useProfile() {
  return useContext(ProfileContext)
}
