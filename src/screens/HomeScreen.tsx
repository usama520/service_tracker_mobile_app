import React from 'react';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';

const HomeScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.container}>
      <Text
        style={[styles.text, { color: isDarkMode ? '#FFFFFF' : '#000000' }]}
      >
        Hello world
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
  },
});

export default HomeScreen;
