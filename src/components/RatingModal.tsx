// src/components/RatingModal.tsx
import { useState, useEffect } from 'react'
import type { MovieItem } from '@/types'
import styles from './RatingModal.module.css'

interface Props {
  item: MovieItem
  currentRating: number
  onSave: (rating: number) => void
  onClose: () => void
  saving?: boolean
}

export function RatingModal({ item, currentRating, onSave, onClose, saving }: Props) {
  const [rating, setRating] = useState(currentRating)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && !saving) onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, saving])

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget && !saving) onClose() }}>
      <div className={styles.modal}>
        <p className={styles.movieTitle}>{item.title}</p>
        <h2 className={styles.heading}>Моя оцінка</h2>

        <div className={styles.picker}>
          <button className={`${styles.btn} ${rating === 0 ? styles.selected : ''}`} onClick={() => setRating(0)}>—</button>
          {[1,2,3,4,5].map(n => (
            <button key={n} className={`${styles.btn} ${rating === n ? styles.selected : ''}`} onClick={() => setRating(n)}>{n}</button>
          ))}
        </div>

        <div className={styles.footer}>
          <button className={styles.btnCancel} onClick={onClose} disabled={saving}>Скасувати</button>
          <button className={styles.btnSave} onClick={() => onSave(rating)} disabled={saving}>
            {saving ? 'Збереження...' : 'Зберегти'}
          </button>
        </div>
      </div>
    </div>
  )
}
