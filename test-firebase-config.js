// Script de prueba para verificar la configuración de Firebase
console.log('=== Verificación de Configuración de Firebase ===');

// Verificar variables de entorno
console.log('Variables de entorno:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Configurada' : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Configurada' : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Configurada' : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✅ Configurada' : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✅ Configurada' : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_APP_ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✅ Configurada' : '❌ No configurada');
console.log('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID:', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? '✅ Configurada' : '❌ No configurada');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD_KrwxHAOzZPAFwhhiZ3WTE7cOQslkhMw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "riskgrid-9f3f7.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "riskgrid-9f3f7",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "riskgrid-9f3f7.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "932152803623",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:932152803623:web:2792670fc0173cb718e902",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-BPJ4KR9ZDD"
};

console.log('\n=== Configuración Final de Firebase ===');
console.log('Proyecto ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('API Key:', firebaseConfig.apiKey ? '✅ Configurada' : '❌ No configurada');

// Verificar que todas las claves requeridas estén presentes
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key]);

if (missingKeys.length === 0) {
  console.log('\n✅ Configuración de Firebase: COMPLETA');
} else {
  console.log('\n❌ Configuración de Firebase: INCOMPLETA');
  console.log('Claves faltantes:', missingKeys);
}
