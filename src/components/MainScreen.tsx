// ─────────────────────────────────────────────────────────────
// src/components/MainScreen.tsx
// ─────────────────────────────────────────────────────────────

import { useState } from 'react'
import type { Profile, MovieItem, TabFilter } from '@/types'
import { useMovies } from '@/hooks/useMovies'
import { MovieTable } from './MovieTable'
import { RatingModal } from './RatingModal'
import styles from './MainScreen.module.css'

interface Props {
  profile: Profile
  onSwitchProfile: () => void
}

export function MainScreen({ profile, onSwitchProfile }: Props) {
  const { items, loading, error, refresh, updateRatingOnly } = useMovies()

  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [ratingTarget, setRatingTarget] = useState<{ item: MovieItem; current: number } | null>(null)
  const [saving, setSaving] = useState(false)

  const handleRatingClick = (item: MovieItem, currentRating: number) => {
    setRatingTarget({ item, current: currentRating })
  }

  const handleRatingSave = async (rating: number) => {
    if (!ratingTarget) return
    setSaving(true)
    await updateRatingOnly(ratingTarget.item.id, profile.id, rating)
    setSaving(false)
    setRatingTarget(null)
  }

  return (
    <div className={styles.screen}>

      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <div
            className={styles.avatar}
            style={{ background: profile.color, color: profile.textColor }}
          >
            {profile.initials}
          </div>
          <div>
            <div className={styles.profileName}>{profile.name}</div>
            <div className={styles.appName}>Кінотрекер друзів</div>
          </div>
        </div>

        <div className={styles.topbarRight}>
          {/* Оновити список вручну */}
          <button
            className={styles.btnGhost}
            onClick={refresh}
            disabled={loading}
          >
            {loading ? '⏳' : '↻'} Оновити
          </button>
          <button className={styles.btnGhost} onClick={onSwitchProfile}>
            ↩ Профіль
          </button>
          <a
            className={styles.btnSheets}
            href="https://docs.google.com/spreadsheets/d/1wfMy4kG-aHs-V87u1ZcN6UC0oW81AE_mmNhCQYLaLro/edit"
            target="_blank"
            rel="noopener noreferrer"
          >
            📊 Таблиця
          </a>
        </div>
      </header>

      <div className={styles.hint}>
        💡 Додавай фільми у&nbsp;
        <a
          href="https://docs.google.com/spreadsheets/d/1wfMy4kG-aHs-V87u1ZcN6UC0oW81AE_mmNhCQYLaLro/edit"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Sheets
        </a>
        &nbsp;— тут вони з'являться автоматично. Оцінки синхронізуються назад у таблицю.
      </div>

      {error && <div className={styles.errorMsg}>⚠️ {error}</div>}

      {loading && items.length === 0 ? (
        <div className={styles.statusMsg}>Завантаження з Google Sheets...</div>
      ) : (
        <MovieTable
          items={items}
          currentProfile={profile}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRatingClick={handleRatingClick}
        />
      )}

      {ratingTarget && (
        <RatingModal
          item={ratingTarget.item}
          currentRating={ratingTarget.current}
          onSave={handleRatingSave}
          onClose={() => setRatingTarget(null)}
          saving={saving}
        />
      )}
    </div>
  )
}
