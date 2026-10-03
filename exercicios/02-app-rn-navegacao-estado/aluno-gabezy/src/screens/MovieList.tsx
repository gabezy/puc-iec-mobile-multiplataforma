import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { usePopularMovies } from '@/queries/movies/get-popular-movies';
import { useSearchMovies } from '@/queries/movies/search-movies';
import { isTokenError, isTokenMissing } from '@/services/api';
import TokenMissingScreen from '@/components/TokenMissingScreen';
import { useCounterStore } from '@/store/counterStore';
import MovieCardList from '@/components/MovieCardList';
import SearchBar from '@/components/SearchBar';

export default function MovieList() {
  const [search, setSearch] = useState('');
  const isSearching = search.length >= 2;

  const popular = usePopularMovies();
  const searchResult = useSearchMovies(search);
  const { data, isLoading, error, refetch } = isSearching ? searchResult : popular;

  const count = useCounterStore((s) => s.count);
  const [dismissed, setDismissed] = useState<number[]>([]);
  const movies = (data?.results ?? []).filter((m) => !dismissed.includes(m.id));

  if (isTokenMissing || isTokenError(error)) {
    return <TokenMissingScreen />;
  }

  const renderContent = () => {
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
      <MovieCardList
        movies={movies}
        onDismiss={(id) => setDismissed((ids) => [...ids, id])}
        onRefresh={refetch}
        refreshing={isLoading}
        emptyMessage={isSearching ? `Nenhum resultado para "${search}".` : undefined}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Counter: {count}</Text>
      <SearchBar onSearch={setSearch} />
      {renderContent()}
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
