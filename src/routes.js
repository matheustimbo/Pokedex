import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home'
import Pokedex from './Pokedex'
import PokemonDetails from './PokemonDetails'
import { NavigationContainer } from '@react-navigation/native';
const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
      <NavigationContainer>
        <Stack.Navigator
            headerMode="none"
        >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Pokedex" component={Pokedex} />
            <Stack.Screen name="PokemonDetails" component={PokemonDetails} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}