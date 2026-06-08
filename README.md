<<<<<<< HEAD
# 🎬 Кінотрекер

Спільний трекер фільмів для друзів — Яся, Діма, Женя, Саша.

## Що вміє застосунок

- Вибір профілю перед входом (Яся / Діма / Женя / Саша)
- Спільний список фільмів, серіалів і мультиків
- Кожен може додавати, редагувати і видаляти будь-який запис
- Кожен ставить **свою оцінку від 1 до 5** — чужу не можна змінити
- Статус **"Переглянуто / Не переглянуто"** визначається автоматично:
  якщо хоч одна оцінка є — фільм переглянуто
- Фільтри за типом і статусом
- Реал-тайм синхронізація — всі бачать зміни одразу (через Firebase)

---

## Структура проекту

```
src/
├── components/
│   ├── ProfileScreen.tsx     # Екран вибору профілю
│   ├── MainScreen.tsx        # Головний екран (оркестрація)
│   ├── MovieTable.tsx        # Таблиця зі списком фільмів
│   └── MovieModal.tsx        # Модал додавання / редагування
├── hooks/
│   └── useMovies.ts          # Вся логіка Firestore (реал-тайм)
├── types/
│   └── index.ts              # TypeScript-типи
├── utils/
│   ├── constants.ts          # Профілі, мітки, вкладки
│   └── helpers.ts            # Чисті функції (isWatched, updateRating)
├── styles/
│   └── global.css            # CSS-змінні, темна тема, reset
├── firebase.ts               # Ініціалізація Firebase
├── App.tsx                   # Кореневий компонент
└── main.tsx                  # Точка входу
```

---

## Встановлення і запуск

### 1. Встанови залежності

```bash
npm install
```

### 2. Налаштуй Firebase

1. Перейди на [console.firebase.google.com](https://console.firebase.google.com)
2. Створи новий проект
3. Додай **веб-застосунок** (кнопка `</>`)
4. Скопіюй `firebaseConfig` і встав у `src/firebase.ts`
5. У розділі **Firestore Database** → **Rules** встав:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> Це відкриває доступ без авторизації — підходить для приватного застосунку між друзями.

### 3. Запусти у режимі розробки

```bash
npm run dev
```

### 4. Збери для продакшну

```bash
npm run build
```

---

## Деплой (безкоштовно)

### Варіант A — Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # вибери dist як public folder
npm run build
firebase deploy
```

### Варіант B — Vercel

```bash
npm install -g vercel
vercel
```

Vercel сам визначить Vite і розгорне автоматично.

---

## Додати нового учасника

У `src/utils/constants.ts` додай рядок у масив `PROFILES`:

```ts
{ id: 'petro', name: 'Петро', initials: 'П', color: '#E6F1FB', textColor: '#0C447C' },
```

У `src/types/index.ts` додай новий id у тип `ProfileId`:

```ts
export type ProfileId = 'yasya' | 'dima' | 'zhenya' | 'sasha' | 'petro'
```
=======
# movie-tracker
>>>>>>> 27c007799b1d25095165ad9908b168faed7431c6
