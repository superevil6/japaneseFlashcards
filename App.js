import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
import Home from './pages/home';
import Kanji from './pages/kanji';
import Vocab from './pages/vocab';
import Grammar from './pages/grammar';

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen
          name="Kanji"
          component={Kanji}
          options={{ title: 'Kanji' }}
        />
        <Stack.Screen
          name="Vocabulary"
          component={Vocab}
          options={{ title: 'Vocabulary' }}
        />
        <Stack.Screen
          name="Grammar"
          component={Grammar}
          options={{ title: 'Grammar' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Stack = createStackNavigator();
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
