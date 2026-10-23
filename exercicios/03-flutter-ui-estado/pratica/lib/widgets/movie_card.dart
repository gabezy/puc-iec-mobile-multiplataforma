// lib/widgets/movie_card.dart
//
// Ex1 (TASK 1): componha o card.
// Ex2 (TASK 4): ligue o coração ao estado de favoritos.

import 'package:filmes_flutter/state/favorites.dart';
import 'package:filmes_flutter/widgets/poster_art.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// TASK 4 — descomente para ler o estado (e troque StatelessWidget por ConsumerWidget):
// import 'package:flutter_riverpod/flutter_riverpod.dart';
// import '../state/favorites.dart';
import '../models/movie.dart';
// TASK 1 — descomente para usar o pôster pronto:
// import 'poster_art.dart';

class MovieCard extends ConsumerWidget {
  final Movie movie;
  const MovieCard({super.key, required this.movie});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    //
    // ── Ex2 · TASK 4 — coração de favorito · 🧑‍💻 EM CASA (sozinho) ──────────────────────────────
    // Vire `ConsumerWidget` (build(context, ref)) e:
    //   final isFav = ref.watch(favoritesProvider).contains(movie.id);
    //   ...adicione um IconButton (Icons.favorite / Icons.favorite_border) que chama
    //   ref.read(favoritesProvider.notifier).toggle(movie.id)
    final isFav = ref.watch(favoritesProvider).contains(movie.id);

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Row(
          children: [
            PosterArt(movie: movie),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(movie.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  Row(children: [
                    IconButton(
                      icon: Icon(
                        isFav ? Icons.favorite : Icons.favorite_border,
                        color: isFav ? Colors.red : null,
                        ),
                        onPressed: () => ref.read(favoritesProvider.notifier).toggle(movie.id),
                    ),
                  ]),
                  Row(children: [
                    const Icon(Icons.star, color: Colors.amber, size: 18),
                    Text(' ${movie.rating}'),
                  ]),
                  Text(movie.year, style: const TextStyle(color: Colors.grey)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
