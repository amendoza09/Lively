import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';

export default function SplashScreen() {
  const [fadeAnim] = useState(new Animated.Value(1));
  const [scaleAnim] = useState(new Animated.Value(0.28));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.out(Easing.ease), 
          useNativeDriver: true,
        })
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <Animated.View style={[
        styles.container,
      ]}>
      <Animated.Image
        source={require('../assets/logo.png')}
        style={[
          styles.img, {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#211A1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
});