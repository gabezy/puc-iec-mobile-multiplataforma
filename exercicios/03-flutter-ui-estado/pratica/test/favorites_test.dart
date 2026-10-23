// Ex3 · TASK 9 — teste unitário do `favoritesProvider` ISOLADO (sem UI, sem Firestore)
// com ProviderContainer: começa vazio → toggle(1) adiciona → toggle(1) remove → clear() esvazia.

import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:filmes_flutter/state/favorites.dart';

void main() {
  test('favoritos: toggle e clear', () {
    final c = ProviderContainer();
    addTearDown(c.dispose);

    expect(c.read(favoritesProvider), isEmpty);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isTrue);

    c.read(favoritesProvider.notifier).toggle(1);
    expect(c.read(favoritesProvider).contains(1), isFalse);

    c.read(favoritesProvider.notifier)
      ..toggle(1)
      ..toggle(2);
    expect(c.read(favoritesProvider), {1, 2});

    c.read(favoritesProvider.notifier).clear();
    expect(c.read(favoritesProvider), isEmpty);
  });
}
