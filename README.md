# RISKGRID
WEB RISK GRID - ACTA 2025

## Configuración del Proyecto

### Variables de Entorno

#### Para Next.js (aplicación principal):

1. Copia el archivo `env.example` y renómbralo como `.env.local`
2. Reemplaza los valores de ejemplo con tus credenciales reales:

```bash
cp env.example .env.local
```

3. Edita el archivo `.env.local` con tus credenciales:

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_real
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=tu_measurement_id

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_mapbox_token_aqui
```

#### Para archivos HTML estáticos (portal.html):

1. Copia el archivo `config.example.js` y renómbralo como `config.js`
2. Reemplaza los valores con tus credenciales reales:

```bash
cp config.example.js config.js
```

3. Edita el archivo `config.js` con tus credenciales de Firebase y Mapbox

### Obtener tokens:

- **Firebase**: Ve a [Firebase Console](https://console.firebase.google.com/) → Configuración del proyecto
- **Mapbox**: Ve a [Mapbox Account](https://account.mapbox.com/access-tokens/) → Create a token

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

### Nota Importante
- Los archivos `.env.local` y `config.js` contienen credenciales sensibles y NO deben subirse a Git
- Cada desarrollador debe crear sus propios archivos con sus credenciales
- Si cambias las credenciales, solo actualiza tus archivos locales
- Los archivos de ejemplo (`env.example` y `config.example.js`) SÍ se suben a Git para referencia
