import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>("Chargement de la position...");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        setErrorMsg('Permission de localisation refusée');
        return;
    }

    // Ajout de la précision maximale
    let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest, // Utilise le GPS plutôt que le Wi-Fi/Réseau uniquement
    });
    
    setLocation(currentLocation);

    let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
    });

    if (reverseGeocode.length > 0) {
        let addr = reverseGeocode[0];
        
        // Construction d'une adresse plus détaillée
        const fullAddress = [
        addr.name,       // Nom du lieu ou numéro
        addr.street,     // Rue
        addr.city,       // Ville
        addr.region      // Région/Province
        ].filter(Boolean).join(', '); // On enlève les vides et on joint avec une virgule
        
        setAddress(fullAddress);
    }
    };

  useEffect(() => {
    fetchLocation();
  }, []);

  return { location, address, errorMsg, refresh: fetchLocation };
};