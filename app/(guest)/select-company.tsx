import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';

export default function SelectCompanyScreen() {
  const { category, userLat, userLon } = useLocalSearchParams<{ 
    category: string; 
    userLat: string; 
    userLon: string 
  }>();
  
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchNearbyCompanies();
  }, [category]); // Re-charger si la catégorie change

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const fetchNearbyCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('category', category);

      if (data) {
        const RAYON_MAX = 10; // Limite à 10 km 

        const formattedData = data
          .map((company: any) => ({
            ...company,
            distance: calculateDistance(
              parseFloat(userLat), 
              parseFloat(userLon), 
              company.latitude, 
              company.longitude
            )
          }))
          // FILTRAGE : On ne garde que celles qui sont dans le rayon
          .filter(company => company.distance <= RAYON_MAX) 
          // TRI : La plus proche en premier
          .sort((a, b) => a.distance - b.distance);

        setCompanies(formattedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderCompany = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({ 
        pathname: '/company-services',
        params: { id: item.id, name: item.name } 
      })}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.companyName}>{item.name}</Text>
        <Text style={styles.companyAddress} numberOfLines={1}>{item.address}</Text>
        <View style={styles.distanceBadge}>
          <Ionicons name="navigate-circle" size={14} color="#007AFF" />
          <Text style={styles.distanceText}>{item.distance.toFixed(1)} km de vous</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CCC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{category}</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Recherche des établissements...</Text>
        </View>
      ) : (
        <FlatList
          data={companies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCompany}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="search-outline" size={50} color="#CCC" />
              <Text style={styles.empty}>Aucun établissement trouvé à proximité.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: '#FFF' },
  backButton: { marginRight: 15 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  list: { padding: 20 },
  card: { 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 15, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3 
  },
  cardInfo: { flex: 1 },
  companyName: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  companyAddress: { fontSize: 13, color: '#888', marginTop: 4 },
  distanceBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  distanceText: { fontSize: 12, color: '#007AFF', marginLeft: 5, fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 10, color: '#666' },
  empty: { textAlign: 'center', marginTop: 15, color: '#999', fontSize: 16 }
});