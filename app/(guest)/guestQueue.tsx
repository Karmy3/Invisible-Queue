import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert,Image,Dimensions } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
const { width } = Dimensions.get('window');
export default function GuestQueue() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleJoinQueue = async () => {
    if (!name || !email) return Alert.alert("Erreur", "Remplissez tous les champs");

    // 1. On connecte l'utilisateur en ANONYME
    const { data, error: authError } = await supabase.auth.signInAnonymously({
      options: {
        data: { name: name, email: email, is_Guest: true, role: 'client' }
      }
    });

    if (authError) return Alert.alert("Erreur", authError.message);

    // 2. Une fois connecté, on ne crée pas de ticket tout de suite !
    // On le dirige vers le choix des services
    router.push('/home'); 
  };

  return (
    <View style={styles.container}>

      <Image 
        source={require('@/assets/images/illustration.jpg')}
        style={styles.illustration}
        resizeMode="contain"
      />

      <Text style={styles.title}>Join the Queue</Text>
      <Text style={styles.subtitle}>As a guest</Text>

      <TextInput 
        placeholder="Your name" 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
      />
      <TextInput 
        placeholder="Your email" 
        style={styles.input} 
        value={email} 
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.submitBtn} onPress={handleJoinQueue}>
        <Text style={styles.submitBtnText}>Take a Ticket</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 30, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  input: {
    borderBottomWidth: 1,
    borderColor: '#CCC',
    height: 50,
    marginBottom: 25,
    fontSize: 16,
  },
  submitBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: { fontSize: 18, fontWeight: 'bold' },
  illustration: { 
    width: width * 0.9,
    height: 260,
  },
});