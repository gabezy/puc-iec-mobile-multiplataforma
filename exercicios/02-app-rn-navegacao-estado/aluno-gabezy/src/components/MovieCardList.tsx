import { FlatList, StyleSheet, Text } from 'react-native';
import type { Movie } from '@/types/movie';
import MovieCard from './MovieCard';

type Props = {
  movies: Movie[];
  onDismiss: (id: number) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  emptyMessage?: string;
};

export default function MovieCardList({
  movies,
  onDismiss,
  onRefresh,
  refreshing = false,
  emptyMessage = 'Nenhum filme encontrado.',
}: Props) {
  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <MovieCard movie={item} onDismiss={onDismiss} />}
      onRefresh={onRefresh}
      refreshing={refreshing}
      ListEmptyComponent={<Text style={styles.empty}>{emptyMessage}</Text>}
    />
  );
}

const styles = StyleSheet.create({
  empty: { color: '#666', textAlign: 'center', marginTop: 24 },
});
