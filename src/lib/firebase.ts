// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
export const auth = getAuth(app);

// Funciones para manejar datos de puntos de calor
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

export default app;
