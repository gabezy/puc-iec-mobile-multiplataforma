import MovieCardList from "@/components/MovieCardList";
import SearchBar from "@/components/SearchBar";
import { useMovieByIds } from "@/queries/movies/get-movie-by-id";
import { useFavoritesStore } from "@/store/favoritesStore";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function FavoriteMovieList() {
    const [search, setSearch] = useState('');
    const isSearching = search.length >= 2;

    const favoriteMoviesIds = useFavoritesStore((state) => state.ids);
    const { movies, isLoading, isError } = useMovieByIds(favoriteMoviesIds);

    const filteredMovies = isSearching
        ? movies.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
        : movies;

    const renderContent = () => {
        if (isLoading) {
            return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
            );
        }

        if (isError) {
            return (
            <View style={styles.center}>
                <Text>Erro ao carregar filmes favoritos.</Text>
            </View>
            );
        }

        if (movies.length === 0) {
            return (
            <View style={styles.center}>
                <Text>Nenhum filme favorito encontrado.</Text>
            </View>
            );
        }

        return (
            <MovieCardList 
                movies={filteredMovies}
                onDismiss={(id) => useFavoritesStore.getState().remove(id)}
                refreshing={isLoading}
            />
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Filmes Favoritos</Text>
            <SearchBar onSearch={setSearch} editable={!isLoading} />
            {renderContent()}
            <Text style={styles.hint}>{movies?.length ?? 0} filmes favoritos</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, gap: 12 },
    title: { fontSize: 24, fontWeight: 'bold' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    hint: { color: '#666', fontSize: 12 },
});