// src/components/MovieTable.tsx
import type { MovieItem, Profile, TabFilter, MediaType } from '@/types'
import { PROFILES, TABS, MEDIA_TYPE_LABELS, MEDIA_TYPE_BADGE } from '@/utils/constants'
import { isWatched } from '@/utils/helpers'
import styles from './MovieTable.module.css'

interface Props {
  items: MovieItem[]
  currentProfile: Profile
  activeTab: TabFilter
  onTabChange: (tab: TabFilter) => void
  onRatingClick: (item: MovieItem, currentRating: number) => void
  // onDelete прибрано
}

const MEDIA_TYPES: MediaType[] = ['movie', 'series', 'cartoon', 'tvshow', 'anime']

export function MovieTable({ items, currentProfile, activeTab, onTabChange, onRatingClick }: Props) {

  const filtered = (() => {
    if ((MEDIA_TYPES as string[]).includes(activeTab)) return items.filter(i => i.type === activeTab)
    if (activeTab === 'watched') return items.filter(i => isWatched(i))
    if (activeTab === 'unseen') return items.filter(i => !isWatched(i))
    return items
  })()

  return (
    <div>
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tableWrap}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🎬</span>
            <p>{items.length === 0 ? 'Список порожній. Натисни + Додати' : 'Нічого не знайдено'}</p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.colTitle}>Назва</th>
                <th className={styles.colType}>Тип</th>
                <th className={styles.colNote}>Нотатка</th>
                <th className={styles.colStatus}>
                  Статус<span className={styles.autoHint}>авто</span>
                </th>
                {/* Колонки оцінок — ініціали кожного */}
                {PROFILES.map(p => (
                  <th key={p.id} className={styles.colRating} style={{ color: p.textColor, textShadow: '0 0 1rem 1rem #fff' }}>
                    {p.initials}
                  </th>
                ))}
                {/* Хто додав */}
                <th className={styles.colOwner}>Додав</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <MovieRow
                  key={item.id}
                  item={item}
                  currentProfile={currentProfile}
                  onRatingClick={(r) => onRatingClick(item, r)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

// ─── Один рядок ──────────────────────────────────────────────

interface RowProps {
  item: MovieItem
  currentProfile: Profile
  onRatingClick: (currentRating: number) => void
}

function MovieRow({ item, currentProfile, onRatingClick }: RowProps) {
  const watched = isWatched(item)
  const typeLabel = MEDIA_TYPE_LABELS[item.type] ?? item.type
  const typeBadge = MEDIA_TYPE_BADGE[item.type] ?? 'badge-movie'

  // Знаходимо профіль того хто додав — для кольорового аватара
  const ownerProfile = PROFILES.find(p => p.id === item.owner)

  return (
    <tr className={styles.row}>
      <td className={styles.titleCell}>{item.title}</td>

      <td>
        <span className={`${styles.badge} ${styles[typeBadge]}`}>{typeLabel}</span>
      </td>

      <td>
        {item.note
          ? <span className={styles.note}>{item.note}</span>
          : <span className={styles.noteEmpty}>—</span>
        }
      </td>

      <td>
        <span className={`${styles.statusPill} ${watched ? styles.statusWatched : styles.statusUnseen}`}>
          <span className={`${styles.dot} ${watched ? styles.dotWatched : styles.dotUnseen}`} />
          {watched ? 'Переглянуто' : 'Не переглянуто'}
        </span>
      </td>

      {/* Оцінки */}
      {PROFILES.map(p => {
        const val = item.ratings?.[p.id] ?? 0
        const isMe = p.id === currentProfile.id
        return (
          <td key={p.id} className={styles.ratingCell}>
            <div
              className={`${styles.ratingNum} ${val > 0 ? styles.hasVal : ''} ${isMe ? styles.editable : styles.readonly}`}
              title={isMe ? 'Натисни щоб оцінити' : `${p.name}: ${val || '—'}`}
              onClick={isMe ? () => onRatingClick(val) : undefined}
            >
              {val > 0 ? val : '—'}
            </div>
          </td>
        )
      })}

      {/* Хто додав — кольоровий аватар */}
      <td className={styles.ownerCell}>
        {ownerProfile ? (
          <div
            className={styles.ownerAvatar}
            style={{ background: ownerProfile.color, color: ownerProfile.textColor }}
            title={ownerProfile.name}
          >
            {ownerProfile.initials}
          </div>
        ) : (
          <span className={styles.noteEmpty}>—</span>
        )}
      </td>
    </tr>
  )
}