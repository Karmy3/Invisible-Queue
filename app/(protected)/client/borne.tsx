import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Dimensions,Image } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface ServiceItem {
  id: string;
  name: string;
  icon: any;
  color: string;
  type: 'material' | 'font5';
}

// Simulation des services (à lier plus tard à la DB Supabase)
const SERVICES: ServiceItem[] = [
  { id: '1', name: 'Hospitals & Clinics', icon: 'medical-bag', color: '#5DADE2', type: 'material' },
  { id: '2', name: 'Restaurants & Pubs', icon: 'restaurant', color: '#E67E22', type: 'material' },
  { id: '3', name: 'Salons & Spa', icon: 'content-cut', color: '#9B59B6', type: 'material' },
  { id: '4', name: 'Service Centres', icon: 'tools', color: '#27AE60', type: 'font5' },
  { id: '5', name: 'Government Appointments', icon: 'card-account-details', color: '#A93226', type: 'material' },
  { id: '6', name: 'Banks', icon: 'bank', color: '#2C3E50', type: 'font5' },
];

export default function BorneScreen() {
  
  const renderServiceItem = ({ item }: { item: ServiceItem }) => (
  <TouchableOpacity style={styles.serviceItem}>
        <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
        {item.type === 'material' ? (
            <MaterialCommunityIcons name={item.icon} size={30} color="white" />
        ) : (
            <FontAwesome5 name={item.icon} size={25} color="white" />
        )}
        </View>
        <Text style={styles.serviceText}>{item.name}</Text>
    </TouchableOpacity>
    );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Localisation */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={20} color="#27AE60" />
          <View style={styles.locationTextContainer}>
            <Text style={styles.locationTopText}>HI USER, YOU ARE IN</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.locationName}>Université Adventiste Zurcher</Text>
              <Ionicons name="chevron-down" size={16} color="black" />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <Ionicons name="bookmark-outline" size={24} color="black" />
          <Ionicons name="notifications-outline" size={24} color="black" style={{ marginLeft: 15 }} />
        </View>
      </View>

      {/* Barre de Recherche */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" style={{ marginLeft: 10 }} />
          <TextInput 
            placeholder="Search for services..." 
            style={styles.searchInput}
          />
          <Ionicons name="mic-outline" size={20} color="#888" style={{ marginRight: 10 }} />
        </View>
      </View>

      {/* GPS */}
      <View>
        <Image 
            source={require('@/assets/images/gps.jpg')}
            style={styles.illustration}
            resizeMode="contain"
        />
      </View>
      {/* Grille de Services */}
      <View style={styles.contentCard}>
        <Text style={styles.sectionTitle}>What do you want to book?</Text>
        <FlatList
          data={SERVICES}
          renderItem={renderServiceItem}
          keyExtractor={item => item.id}
          numColumns={3}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  locationContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  locationTextContainer: { marginLeft: 10 },
  locationTopText: { fontSize: 10, color: '#888', fontWeight: 'bold' },
  locationName: { fontSize: 14, fontWeight: 'bold', marginRight: 5 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  
  searchSection: { padding: 20, backgroundColor: 'white' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 16 },
  illustration: { 
    width: width * 1.2,
    height: 250,
  },
  contentCard: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  listContent: { alignItems: 'center' },
  serviceItem: {
    width: width / 3.5,
    alignItems: 'center',
    marginBottom: 25,
    marginHorizontal: 5,
  },
  iconCircle: {
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  serviceText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    color: '#444',
    fontWeight: '500',
  },
});