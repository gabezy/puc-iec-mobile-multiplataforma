import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { usePopularMovies } from '@/queries/movies/get-popular-movies';
import { isTokenError, isTokenMissing } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import { useCounterStore } from '@/store/counterStore';
import MovieCardList from '@/components/MovieCardList';

export default function MovieList() {
  const { data, isLoading, error, refetch } = usePopularMovies();
  const count = useCounterStore((s) => s.count);
  // Filmes descartados via swipe (só na sessão atual)
  const [dismissed, setDismissed] = useState<number[]>([]);
  const movies = (data?.results ?? []).filter((m) => !dismissed.includes(m.id));

  // Tela amigável quando token TMDB não foi configurado ou está inválido.
  if (isTokenMissing || isTokenError(error)) {
    return <TokenMissingScreen />;
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Erro: {String(error)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter: {count}</Text>
      <MovieCardList
        movies={movies}
        onDismiss={(id) => setDismissed((ids) => [...ids, id])}
        onRefresh={refetch}
        refreshing={isLoading}
      />
      <Text style={styles.hint}>{data?.results?.length ?? 0} filmes carregados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  hint: { color: '#666', fontSize: 12 },
});
