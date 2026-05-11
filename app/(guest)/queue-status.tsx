import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function QueueStatusScreen() {
  const { ticketId } = useLocalSearchParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // Calcule le nombre de personnes devant
  const peopleAhead = Math.max(0, (ticket?.position || 1) - 1);

  // Calcule le temps total (en minutes)
  // On multiplie par le average_time récupéré depuis la jointure SQL
  const estimatedTime = peopleAhead * (ticket?.services?.average_time || 0);

  useEffect(() => {
    fetchTicketData();

    const subscription = supabase
      .channel('queue_changes')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'queue_entries', filter: `id=eq.${ticketId}` }, 
        (payload) => {
          setTicket(payload.new); // Mise à jour automatique si la position change !
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [ticketId]);

  const fetchTicketData = async () => {
    const { data, error } = await supabase
      .from('queue_entries')
      .select('*, services(name)')
      .eq('id', ticketId)
      .single();

    if (data) setTicket(data);
    setLoading(false);
  };

  if (loading) return <ActivityIndicator size="large" style={{flex: 1}} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Virtual Ticket</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.serviceName}>{ticket?.services?.name}</Text>
        
        <View style={styles.ticketCard}>
          <Text style={styles.label}>Your current position</Text>
          <Text style={styles.position}>#{ticket?.position || '?'}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Ionicons name="people" size={20} color="#666" />
            <Text style={styles.infoText}>
              In front of you : {Math.max(0, (ticket?.position || 1) - 1)} pers.
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#666" />
            <Text style={styles.infoText}>
              {estimatedTime > 0 
                ? `Estimated wait : ~${estimatedTime} min` 
                : "It's your turn soon !"}
            </Text>
          </View>

        </View>

        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => router.replace('/home')}
        >
          <Text style={styles.cancelText}>Leave the line</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F7FF' },
  header: { padding: 20, backgroundColor: '#FFF', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, alignItems: 'center', padding: 20, justifyContent: 'center' },
  serviceName: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#007AFF' },
  ticketCard: { 
    backgroundColor: 'white', 
    padding: 30, 
    borderRadius: 30, 
    alignItems: 'center', 
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  label: { fontSize: 14, color: '#888', textTransform: 'uppercase', letterSpacing: 1 },
  position: { fontSize: 80, fontWeight: 'bold', color: '#333', marginVertical: 10 },
  divider: { height: 1, backgroundColor: '#EEE', width: '100%', marginBottom: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  infoText: { fontSize: 16, color: '#444', marginLeft: 10 },
  cancelButton: { marginTop: 40 },
  cancelText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 16 }
});