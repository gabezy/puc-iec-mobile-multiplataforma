import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onSearch: (term: string) => void;
  placeholder?: string;
  debounceMs?: number;
  editable?: boolean;
};

// Input de busca com debounce: só chama onSearch depois que o usuário
// para de digitar por `debounceMs`, evitando uma request por tecla.
export default function SearchBar({
  onSearch,
  placeholder = 'Buscar filmes...',
  debounceMs = 400,
  editable = true,
}: Props) {
  const [text, setText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(text.trim()), debounceMs);
    return () => clearTimeout(timer);
  }, [text, debounceMs, onSearch]);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#888" />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        style={styles.input}
        autoCorrect={false}
        editable={editable}
        returnKeyType="search"
      />
      {text.length > 0 && (
        <Pressable onPress={() => setText('')} hitSlop={8} accessibilityLabel="Limpar busca">
          <Ionicons name="close-circle" size={18} color="#888" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 0 },
});
