// ─────────────────────────────────────────────────────────────
// src/components/ProfileScreen.tsx
//
// Екран вибору профілю — перший екран застосунку.
// Показує 4 картки (Яся, Діма, Женя, Саша).
// Після вибору — передає профіль вгору через onSelect.
// ─────────────────────────────────────────────────────────────

import type { Profile } from '@/types'
import { PROFILES } from '@/utils/constants'
import styles from './ProfileScreen.module.css'

interface Props {
  // Колбек, який викликається після вибору профілю
  onSelect: (profile: Profile) => void
}

export function ProfileScreen({ onSelect }: Props) {
  return (
    <div className={styles.screen}>
      <div className={styles.header}>
        <p className={styles.label}>Кінотрекер</p>
        <h1 className={styles.heading}>Хто ти сьогодні?</h1>
      </div>

      <div className={styles.grid}>
        {PROFILES.map((profile) => (
          <button
            key={profile.id}
            className={styles.card}
            onClick={() => onSelect(profile)}
          >
            {/* Аватар — кольоровий кружок з ініціалом */}
            <div
              className={styles.avatar}
              style={{ background: profile.color, color: profile.textColor }}
            >
              {profile.initials}
            </div>

            <span className={styles.name}>{profile.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
