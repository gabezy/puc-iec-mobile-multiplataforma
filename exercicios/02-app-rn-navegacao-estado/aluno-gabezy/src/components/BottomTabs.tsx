import { Pressable, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import MovieList from '@/screens/MovieList';
import FavoriteMovieList from '@/screens/FavoriteMovieList';

export type BottomTabParamList = {
  Movies: undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
  const { signOut, user } = useAuth();
  const userFirstName = user?.name?.split(' ')[0] ?? user?.preferred_username ?? 'Usuário';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          const name =
            route.name === 'Movies'
              ? focused ? 'film' : 'film-outline'
              : focused ? 'heart' : 'heart-outline';
          return <Ionicons name={name} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e50914',
        tabBarInactiveTintColor: 'gray',
        headerRight: () => (
          <Pressable onPress={signOut} hitSlop={8} style={{ marginRight: 16, flexDirection: 'row', alignItems: 'center' }} accessibilityLabel="Sair">
            <Text style={{ color: '#e50914', fontSize: 16, marginRight: 8 }}>{userFirstName}</Text>
            <Ionicons name="log-out-outline" size={24} color="#e50914" />
          </Pressable>
        ),
      })}
    >
      <Tab.Screen name="Movies" component={MovieList} options={{ title: 'Filmes' }} />
      <Tab.Screen name="Favorites" component={FavoriteMovieList} options={{ title: 'Favoritos' }} />
    </Tab.Navigator>
  );
}
