import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert,Image, Dimensions } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) Alert.alert("Erreur", error.message);
    else {
      router.replace('/home');
    }
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/illustration.jpg')}
        style={styles.illustration}
        resizeMode="contain"
      />

      <Text style={styles.title}>Sign In</Text>
      <Text style={styles.subtitle}>Welcome back! Please enter your details</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Email" 
          style={styles.input} 
          onChangeText={setEmail} 
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Password" 
            style={styles.input} 
            secureTextEntry={!isPasswordVisible}
            onChangeText={setPassword} 
          />
          {/* Icône à droite pour basculer la visibilité */}
          <TouchableOpacity 
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconButton}
          >
            <Ionicons 
              name={isPasswordVisible ? "eye-off" : "eye"} 
              size={20} 
              color="#888" 
            />
          </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn}>
          <Text style={styles.btnText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.guestBtn}
            onPress={() => router.push('/guestQueue') /* Redirection vers la page de file d'attente pour les invités */ }
        >
        <Text style={styles.guestBtnText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    
      <TouchableOpacity onPress={() => router.push('/signUp')}>
        <Text style={styles.footerLink}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 30, justifyContent: 'center'},
  illustration: { 
    width: width * 1.2,
    height: 200,
  },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  input: { flex: 1, height: 50, fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    marginBottom: 20,
  },
  iconButton: {
    padding: 5,
  },
  buttonContainer: { 
    width: '100%', 
    gap: 15, 
  },
  signInBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#000000' 
  },
  footerLink: { textAlign:'right', margin: 5, color: '#666', fontWeight: 'bold' },
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