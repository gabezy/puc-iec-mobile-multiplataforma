// lib/state/favorites.dart
//
// Ex2 (TASK 2): estado compartilhado de favoritos com Riverpod (local).
// Ex4 (TASK 7): mesmo provider, mas sincronizado com Firestore (cloud).

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// TODO [TASK 7]: descomente quando for fazer a persistência Firestore
// import 'package:cloud_firestore/cloud_firestore.dart';
// import 'package:flutter/foundation.dart'; // debugPrint

// ── Ex2 · TASK 2 — implemente o provider de favoritos · 🧑‍🏫 EM AULA (juntos) ──────────────────
// Guarde os ids favoritados (um Set<int>) e exponha toggle(id) e clear():
//
//   class FavoritesNotifier extends Notifier<Set<int>> {
//     @override
//     Set<int> build() => {};
//     void toggle(int id) {
//       state = state.contains(id)
//           ? ({...state}..remove(id))
//           : {...state, id};
//     }
//     void clear() => state = {};          // usado pelo botão "limpar" (TASK 6)
//   }
//
//   final favoritesProvider =
//       NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);
//

class FavoritesNotifier extends Notifier<Set<int>> {
  static const _favDoc = 'favorites/meus-favoritos'; // 1 documento por aluno (seu projeto = seu Firestore)

  @override
  Set<int> build() {
    _load(); // dispara leitura async; state começa vazio até o Firestore responder
    return {};
  }

  Future<void> _load() async {
    try {
      final doc = await FirebaseFirestore.instance.doc(_favDoc).get();
      final ids = (doc.data()?['ids'] as List<dynamic>?)?.cast<int>() ?? <int>[];
      state = ids.toSet();
    } catch (e) {
      debugPrint('Firestore (ler): $e');
    }
  }

  void toggle(int id) {
    state = state.contains(id) ? ({...state}..remove(id)) : {...state, id};
    _persist(state); // grava no Firestore em paralelo
  }

  void clear() {
    state = {};
    _persist(state); // grava no Firestore em paralelo
  }

  Future<void> _persist(Set<int> next) async {
    try {
      await FirebaseFirestore.instance.doc(_favDoc).set({'ids': next.toList()});
    } catch (e) {
      debugPrint('Firestore (gravar): $e');
    }
  }


}

final favoritesProvider = NotifierProvider<FavoritesNotifier, Set<int>>(FavoritesNotifier.new);