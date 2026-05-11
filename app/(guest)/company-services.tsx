import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function CompanyServicesScreen() {
  const { id, name } = useLocalSearchParams(); // ID de l'entreprise
  const router = useRouter();
  
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // États pour le formulaire invité 
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('company_id', id);

    if (data) setServices(data);
    setLoading(false);
  };

  const handleJoinQueue = (service: any) => {
    setSelectedService(service);
    // Ici, on pourrait vérifier si l'utilisateur est déjà connecté via Auth
    // Pour le MVP, on ouvre le formulaire invité par défaut
    setShowModal(true);
  };

  const confirmRegistration = async () => {
    if (!guestName || !guestEmail) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    // Insertion dans la table queue_entries (Règle 3.4)
    const { data, error } = await supabase
      .from('queue_entries')
      .insert([
        { 
          service_id: selectedService.id,
          guest_name: guestName,
          guest_email: guestEmail,
          status: 'waiting',
          missed_count: 0
        }
      ])
      .select()
      .single();

    if (error) {
      Alert.alert("Erreur", error.message);
      setLoading(false);
    } else {
      setShowModal(false);
      router.push({
        pathname: '/queue-status',
        params: { ticketId: data.id }
      });
    }
  };

  const renderService = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.serviceCard} onPress={() => handleJoinQueue(item)}>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.serviceDesc}>{item.description}</Text>
      </View>
      <View style={styles.timeBadge}>
        <Ionicons name="time-outline" size={14} color="#007AFF" />
        <Text style={styles.timeText}>{item.average_time} min</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
      </View>

      <Text style={styles.sectionTitle}>Choisissez un service</Text>

      {loading ? <ActivityIndicator size="large" style={{marginTop: 50}} /> : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderService}
          contentContainerStyle={{ padding: 20 }}
        />
      )}

      {/* MODAL FORMULAIRE INVITÉ (Règle 3.1 & 3.4) */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rejoindre la file</Text>
            <Text style={styles.modalSubtitle}>Service : {selectedService?.name}</Text>
            
            <TextInput 
              style={styles.input} 
              placeholder="Votre nom complet" 
              value={guestName}
              onChangeText={setGuestName}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Votre email" 
              keyboardType="email-address"
              value={guestEmail}
              onChangeText={setGuestEmail}
            />

            <TouchableOpacity style={styles.btnConfirm} onPress={confirmRegistration}>
              <Text style={styles.btnText}>Confirmer mon ticket</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.btnCancel}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 15 },
  sectionTitle: { fontSize: 16, color: '#666', marginHorizontal: 20, marginTop: 20 },
  serviceCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2
  },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: 'bold' },
  serviceDesc: { fontSize: 13, color: '#888', marginTop: 4 },
  timeBadge: { alignItems: 'flex-end' },
  timeText: { color: '#007AFF', fontWeight: 'bold', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFF', padding: 25, borderRadius: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  modalSubtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  input: { backgroundColor: '#F0F0F0', padding: 15, borderRadius: 10, marginBottom: 15 },
  btnConfirm: { backgroundColor: '#007AFF', padding: 18, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  btnCancel: { textAlign: 'center', marginTop: 15, color: '#FF3B30' }
});