// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
// TODO [TASK 9]: gerar testes pra favoritesStore usando IA.
//
// Prompt sugerido:
//   "Gere testes Jest pra useFavoritesStore (Zustand) cobrindo:
//    - toggle adiciona id se não existe
//    - toggle remove id se existe
//    - isFavorite retorna true após add
//    - clear esvazia ids
//    Use describe + beforeEach pra resetar state."
//
// Mínimo 3 testes verdes pra CI passar (somados aos 3 de counterStore = 6 total).

import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(1);
    expect(useFavoritesStore.getState().ids).toEqual([1]);
  });

  test('toggle remove id se existe', () => {
    useFavoritesStore.setState({ ids: [1, 2] });
    useFavoritesStore.getState().toggle(1);
    expect(useFavoritesStore.getState().ids).toEqual([2]);
  });

  test('toggle duas vezes no mesmo id volta ao estado inicial', () => {
    const { toggle } = useFavoritesStore.getState();
    toggle(42);
    toggle(42);
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  test('isFavorite retorna true após add e false para id ausente', () => {
    useFavoritesStore.getState().add(7);
    const { isFavorite } = useFavoritesStore.getState();
    expect(isFavorite(7)).toBe(true);
    expect(isFavorite(8)).toBe(false);
  });

  test('remove tira apenas o id informado', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().remove(2);
    expect(useFavoritesStore.getState().ids).toEqual([1, 3]);
  });

  test('remove de id inexistente não altera ids', () => {
    useFavoritesStore.setState({ ids: [1, 2] });
    useFavoritesStore.getState().remove(99);
    expect(useFavoritesStore.getState().ids).toEqual([1, 2]);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.setState({ ids: [1, 2, 3] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});
