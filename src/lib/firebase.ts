// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD_KrwxHAOzZPAFwhhiZ3WTE7cOQslkhMw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "riskgrid-9f3f7.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "riskgrid-9f3f7",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "riskgrid-9f3f7.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "932152803623",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:932152803623:web:2792670fc0173cb718e902",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-BPJ4KR9ZDD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);

// Funciones para manejar datos de puntos de calor (legacy)
export const getHeatPoints = async () => {
  try {
    const heatPointsCollection = collection(db, 'heatPoints');
    const snapshot = await getDocs(heatPointsCollection);
    const heatPoints = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return heatPoints;
  } catch (error) {
    console.error('Error getting heat points:', error);
    return [];
  }
};

export const addHeatPoint = async (heatPointData: any) => {
  try {
    const heatPointsCollection = collection(db, 'heatPoints');
    const docRef = await addDoc(heatPointsCollection, heatPointData);
    return docRef.id;
  } catch (error) {
    console.error('Error adding heat point:', error);
    throw error;
  }
};

export const updateHeatPoint = async (id: string, heatPointData: any) => {
  try {
    const heatPointDoc = doc(db, 'heatPoints', id);
    await setDoc(heatPointDoc, heatPointData, { merge: true });
  } catch (error) {
    console.error('Error updating heat point:', error);
    throw error;
  }
};

// Funciones para manejar datos de puntos de crimen
export const getCrimePoints = async () => {
  try {
    const crimePointsCollection = collection(db, 'crimePoints');
    const snapshot = await getDocs(crimePointsCollection);
    const crimePoints = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return crimePoints;
  } catch (error) {
    console.error('Error getting crime points:', error);
    return [];
  }
};

export const getCrimePointsAsGeoJSON = async () => {
  try {
    const crimePoints = await getCrimePoints();
    
    // Convertir a formato GeoJSON
    const geoJSONData = {
      type: "FeatureCollection",
      features: crimePoints.map(point => ({
        type: "Feature",
        properties: {
          intensity: point.intensity,
          risk: point.risk,
          crimes: point.crimes,
          city: point.city,
          incident: point.incident,
          date: point.date,
          details: point.details
        },
        geometry: {
          type: "Point",
          coordinates: point.coordinates || [point.longitude, point.latitude]
        }
      }))
    };
    
    return geoJSONData;
  } catch (error) {
    console.error('Error getting crime points as GeoJSON:', error);
    return {
      type: "FeatureCollection",
      features: []
    };
  }
};

export const addCrimePoint = async (crimePointData: any) => {
  try {
    const crimePointsCollection = collection(db, 'crimePoints');
    const docRef = await addDoc(crimePointsCollection, {
      ...crimePointData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding crime point:', error);
    throw error;
  }
};

export const updateCrimePoint = async (id: string, crimePointData: any) => {
  try {
    const crimePointDoc = doc(db, 'crimePoints', id);
    await setDoc(crimePointDoc, {
      ...crimePointData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating crime point:', error);
    throw error;
  }
};

export const deleteCrimePoint = async (id: string) => {
  try {
    const crimePointDoc = doc(db, 'crimePoints', id);
    await deleteDoc(crimePointDoc);
  } catch (error) {
    console.error('Error deleting crime point:', error);
    throw error;
  }
};

export default app;
