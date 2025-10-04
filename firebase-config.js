// Configuración de Firebase para el proyecto RiskGrid
// Este archivo contiene la configuración necesaria para Firebase

export const firebaseConfig = {
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
const missingKeys = requiredConfigKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length > 0) {
  console.error('Firebase configuration missing:', missingKeys);
  throw new Error(`Firebase configuration is missing required keys: ${missingKeys.join(', ')}`);
}

console.log('Firebase configuration loaded successfully');
