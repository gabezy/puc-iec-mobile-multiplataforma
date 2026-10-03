import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { isAuthSupported } from '@/services/auth';

export default function Login() {
  const { signIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signIn();
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      // Usuário fechou o navegador: não é erro
      if (!/cancel/i.test(message)) setError(message);
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filmes</Text>
      <Text style={styles.subtitle}>Entre para ver os filmes e seus favoritos.</Text>

      {isAuthSupported ? (
        <Pressable
          onPress={handleSignIn}
          disabled={isSigningIn}
          style={({ pressed }) => [styles.button, (pressed || isSigningIn) && styles.buttonPressed]}
        >
          {isSigningIn ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </Pressable>
      ) : (
        <Text style={styles.error}>Login OAuth disponível apenas no app Android/iOS (development build).</Text>
      )}

      {error && <Text style={styles.error}>Erro ao entrar: {error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { color: '#666', textAlign: 'center' },
  button: {
    backgroundColor: '#e50914',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    minWidth: 220,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  error: { color: '#c00', textAlign: 'center' },
});
