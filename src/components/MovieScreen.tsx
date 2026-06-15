import { useState } from 'react'
import type { Profile, MovieItem, TabFilter, MovieFormData } from '@/types'
import { useMovies } from '@/hooks/useMovies'
import { MovieTable } from './MovieTable'
import { MovieModal } from './MovieModal'
import { RatingModal } from './RatingModal'
import styles from './MovieScreen.module.css'

interface Props {
  profile: Profile
  onSwitchProfile: () => void
}

export function MovieScreen({ profile, onSwitchProfile }: Props) {
  const { items, loading, error, refresh, addItem, updateRatingOnly } = useMovies()

  const [activeTab, setActiveTab] = useState<TabFilter>('all')
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [ratingTarget, setRatingTarget] = useState<{ item: MovieItem; current: number } | null>(null)
  const [saving, setSaving] = useState(false)

  // ── Додати фільм ─────────────────────────────────────────
  // Якщо користувач поставив оцінку при додаванні — зберігаємо її теж
  const handleSaveNew = async (data: MovieFormData, rating: number) => {
    setSaving(true)
    try {
      const newId = await addItem(data, profile.id)
      if (newId) {
        if (rating > 0) {
          await updateRatingOnly(newId, profile.id, rating)
        }
        setAddModalOpen(false)
      }
    } finally {
      setSaving(false)
    }
  }

  // ── Оцінити ──────────────────────────────────────────────
  const handleRatingClick = (item: MovieItem, current: number) => {
    setRatingTarget({ item, current })
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
          <button className={styles.btnGhost} onClick={refresh} disabled={loading}>
            {loading ? '⏳' : '↻'} Оновити
          </button>
          <button className={styles.btnGhost} onClick={onSwitchProfile}>
            ↩ Профіль
          </button>
          <button className={styles.btnPrimary} onClick={() => setAddModalOpen(true)}>
            + Додати
          </button>
        </div>
      </header>

      {error && <div className={styles.errorMsg}>⚠️ {error}</div>}

      {loading && items.length === 0 ? (
        <div className={styles.statusMsg}>Завантаження...</div>
      ) : (
        <MovieTable
          items={items}
          currentProfile={profile}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onRatingClick={handleRatingClick}
        />
      )}

      {addModalOpen && (
        <MovieModal
          editItem={null}
          currentProfile={profile}
          onSave={handleSaveNew}
          onClose={() => setAddModalOpen(false)}
          saving={saving}
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
