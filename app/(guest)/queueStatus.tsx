import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function QueueStatusScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Ticket</Text>
      <View style={styles.ticketCard}>
        <Text style={styles.position}>#5</Text>
        <Text style={styles.info}>People ahead of you: 4</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#BDE0FE', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  ticketCard: { backgroundColor: 'white', padding: 40, borderRadius: 20, alignItems: 'center', width: '80%' },
  position: { fontSize: 60, fontWeight: 'bold', color: '#000' },
  info: { fontSize: 16, color: '#666', marginTop: 10 }
});