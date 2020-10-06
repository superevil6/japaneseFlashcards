import * as React from 'react';
import { StyleSheet, Button, View, SafeAreaView, Text, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export default function Home({navigation}) {
  return (
    <View>
        <Text>Study:</Text>
        <Button
            title="Kanji"
            onPress={() =>
                navigation.navigate('Kanji')
            }
        />
        <Button
            title="Vocabulary"
            onPress={() =>
                navigation.navigate('Vocabulary')
            }
        />
        <Button
            title="Grammar"
            onPress={() =>
                navigation.navigate('Grammar')
            }
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});