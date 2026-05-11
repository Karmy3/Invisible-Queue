import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert,Image, Dimensions } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSignUp = async () => {
    if (password !== confirmPassword) return Alert.alert("Erreur", "Les mots de passe diffèrent");
    if (!name) return Alert.alert("Erreur", "Veuillez entrer votre nom complet");
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { 
          name: name, 
          role: 'client',
          is_Guest: false
        } 
      }
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

      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>Create an account, It's free</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          placeholder="Name" 
          style={styles.input} 
          onChangeText={setName} 
        />
      </View>

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

      <View style={styles.inputContainer}>
          <TextInput 
            placeholder="Confirm Password" 
            style={styles.input} 
            secureTextEntry={!isPasswordVisible}
            onChangeText={setConfirmPassword} 
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
        <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp}>
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.guestBtn}
            onPress={() => router.push('/guest-queue') /* Redirection vers la page de file d'attente pour les invités */ }
        >
        <Text style={styles.guestBtnText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    
      <TouchableOpacity onPress={() => router.push('/signIn')}>
        <Text style={styles.footerLink}>Already have an account? Sign In</Text>
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
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 5},
  input: { flex: 1, height: 50, fontSize: 16 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    marginBottom: 15,
  },
  iconButton: {
    padding: 5,
  },
  buttonContainer: { 
    width: '100%', 
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