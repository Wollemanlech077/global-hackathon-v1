// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_KrwxHAOzZPAFwhhiZ3WTE7cOQslkhMw",
  authDomain: "riskgrid-9f3f7.firebaseapp.com",
  projectId: "riskgrid-9f3f7",
  storageBucket: "riskgrid-9f3f7.firebasestorage.app",
  messagingSenderId: "932152803623",
  appId: "1:932152803623:web:2792670fc0173cb718e902",
  measurementId: "G-BPJ4KR9ZDD"
};

// Verificar que la configuración esté completa
const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  throw new Error(`Firebase configuration is missing required keys: ${missingKeys.join(', ')}`);
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  throw error;
}

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
    return [];
  }
};

export const addHeatPoint = async (heatPointData: any) => {
  try {
    const heatPointsCollection = collection(db, 'heatPoints');
    const docRef = await addDoc(heatPointsCollection, heatPointData);
    return docRef.id;
  } catch (error) {
    throw error;
  }
};

export const updateHeatPoint = async (id: string, heatPointData: any) => {
  try {
    const heatPointDoc = doc(db, 'heatPoints', id);
    await setDoc(heatPointDoc, heatPointData, { merge: true });
  } catch (error) {
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
          details: point.details,
          country: point.country
        },
        geometry: {
          type: "Point",
          coordinates: point.coordinates || [point.longitude, point.latitude]
        }
      }))
    };
    
    return geoJSONData;
  } catch (error) {
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
    throw error;
  }
};

export const deleteCrimePoint = async (id: string) => {
  try {
    const crimePointDoc = doc(db, 'crimePoints', id);
    await deleteDoc(crimePointDoc);
  } catch (error) {
    throw error;
  }
};

export default app;
