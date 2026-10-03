// src/components/BottomTabs.tsx
//
// Navegação por abas (Filmes / Favoritos), aninhada no RootStack.
// Doc: https://reactnavigation.org/docs/bottom-tab-navigator

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MovieList from '@/screens/MovieList';
import FavoriteMovieList from '@/screens/FavoriteMovieList';

export type BottomTabParamList = {
  Movies: undefined;
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabs() {
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
      })}
    >
      <Tab.Screen name="Movies" component={MovieList} options={{ title: 'Filmes' }} />
      <Tab.Screen name="Favorites" component={FavoriteMovieList} options={{ title: 'Favoritos' }} />
    </Tab.Navigator>
  );
}
