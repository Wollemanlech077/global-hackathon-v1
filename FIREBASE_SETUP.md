# Configuración de Firebase - Solución al Error de Registro

## Problema Identificado
El error "Firebase: Error (auth/configuration-not-found)" indica que Firebase no puede encontrar la configuración de autenticación.

## Soluciones Implementadas

### 1. Configuración Mejorada de Firebase
- ✅ Actualizada la configuración en `src/lib/firebase.ts`
- ✅ Agregada validación de configuración
- ✅ Mejorado el manejo de errores

### 2. Manejo de Errores Mejorado
- ✅ Mensajes de error en español
- ✅ Manejo específico de errores de Firebase
- ✅ Validación de contraseñas

### 3. Archivos de Configuración
- ✅ `firebase-config.js` - Configuración alternativa
- ✅ `config.js` - Configuración del proyecto

## Pasos para Solucionar el Problema

### Opción 1: Crear archivo .env.local (Recomendado)
1. Crea un archivo `.env.local` en la raíz del proyecto
2. Agrega el siguiente contenido:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD_KrwxHAOzZPAFwhhiZ3WTE7cOQslkhMw
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=riskgrid-9f3f7.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=riskgrid-9f3f7
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=riskgrid-9f3f7.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=932152803623
NEXT_PUBLIC_FIREBASE_APP_ID=1:932152803623:web:2792670fc0173cb718e902
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-BPJ4KR9ZDD
```

### Opción 2: Verificar Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona el proyecto "riskgrid-9f3f7"
3. Ve a "Authentication" > "Sign-in method"
4. Asegúrate de que "Email/Password" esté habilitado

### Opción 3: Reiniciar el Servidor
1. Detén el servidor de desarrollo (`Ctrl+C`)
2. Ejecuta `npm run dev` nuevamente
3. Limpia la caché del navegador

## Verificación
Después de aplicar las soluciones:
1. Abre la consola del navegador (F12)
2. Verifica que no hay errores de Firebase
3. Intenta registrar un nuevo usuario
4. Los mensajes de error ahora aparecerán en español

## Configuración Actual
- **Proyecto ID**: riskgrid-9f3f7
- **Auth Domain**: riskgrid-9f3f7.firebaseapp.com
- **API Key**: Configurada correctamente
- **Authentication**: Email/Password habilitado

## Contacto
Si el problema persiste, verifica:
1. La conexión a internet
2. Que Firebase Authentication esté habilitado en la consola
3. Que no haya restricciones de CORS
4. Que el proyecto Firebase esté activo
