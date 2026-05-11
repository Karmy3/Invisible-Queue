import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { FontAwesome5, Ionicons, MaterialCommunityIcons, } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocation } from '@/hooks/useLocation';
const { width } = Dimensions.get('window');

interface ServiceItem {
  id: string;
  name: string;
  icon: any;
  color: string;
  type: 'material' | 'font5';
}

const COLORS = {
  primary: '#27AE60',
  background: '#F4F7FB',
  white: '#FFFFFF',
  text: '#1E293B',
  subText: '#64748B',
  border: '#E2E8F0',
};

const SERVICES: ServiceItem[] = [
  {
    id: '1',
    name: 'Hospitals',
    icon: 'medical-bag',
    color: '#5DADE2',
    type: 'material',
  },
  {
    id: '2',
    name: 'Restaurants',
    icon: 'silverware-fork-knife',
    color: '#E67E22',
    type: 'material',
  },
  {
    id: '3',
    name: 'Salons & Spa',
    icon: 'content-cut',
    color: '#9B59B6',
    type: 'material',
  },
  {
    id: '4',
    name: 'Service Centres',
    icon: 'tools',
    color: '#27AE60',
    type: 'font5',
  },
  {
    id: '5',
    name: 'Appointments',
    icon: 'card-account-details',
    color: '#A93226',
    type: 'material',
  },
  {
    id: '6',
    name: 'Banks',
    icon: 'university',
    color: '#2C3E50',
    type: 'font5',
  },
];

