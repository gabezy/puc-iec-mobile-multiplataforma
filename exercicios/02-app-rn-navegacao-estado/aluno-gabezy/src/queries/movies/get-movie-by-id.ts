// src/queries/movies/get-movie-by-id.ts
//
// CAMADA QUERIES — detalhe de 1 filme.
//
// Doc TanStack: https://tanstack.com/query/latest/docs/framework/react/guides/dependent-queries

import { queryOptions, useQueries, useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Movie } from '@/types/movie';

const fetchMovieById = async (id: number) => {
  const res = await api.get<Movie>(`/movie/${id}`);
  return res.data;
};

const fetchMovieOptions = (id: number) => 
  queryOptions({
    queryKey: ['movie', id],
    queryFn: () => fetchMovieById(id),
    enabled: Number.isFinite(id),
  });


export const useMovieById = (id: number) => useQuery(fetchMovieOptions(id));

export const useMovieByIds = (ids: number[]) => 
  useQueries({
    queries: ids.map((id) => fetchMovieOptions(id)),
    combine: (results) => ({
      movies: results.flatMap(r => r.data ? [r.data] : []),
      isLoading: results.some(r => r.isLoading),
      isError: results.some(r => r.isError),
    }),
  });