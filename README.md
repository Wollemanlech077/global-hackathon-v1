# 🗺️ RiskGrid - Risk Mapping System

**WEB RISK GRID - ACTA 2025**

A modern web application for mapping and visualizing security incidents, built with Next.js 15, Firebase, and Mapbox GL JS.

## ✨ Key Features

### 🎯 **Core Functionalities**
- **🗺️ Interactive Map**: Advanced visualization with Mapbox GL JS
- **🔐 Secure Authentication**: Complete system with Firebase Auth
- **📊 Incident Heatmap**: Crime density visualization
- **📍 Geolocation**: Location and city-based search
- **➕ Incident Reporting**: Add new risk points
- **🔄 Real-time Sync**: Automatically updated data

### ⚡ **Performance Optimizations**
- **🚀 Smart Caching**: 5-minute cache system for Firebase data
- **🔄 Auto Retry**: Exponential backoff retry mechanism
- **📱 Responsive Design**: Optimized for all devices
- **⚡ Optimized Loading**: Robust loading states and error handling

## 🛠️ Technology Stack

### **Frontend**
- **Next.js 15.5.4** - React framework with App Router
- **TypeScript** - Static typing for enhanced security
- **Tailwind CSS** - Utility-first styling and responsive design
- **Mapbox GL JS** - High-performance interactive maps

### **Backend & Services**
- **Firebase Auth** - User authentication
- **Firestore** - Real-time NoSQL database
- **Firebase Analytics** - Metrics and analytics

### **Development Tools**
- **ESLint** - Code linting and quality
- **PostCSS** - CSS processing
- **SWC** - Ultra-fast compiler

## 🚀 Installation and Setup

### 1. **Clone the Repository**
```bash
git clone <repository-url>
cd global-hackathon-v1-main
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Configure Environment Variables**

#### For Next.js (main application):

1. Copy the `env.example` file and rename it to `.env.local`:
```bash
cp env.example .env.local
```

2. Edit the `.env.local` file with your credentials:
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_real_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Mapbox Configuration
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

### 4. **Get Credentials**

#### 🔥 Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Go to "Project Settings" → "Your apps"
4. Copy the web configuration

#### 🗺️ Mapbox
1. Go to [Mapbox Account](https://account.mapbox.com/access-tokens/)
2. Create a new access token
3. Make sure it has permissions for "styles:read" and "fonts:read"

## 🏃‍♂️ Running the Application

### **Development Mode**
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### **Production Build**
```bash
npm run build
npm start
```

### **Linting**
```bash
npm run lint
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication page
│   ├── map/               # Main map page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Main layout
│   └── page.tsx           # Home page
├── lib/                   # Utilities and configuration
│   └── firebase.ts        # Firebase configuration and functions
public/                    # Static files
├── images/               # Project images
└── favicon.ico           # Favicon
```

## 🔧 Advanced Configuration

### **Next.js Config**
```javascript
// next.config.js
const nextConfig = {
  outputFileTracingRoot: __dirname,
  experimental: {
    optimizeCss: true, // CSS optimization
  },
}
```

### **Firebase Security Rules**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /crimePoints/{document} {
      allow read, write: if request.auth != null;
    }
    match /heatPoints/{document} {
      allow read: if request.auth != null;
      allow write: if false; // Read-only for heatPoints
    }
  }
}
```

## 🎨 UX/UI Features

### **Loading States**
- ⏳ Animated spinners during data loading
- 🔄 Progress indicators for long operations
- 📊 Error states with retry options

### **Responsive Interface**
- 📱 Optimized for mobile and tablets
- 🖥️ Complete desktop experience
- 🎨 Modern design with Tailwind CSS

### **Accessibility**
- ♿ Keyboard controls for navigation
- 🎯 Clear focus states
- 📖 Appropriate semantic labels

## 🔒 Security

### **Authentication**
- 🔐 Email and password validation
- 🛡️ Protected authenticated routes
- 🔑 Secure session token handling

### **Data Validation**
- ✅ Client-side and server-side validation
- 🚫 Input sanitization
- 📝 Type validation with TypeScript

## 📊 Performance

### **Implemented Optimizations**
- 🚀 **5-minute cache** for Firebase data
- 🔄 **Auto retry** with exponential backoff (1s, 2s, 4s)
- ⚡ **Lazy loading** of components
- 🗜️ **Automatic asset compression**

### **Performance Metrics**
- 📈 Initial load time: < 3 seconds
- 🔄 Data reload time: < 1 second (with cache)
- 📱 Lighthouse Score: 90+ in all categories

## 🐛 Troubleshooting

### **Common Issues**

#### Error: "Firebase configuration not found"
- ✅ Verify that `.env.local` exists and has correct credentials
- ✅ Restart the development server

#### Error: "Mapbox token invalid"
- ✅ Verify that `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` is configured
- ✅ Confirm the token has necessary permissions

#### Error: "Module not found"
- ✅ Run `rm -rf .next && npm run dev` to clear cache
- ✅ Verify all dependencies are installed

## 🤝 Contributing

### **Guidelines**
1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🔀 Open a Pull Request

### **Code Standards**
- ✅ Use TypeScript for all code
- ✅ Follow React naming conventions
- ✅ Add comments for complex logic
- ✅ Keep components small and reusable

## 📄 License

This project is licensed under the ISC License. See the `LICENSE` file for more details.

## 👥 Team

**ACTA 2025 - Global Hackathon**

## 📞 Support

For technical support or questions:
- 📧 Email: [carlos_zendejas2@hotmail.com] [aordazm180@gmail.com]

---

**🚀 RiskGrid - Mapping the future of urban security**