export default function ServicesScreen() {
  const [menuVisible, setMenuVisible] =useState(false);
  const { session } = useAuth();
  const router = useRouter();
  const { address, location, errorMsg } = useLocation();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuVisible(false);
    router.replace('/choice');
  };
  const getInitials = (
    email: string | undefined
  ) => {
    if (!email) return '??';
    return email.substring(0, 2).toUpperCase();
  };
  const handleCategoryPress = (categoryName: string) => {
    if (!location) {
      alert("Attente de votre position GPS...");
      return;
    }

    router.push({
      pathname: "/select-company",
      params: { 
        category: categoryName, 
        userLat: location.coords.latitude.toString(),
        userLon: location.coords.longitude.toString()
      }
    });
  };

  const renderServiceItem = ({
    item,
  }: {
    item: ServiceItem;
  }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.serviceItem}
      onPress={() => handleCategoryPress(item.name)}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: item.color },
        ]}
      >
        {item.type === 'material' ? (
          <MaterialCommunityIcons
            name={item.icon}
            size={30}
            color="white"
          />
        ) : (
          <FontAwesome5
            name={item.icon}
            size={24}
            color="white"
          />
        )}
      </View>

      <Text style={styles.serviceText}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.locationContainer}
          >
            <View style={styles.locationIcon}>
              <Ionicons
                name="location-sharp"
                size={18}
                color="white"
              />
            </View>

            <View
              style={styles.locationTextContainer}
            >
              <Text style={styles.locationTopText}>My exact position</Text>
              <Text 
                style={styles.locationName} 
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {address}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.headerIcons}>
            {/* NOTIFICATION */}

            <TouchableOpacity
              style={styles.iconButton}
            >
              <Ionicons
                name="notifications-outline"
                size={22}
                color={COLORS.text}
              />
            </TouchableOpacity>

            {/* AVATAR */}
            <TouchableOpacity
                style={[styles.avatarContainer, { marginLeft: 10 }]}
                onPress={() => setMenuVisible(true)}
                >
                {/* On vérifie si c'est un utilisateur réel (pas anonyme) */}
                {session && !session.user.is_anonymous ? (
                    <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>
                        {getInitials(session.user.email)}
                    </Text>
                    </View>
                ) : (
                    <View style={[styles.avatarCircle, { backgroundColor: '#c4dcfe' }]}>
                    <Ionicons name="person" size={24} color="white" />
                    </View>
                )}
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH */}

        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color={COLORS.subText}
              style={{ marginLeft: 15 }}
            />

            <TextInput
              placeholder="Search services..."
              placeholderTextColor="#94A3B8"
              style={styles.searchInput}
            />

            <TouchableOpacity>
              <Ionicons
                name="mic-outline"
                size={22}
                color={COLORS.subText}
                style={{ marginRight: 15 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* MAP IMAGE */}
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/gps.jpg')}
            style={styles.illustration}
            resizeMode="cover"
          />
        </View>

        {/* SERVICES */}
        <View style={styles.contentCard}>
          <Text style={styles.sectionTitle}>
            What do you need today?
          </Text>

          <FlatList
            data={SERVICES}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={
              styles.listContent
            }
          />
        </View>
      </ScrollView>

      {/* PROFILE MENU */}
        {menuVisible && (
        <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setMenuVisible(false)}
        >
            <View style={styles.profileMenu}>
            {/* On affiche le menu complet seulement si c'est un vrai compte */}
            {session && !session.user.is_anonymous ? (
                <>
                <Text style={styles.menuEmail}>{session.user.email}</Text>
                <View style={styles.separator} />
                    {/* PROFIL (Pour utilisateur connecté) */}
                    <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                        setMenuVisible(false);
                        // router.push('/profile'); 
                    }}
                    >
                    <Ionicons name="person-outline" size={20} color="#333" />
                    <Text style={styles.menuItemText}>Profile</Text>
                    </TouchableOpacity>

                    {/* SETTINGS */}
                    <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                        setMenuVisible(false);
                        // router.push('/settings');
                    }}
                    >
                    <Ionicons name="settings-outline" size={20} color="#333" />
                    <Text style={styles.menuItemText}>Settings</Text>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    {/* LOGOUT */}
                    <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleLogout}
                    >
                    <Ionicons name="log-out-outline" size={20} color="#8eb8ff" />
                    <Text style={[styles.menuItemText, { color: '#8eb8ff' }]}>
                        Logout
                    </Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                {/* MODE GUEST */}
                <Text style={[styles.menuEmail, { color: '#8eb8ff' }]}>Mode Guest</Text>
                <Text style={styles.guestHint}>"Register so you no longer have to enter your name and email." : "Log in to access your files and save time."</Text>
                
                <View style={styles.separator} />

                <TouchableOpacity
                    style={styles.createAccountBtn}
                    onPress={() => {
                    setMenuVisible(false);
                    router.push('/choice');
                    }}
                >
                    <Ionicons name="person-add-outline" size={20} color="white" />
                    <Text style={styles.createAccountText}>Create an account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.menuItem, { marginTop: 10 }]}
                    onPress={() => {
                    setMenuVisible(false);
                    router.replace('/signIn');
                    }}
                >
                    <Ionicons name="log-in-outline" size={22} color="#333" />
                    <Text style={styles.menuItemText}>Log in</Text>
                </TouchableOpacity>
                </>
            )}
            </View>
        </TouchableOpacity>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationIcon: {
    width: 32,
    height: 32,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTextContainer: {
    marginLeft: 12,
  },
  locationTopText: {
    fontSize: 11,
    color: COLORS.subText,
    fontWeight: '600',
    marginBottom: 3,
  },
  locationName: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#c4dcfe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8eb8ff',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingHorizontal: 12,
  },
  imageContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  illustration: {
    width: width - 40,
    height: 220,
    borderRadius: 25,
  },
  contentCard: {
    backgroundColor: COLORS.white,
    marginTop: 10,
    marginHorizontal: 15,
    marginBottom: 30,
    borderRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 15,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 25,
  },
  listContent: {
    alignItems: 'center',
  },
  serviceItem: {
    width: width / 3.5,
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    alignItems: 'center',
    paddingVertical: 18,
    margin: 6,
    borderWidth: 1,
    borderColor: '#EDF2F7',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  serviceText: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  profileMenu: {
    position: 'absolute',
    top: 70,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    width: 220,
    elevation: 10,
  },
  menuEmail: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#c4dcfe',
    marginBottom: 10,
    textAlign: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  guestHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginBottom: 5,
  },
  createAccountBtn: {
    backgroundColor: '#c4dcfe',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
    marginTop: 5,
  },
  createAccountText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});