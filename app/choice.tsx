import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>Here you log in securely</Text>
        </View>

        <Image 
          source={require('@/assets/images/welcome.png')}
          style={styles.illustration}
          resizeMode="contain"
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.signUpBtn}
            onPress={() => router.push('/signUp')}
          >
            <Text style={styles.signUpBtnText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.guestBtn}
            onPress={() =>  router.push('/guest-queue')/* Redirection vers la page de file d'attente pour les invités */ }
          >
            <Text style={styles.guestBtnText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF'
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#000000',
    letterSpacing: 0.5 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#808080',
    marginTop: 10 
  },
  illustration: { 
    width: width * 1.2,
    height: 250,
  },
  buttonContainer: { 
    width: '100%', 
    paddingBottom: 20,
    gap: 15, 
  },
  signUpBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpBtnText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#000000' 
  },
  guestBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30, 
    backgroundColor: '#c4dcfe', 
    borderWidth: 1.5,
    borderColor: '#8eb8ff', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestBtnText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#000000' 
  },
});