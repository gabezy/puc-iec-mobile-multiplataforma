// src/routes/RootStack.tsx
//
// CAMADA ROUTES — navegação do app.
// Doc: https://reactnavigation.org/docs/native-stack-navigator

import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from '@/components/BottomTabs';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/screens/Login';
import MovieDetail from '@/screens/MovieDetail';

export type RootStackParamList = {
  Login: undefined;
  Tabs: undefined;
  Detail: { id: number; title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStack() {
  const { user, isLoading } = useAuth();

  // Restaurando sessão salva — evita piscar a tela de login
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Telas condicionais: ao logar/deslogar o navigator troca o grupo de telas sozinho.
  // Doc: https://reactnavigation.org/docs/auth-flow
  return (
    <Stack.Navigator
      screenOptions={{
        // Garante header back button visível em web e nativo
        headerBackVisible: true,
        headerBackTitle: 'Voltar',
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="Tabs" component={BottomTabs} options={{ headerShown: false }} />
          <Stack.Screen
            name="Detail"
            component={MovieDetail}
            options={({ route }) => ({
              title: route.params.title,
              headerBackTitle: 'Voltar',
            })}
          />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}
