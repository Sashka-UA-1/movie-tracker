import { useMemo } from 'react'
import styles from './SceneSelection.module.css'

interface Props {
  onChooseMain: () => void
}

export function SceneSelection({ onChooseMain }: Props) {
  const randHex = () => '#' + Math.floor(Math.random() * 167775).toString(16).padStart(6, '0')

  const bg = () => randHex()

  const isMonday = useMemo(() => {
    try {
      return new Date().getDay() === 1
    } catch (e) {
      return false
    }
  }, [])

  const btnClass = [
    styles.btnPrimary, isMonday ? styles.blink : ''
  ].filter(Boolean).join(' ')

  const whatDay = () => {
    switch (new Date().getDay()) {
      case 1:
        return 'ми в ад за куліси'
      case 2:
        return 'вечер "Наш вечер"'
      case 3:
        return 'вечер випадковості'
      case 4:
        return 'вечер "Наш вечер"'
      case 5:
        return 'вечер настолок'
      case 6:
        return 'вечер настолок'
      case 7:
        return 'вечер "Наш вечер"'
      default:
        return 'вечер випадковості'
    }
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Вибір сцени</h2>
      <h2 className={styles.title}>
        Сьогодні {whatDay()}
      </h2>
      <button
        className={btnClass}
        onClick={onChooseMain}
        style={{ background: bg(), textShadow: '0 0 5px 1rem #111' }}
      >
        Перейти за 4-а билетами в ад, пожалуйста
      </button>

    </div>
  )
}
