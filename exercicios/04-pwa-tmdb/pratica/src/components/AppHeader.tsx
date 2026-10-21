// src/components/AppHeader.tsx

import { styles } from './AppHeader.styles';

type Props = { title?: string };

export function AppHeader({ title = '🎬 Filmes Populares - themoviedb' }: Props) {
  return (
    <header style={styles.header}>
      <h1 style={styles.h1}>{title}</h1>
    </header>
  );
}
