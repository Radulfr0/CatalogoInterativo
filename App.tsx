import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import DetalhesScreen from './src/app/detalhes';
import HomeScreen from './src/app/index';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Catálogo' }}
        />
        <Stack.Screen
          name="Detalhes"
          component={DetalhesScreen}
          options={{ title: 'Detalhes do Livro' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}