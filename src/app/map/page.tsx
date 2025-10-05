'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { getCrimePointsAsGeoJSON, addCrimePoint, auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
// Sistema completamente basado en Firebase - sin datos estáticos

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [hasToken, setHasToken] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const [canZoomIn, setCanZoomIn] = useState(true)
  const [canZoomOut, setCanZoomOut] = useState(true)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [crimeDataFromFirebase, setCrimeDataFromFirebase] = useState<any>(null)
  const [firebaseLoading, setFirebaseLoading] = useState(false)
  const [dynamicCities, setDynamicCities] = useState<any[]>([])
  const [showAddCrimeModal, setShowAddCrimeModal] = useState(false)
  const [newCrimePoint, setNewCrimePoint] = useState({
    city: '',
    incident: '',
    details: '',
    risk: 'Low',
    intensity: 0.1,
    crimes: 1,
    date: new Date().toISOString().split('T')[0]
  })
  const [isAddingCrime, setIsAddingCrime] = useState(false)
  const [containerReady, setContainerReady] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  // Available incident types
  const incidentTypes = [
    { id: 'robbery', name: 'Theft', icon: '💰', color: 'bg-yellow-500' },
    { id: 'assault', name: 'Assault', icon: '👊', color: 'bg-orange-500' },
    { id: 'accident', name: 'Traffic accident', icon: '🚗', color: 'bg-red-500' },
    { id: 'medical', name: 'Medical emergency', icon: '🏥', color: 'bg-purple-500' },
    { id: 'fire', name: 'Fire', icon: '🔥', color: 'bg-orange-600' },
    { id: 'missing', name: 'Disappearance', icon: '👤', color: 'bg-purple-600' },
    { id: 'sexual', name: 'Sexual offense', icon: '🚫', color: 'bg-red-600' },
    { id: 'vandalism', name: 'Vandalism', icon: '🎨', color: 'bg-pink-500' },
    { id: 'shooting', name: 'Shooting', icon: '🔫', color: 'bg-green-600' }
  ]

  // Lista de ciudades alemanas para el buscador
  const germanCities = [
    { name: "Berlin", coordinates: [13.4050, 52.5200], state: "Berlin" },
    { name: "Hamburg", coordinates: [9.9937, 53.5511], state: "Hamburg" },
    { name: "Munich", coordinates: [11.5761, 48.1374], state: "Bavaria" },
    { name: "Cologne", coordinates: [6.9603, 50.9375], state: "North Rhine-Westphalia" },
    { name: "Frankfurt", coordinates: [8.6821, 50.1109], state: "Hesse" },
    { name: "Stuttgart", coordinates: [9.1815, 48.7758], state: "Baden-Württemberg" },
    { name: "Düsseldorf", coordinates: [6.7735, 51.2277], state: "North Rhine-Westphalia" },
    { name: "Dortmund", coordinates: [7.4660, 51.5136], state: "North Rhine-Westphalia" },
    { name: "Essen", coordinates: [7.0115, 51.4556], state: "North Rhine-Westphalia" },
    { name: "Leipzig", coordinates: [12.3731, 51.3397], state: "Saxony" },
    { name: "Bremen", coordinates: [8.8017, 53.0793], state: "Bremen" },
    { name: "Dresden", coordinates: [13.7373, 51.0504], state: "Saxony" },
    { name: "Hannover", coordinates: [9.7320, 52.3759], state: "Lower Saxony" },
    { name: "Nuremberg", coordinates: [11.0774, 49.4521], state: "Bavaria" },
    { name: "Duisburg", coordinates: [6.7669, 51.4344], state: "North Rhine-Westphalia" },
    { name: "Bochum", coordinates: [7.2162, 51.4818], state: "North Rhine-Westphalia" },
    { name: "Wuppertal", coordinates: [7.1772, 51.2562], state: "North Rhine-Westphalia" },
    { name: "Bielefeld", coordinates: [8.5311, 52.0302], state: "North Rhine-Westphalia" },
    { name: "Bonn", coordinates: [7.0982, 50.7374], state: "North Rhine-Westphalia" },
    { name: "Münster", coordinates: [7.6257, 51.9607], state: "North Rhine-Westphalia" },
    { name: "Karlsruhe", coordinates: [8.4037, 49.0069], state: "Baden-Württemberg" },
    { name: "Mannheim", coordinates: [8.4660, 49.4875], state: "Baden-Württemberg" },
    { name: "Augsburg", coordinates: [10.8978, 48.3705], state: "Bavaria" },
    { name: "Wiesbaden", coordinates: [8.2397, 50.0826], state: "Hesse" },
    { name: "Gelsenkirchen", coordinates: [7.0857, 51.5177], state: "North Rhine-Westphalia" },
    { name: "Mönchengladbach", coordinates: [6.4428, 51.1805], state: "North Rhine-Westphalia" },
    { name: "Braunschweig", coordinates: [10.5268, 52.2689], state: "Lower Saxony" },
    { name: "Chemnitz", coordinates: [12.9256, 50.8278], state: "Saxony" },
    { name: "Kiel", coordinates: [10.1228, 54.3233], state: "Schleswig-Holstein" },
    { name: "Aachen", coordinates: [6.0839, 50.7753], state: "North Rhine-Westphalia" },
    { name: "Halle", coordinates: [11.9689, 51.4964], state: "Saxony-Anhalt" },
    { name: "Magdeburg", coordinates: [11.6298, 52.1205], state: "Saxony-Anhalt" },
    { name: "Freiburg", coordinates: [7.8421, 47.9990], state: "Baden-Württemberg" },
    { name: "Krefeld", coordinates: [6.5873, 51.3388], state: "North Rhine-Westphalia" },
    { name: "Lübeck", coordinates: [10.6867, 53.8655], state: "Schleswig-Holstein" },
    { name: "Oberhausen", coordinates: [6.8514, 51.4969], state: "North Rhine-Westphalia" },
    { name: "Erfurt", coordinates: [11.0297, 50.9848], state: "Thuringia" },
    { name: "Mainz", coordinates: [8.2473, 49.9929], state: "Rhineland-Palatinate" },
    { name: "Rostock", coordinates: [12.0991, 54.0887], state: "Mecklenburg-Vorpommern" },
    { name: "Kassel", coordinates: [9.5018, 51.3127], state: "Hesse" },
    { name: "Hagen", coordinates: [7.4717, 51.3595], state: "North Rhine-Westphalia" },
    { name: "Hamm", coordinates: [7.8087, 51.6806], state: "North Rhine-Westphalia" },
    { name: "Saarbrücken", coordinates: [6.9969, 49.2401], state: "Saarland" },
    { name: "Mülheim", coordinates: [6.8833, 51.4312], state: "North Rhine-Westphalia" },
    { name: "Potsdam", coordinates: [13.0657, 52.3906], state: "Brandenburg" },
    { name: "Ludwigshafen", coordinates: [8.4352, 49.4812], state: "Rhineland-Palatinate" },
    { name: "Oldenburg", coordinates: [8.2026, 53.1434], state: "Lower Saxony" },
    { name: "Leverkusen", coordinates: [7.0042, 51.0464], state: "North Rhine-Westphalia" },
    { name: "Osnabrück", coordinates: [8.0472, 52.2799], state: "Lower Saxony" },
    { name: "Solingen", coordinates: [7.0845, 51.1717], state: "North Rhine-Westphalia" },
    { name: "Heidelberg", coordinates: [8.6721, 49.3988], state: "Baden-Württemberg" },
    { name: "Herne", coordinates: [7.2258, 51.5388], state: "North Rhine-Westphalia" },
    { name: "Neuss", coordinates: [6.6876, 51.2042], state: "North Rhine-Westphalia" },
    { name: "Darmstadt", coordinates: [8.6514, 49.8728], state: "Hesse" },
    { name: "Paderborn", coordinates: [8.7545, 51.7189], state: "North Rhine-Westphalia" },
    { name: "Regensburg", coordinates: [12.1016, 49.0134], state: "Bavaria" },
    { name: "Ingolstadt", coordinates: [11.4256, 48.7665], state: "Bavaria" },
    { name: "Würzburg", coordinates: [9.9296, 49.7913], state: "Bavaria" },
    { name: "Fürth", coordinates: [10.9887, 49.4777], state: "Bavaria" },
    { name: "Wolfsburg", coordinates: [10.7873, 52.4227], state: "Lower Saxony" },
    { name: "Offenbach", coordinates: [8.7669, 50.0956], state: "Hesse" },
    { name: "Ulm", coordinates: [9.9930, 48.4011], state: "Baden-Württemberg" },
    { name: "Heilbronn", coordinates: [9.2169, 49.1427], state: "Baden-Württemberg" },
    { name: "Pforzheim", coordinates: [8.7071, 48.8944], state: "Baden-Württemberg" },
    { name: "Göttingen", coordinates: [9.9187, 51.5413], state: "Lower Saxony" },
    { name: "Bottrop", coordinates: [6.9281, 51.5232], state: "North Rhine-Westphalia" },
    { name: "Trier", coordinates: [6.6371, 49.7596], state: "Rhineland-Palatinate" },
    { name: "Recklinghausen", coordinates: [7.1971, 51.6138], state: "North Rhine-Westphalia" },
    { name: "Reutlingen", coordinates: [9.2044, 48.4919], state: "Baden-Württemberg" },
    { name: "Bremerhaven", coordinates: [8.5817, 53.5396], state: "Bremen" },
    { name: "Koblenz", coordinates: [7.5886, 50.3569], state: "Rhineland-Palatinate" },
    { name: "Bergisch Gladbach", coordinates: [7.1329, 50.9856], state: "North Rhine-Westphalia" },
    { name: "Jena", coordinates: [11.5820, 50.9279], state: "Thuringia" },
    { name: "Remscheid", coordinates: [7.1928, 51.1788], state: "North Rhine-Westphalia" },
    { name: "Erlangen", coordinates: [11.0048, 49.5894], state: "Bavaria" },
    { name: "Moers", coordinates: [6.6326, 51.4514], state: "North Rhine-Westphalia" },
    { name: "Siegen", coordinates: [8.0244, 50.8748], state: "North Rhine-Westphalia" },
    { name: "Hildesheim", coordinates: [9.9567, 52.1508], state: "Lower Saxony" },
    { name: "Salzgitter", coordinates: [10.3267, 52.1508], state: "Lower Saxony" }
  ]

  // Datos estáticos eliminados - ahora usamos solo Firebase

  // Función para obtener país desde coordenadas (geocodificación inversa)
  const getCountryFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed')
      }
      
      const data = await response.json()
      return data.countryName || 'Unknown Country'
    } catch (error) {
      console.error('Error getting country from coordinates:', error)
      return 'Unknown Country'
    }
  }

  // Función para extraer ciudades únicas de los datos de Firebase
  const extractUniqueCities = async (firebaseData: any) => {
    if (!firebaseData || !firebaseData.features || firebaseData.features.length === 0) {
      return []
    }

    const cityMap = new Map()
    
    // Procesar cada feature
    for (const feature of firebaseData.features) {
      const city = feature.properties?.city
      let country = feature.properties?.country
      const coordinates = feature.geometry?.coordinates
      
      if (city && coordinates && coordinates.length >= 2) {
        // Si no hay país, intentar obtenerlo desde las coordenadas
        if (!country || country === 'Unknown Country') {
          try {
            country = await getCountryFromCoordinates(coordinates[1], coordinates[0])
          } catch (error) {
            console.error('Error getting country for coordinates:', coordinates, error)
            country = 'Unknown Country'
          }
        }
        
        // Crear una clave única que incluya ciudad y país para evitar duplicados
        const cityKey = `${city.toLowerCase().trim()}_${country.toLowerCase().trim()}`
        
        if (!cityMap.has(cityKey)) {
          cityMap.set(cityKey, {
            name: city,
            country: country,
            coordinates: coordinates,
            crimeCount: 1,
            riskLevel: feature.properties?.risk || 'Medium'
          })
        } else {
          // Si la ciudad ya existe, incrementar el conteo de crímenes
          const existingCity = cityMap.get(cityKey)
          existingCity.crimeCount += 1
          
          // Actualizar el nivel de riesgo al más alto
          const riskLevels = ['Low', 'Medium', 'High', 'Very High']
          const currentRiskIndex = riskLevels.indexOf(existingCity.riskLevel)
          const newRiskIndex = riskLevels.indexOf(feature.properties?.risk || 'Medium')
          
          if (newRiskIndex > currentRiskIndex) {
            existingCity.riskLevel = feature.properties?.risk || 'Medium'
          }
        }
      }
    }

    // Convertir Map a Array y ordenar por número de crímenes (descendente)
    const uniqueCities = Array.from(cityMap.values()).sort((a, b) => b.crimeCount - a.crimeCount)
    
    console.log('🏙️ Ciudades únicas extraídas:', uniqueCities.length)
    return uniqueCities
  }

  // Función para cargar datos de Firebase - MEJORADA
  const loadCrimeDataFromFirebase = async () => {
    console.log('🔄 Iniciando carga de datos de Firebase...')
    setFirebaseLoading(true)
    
    try {
      const firebaseData = await getCrimePointsAsGeoJSON()
      console.log('📊 Datos recibidos de Firebase:', firebaseData)
      
      if (firebaseData && firebaseData.features && firebaseData.features.length > 0) {
        console.log('✅ Datos cargados desde Firebase:', firebaseData.features.length, 'puntos')
        setCrimeDataFromFirebase(firebaseData)
        
        // Extraer ciudades únicas para la búsqueda dinámica
        const cities = await extractUniqueCities(firebaseData)
        setDynamicCities(cities)
        
        // Forzar actualización del mapa si está listo
        if (map.current && map.current.isStyleLoaded()) {
          console.log('🔄 Forzando actualización del mapa...')
          setTimeout(() => {
            addHeatmapLayers()
          }, 300)
        }
      } else {
        console.log('⚠️ No hay datos en Firebase disponibles')
        setCrimeDataFromFirebase(null)
        setDynamicCities([])
      }
    } catch (error) {
      console.error('❌ Error cargando datos de Firebase:', error)
      setCrimeDataFromFirebase(null)
      setDynamicCities([])
      
      // Reintentar después de un delay
      setTimeout(async () => {
        console.log('🔄 Reintentando carga de datos de Firebase...')
        try {
          const retryData = await getCrimePointsAsGeoJSON()
          if (retryData && retryData.features && retryData.features.length > 0) {
            console.log('✅ Datos cargados en reintento:', retryData.features.length, 'puntos')
            setCrimeDataFromFirebase(retryData)
            
            // Extraer ciudades únicas para la búsqueda dinámica
            const cities = await extractUniqueCities(retryData)
            setDynamicCities(cities)
          }
        } catch (retryError) {
          console.error('❌ Error en reintento:', retryError)
        }
      }, 2000)
    } finally {
      setFirebaseLoading(false)
    }
  }

  // Función para obtener los datos a usar (solo Firebase)
  const getCrimeDataToUse = () => {
    return crimeDataFromFirebase || {
      type: "FeatureCollection",
      features: []
    }
  }

  // Function to open the add crime modal
  const openAddCrimeModal = async () => {
    setShowAddCrimeModal(true)
    
    // Get user's current location automatically
    try {
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords
      
      // Reverse geocode to get city name and country
      const locationData = await reverseGeocode(latitude, longitude)
      
      // Auto-assign risk based on incident type (we'll set this when user selects incident)
      const autoRisk = 'Medium' // Default risk level
      
      // Reset form with automatic values
    setNewCrimePoint({
        city: locationData.city || 'Unknown Location',
      incident: '',
      details: '',
        risk: autoRisk,
        intensity: 0.1, // Default intensity
        crimes: 1, // Default crimes count
        date: new Date().toISOString().split('T')[0] // Today's date
      })
    } catch (error) {
      console.error('Error getting location:', error)
      // If location fails, still open modal but with default values
      setNewCrimePoint({
        city: 'Location not available',
        incident: '',
        details: '',
        risk: 'Medium',
        intensity: 0.1,
      crimes: 1,
      date: new Date().toISOString().split('T')[0]
    })
    }
  }

  // Function to close the modal
  const closeAddCrimeModal = () => {
    setShowAddCrimeModal(false)
    setIsAddingCrime(false)
    setShowSuccessMessage(false)
    // Reset form
    setNewCrimePoint({
      city: '',
      incident: '',
      details: '',
      risk: 'Low',
      intensity: 0.1,
      crimes: 1,
      date: new Date().toISOString().split('T')[0]
    })
  }

  // Function to select incident type
  const selectIncidentType = (type: string) => {
    const autoRisk = getAutoRisk(type)
    setNewCrimePoint({
      ...newCrimePoint, 
      incident: type,
      risk: autoRisk
    })
  }

  // Function to get current position with promise
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'))
        return
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }

  // Function to reverse geocode coordinates to city name and country
  const reverseGeocode = async (latitude: number, longitude: number): Promise<{city: string, country: string}> => {
    try {
      // Using a simple reverse geocoding service (you can replace with your preferred service)
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed')
      }
      
      const data = await response.json()
      
      // Return city name and country
      return {
        city: data.city || data.locality || data.principalSubdivision || data.countryName || 'Unknown Location',
        country: data.countryName || 'Unknown Country'
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return {
        city: 'Unknown Location',
        country: 'Unknown Country'
      }
    }
  }

  // Function to auto-assign risk based on incident type
  const getAutoRisk = (incidentType: string): string => {
    const highRiskTypes = ['shooting', 'assault', 'sexual', 'fire']
    const mediumRiskTypes = ['robbery', 'accident', 'vandalism']
    
    if (highRiskTypes.includes(incidentType.toLowerCase())) {
      return 'High'
    } else if (mediumRiskTypes.includes(incidentType.toLowerCase())) {
      return 'Medium'
    } else {
      return 'Low'
    }
  }

  // Function to add new crime point
  const handleAddCrimePoint = async () => {
    if (!newCrimePoint.incident || !newCrimePoint.details) {
      alert('Please select an incident type and provide details')
      return
    }

    setIsAddingCrime(true)

    try {
      // Get user's current location for coordinates
      const position = await getCurrentPosition()
      const { latitude, longitude } = position.coords
      
      // Obtener información de ubicación completa desde las coordenadas
      const locationData = await reverseGeocode(latitude, longitude)
      
      const crimePointData = {
        city: locationData.city,
        incident: newCrimePoint.incident,
        details: newCrimePoint.details,
        risk: newCrimePoint.risk,
        intensity: newCrimePoint.intensity,
        crimes: newCrimePoint.crimes,
        date: newCrimePoint.date,
        country: locationData.country,
        longitude: longitude,
        latitude: latitude,
        coordinates: [longitude, latitude]
      }

      await addCrimePoint(crimePointData)
      
      // Reload Firebase data
      await loadCrimeDataFromFirebase()
      
      // Forzar actualización inmediata del mapa
      setTimeout(() => {
        if (map.current && map.current.isStyleLoaded()) {
          console.log('🔄 Actualizando mapa después de añadir nuevo punto...')
          addHeatmapLayers()
        }
      }, 500)
      
      // Show success message in modal
      setShowSuccessMessage(true)
      
      // Close modal after 2 seconds
      setTimeout(() => {
      closeAddCrimeModal()
      }, 2000)
      
    } catch (error) {
      console.error('Error adding crime point:', error)
      alert('❌ Error adding crime point. Please try again.')
    } finally {
      setIsAddingCrime(false)
    }
  }

  // Verificar autenticación - optimizado para carga más rápida
  useEffect(() => {
    console.log('🔐 Iniciando verificación de autenticación...')
    
    // Verificar si ya hay un usuario autenticado inmediatamente
    const currentUser = auth.currentUser
    if (currentUser) {
      console.log('✅ Usuario ya autenticado:', currentUser.email)
      setUser(currentUser)
      setLoading(false)
      return
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('🔐 Estado de autenticación cambiado:', user ? 'Usuario autenticado' : 'Usuario no autenticado')
      if (user) {
        console.log('✅ Usuario autenticado:', user.email)
        setUser(user)
        setLoading(false)
      } else {
        console.log('❌ Usuario no autenticado, redirigiendo...')
        setUser(null)
        setLoading(false)
        // Redirigir a la página de autenticación si no hay usuario
        router.push('/auth')
      }
    })

    return () => unsubscribe()
  }, [router])

  useEffect(() => {
    // Cargar datos de Firebase al montar el componente solo si hay usuario
    if (user) {
      const loadData = async () => {
        await loadCrimeDataFromFirebase()
        // Reintentar una vez más después de 1 segundo si no hay datos (más rápido)
        setTimeout(async () => {
          if (!crimeDataFromFirebase) {
            console.log('🔄 Reintentando carga de datos de Firebase...')
            await loadCrimeDataFromFirebase()
          }
        }, 1000)
      }
      loadData()
    }
  }, [user])


  // Recargar capas del mapa cuando cambien los datos - MEJORADO
  useEffect(() => {
    console.log('🔄 Efecto de recarga de capas ejecutado:', {
      mapLoaded,
      mapExists: !!map.current,
      firebaseLoading,
      hasData: crimeDataFromFirebase && crimeDataFromFirebase.features.length > 0,
      dataLength: crimeDataFromFirebase?.features?.length || 0
    })

    if (mapLoaded && map.current && !firebaseLoading) {
      // Verificar que el mapa esté completamente listo
      if (!map.current.isStyleLoaded()) {
        console.log('⏳ Mapa no está completamente listo, esperando...')
        const checkStyleLoaded = () => {
          if (map.current && map.current.isStyleLoaded()) {
            console.log('✅ Mapa listo, añadiendo capas...')
            addHeatmapLayers()
          } else {
            setTimeout(checkStyleLoaded, 100)
          }
        }
        checkStyleLoaded()
        return
      }

      console.log('🎨 Añadiendo capas del mapa con datos de Firebase...')
      // Usar setTimeout para asegurar que el mapa esté completamente listo
      setTimeout(() => {
        addHeatmapLayers()
      }, 200)
    }
  }, [crimeDataFromFirebase, firebaseLoading, mapLoaded])

  // Efecto para verificar periódicamente que las capas estén presentes
  useEffect(() => {
    if (!mapLoaded || !map.current) return

    const checkLayersInterval = setInterval(() => {
      if (map.current && map.current.isStyleLoaded()) {
        const hasHeatmap = map.current.getLayer('crime-heatmap')
        const hasPoints = map.current.getLayer('crime-points')
        const hasData = crimeDataFromFirebase && crimeDataFromFirebase.features.length > 0
        
        if (hasData && (!hasHeatmap || !hasPoints)) {
          console.log('🔄 Capas perdidas detectadas, recargando...')
          addHeatmapLayers()
        }
      }
    }, 5000) // Verificar cada 5 segundos

    return () => clearInterval(checkLayersInterval)
  }, [mapLoaded, crimeDataFromFirebase])

  // Efecto para detectar cuando el contenedor está listo
  useEffect(() => {
    console.log('🔍 Verificando contenedor del mapa...')
    console.log('mapContainer.current:', mapContainer.current)
    console.log('user:', user)
    console.log('loading:', loading)
    
    if (mapContainer.current) {
      console.log('✅ Contenedor del mapa detectado en el DOM')
      setContainerReady(true)
    } else {
      console.log('⏳ Contenedor del mapa no está listo aún')
    }
  }, [user, loading])

  useEffect(() => {
    if (map.current || !containerReady) return // Initialize map only once and when container is ready
    
    // Usar directamente el token de Mapbox que sabemos que funciona
    const token = "pk.eyJ1Ijoid29sbGVtYW5sZWNoNyIsImEiOiJjbWdjZ2JlaHgwM2x4MmxvaXo3NTc1dmJzIn0.SH5AqFeBIbNX7wCLQUM2fQ"
    console.log('🗺️ === INICIANDO MAPA ===')
    console.log('Mapbox token:', token ? 'Token exists' : 'Token missing')
    console.log('Token length:', token ? token.length : 0)
    
    if (!token) {
      console.error('❌ Mapbox token is missing')
      setHasToken(false)
      return
    }
    
    mapboxgl.accessToken = token
    console.log('✅ Token configurado en mapboxgl')

    // Función para inicializar el mapa
    const initializeMap = () => {
      if (mapContainer.current) {
        console.log('✅ Contenedor del mapa encontrado:', mapContainer.current)
        console.log('Container dimensions:', {
          width: mapContainer.current.offsetWidth,
          height: mapContainer.current.offsetHeight
        })
        
        try {
          console.log('🗺️ Creando instancia del mapa...')
          
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [10.4515, 51.1657],
            zoom: 5.5,
            attributionControl: false
          })

          console.log('✅ Instancia del mapa creada')

          map.current.on('load', () => {
            console.log('✅ Mapa cargado exitosamente')
            setMapLoaded(true)
            
            // Añadir el mapa de calor después de que el mapa esté completamente cargado
            setTimeout(() => {
              console.log('🎨 Añadiendo capas del mapa...')
              addHeatmapLayers()
            }, 1000)
          })

          map.current.on('error', (e) => {
            console.error('❌ Error del mapa:', e)
            console.error('Error type:', e.type)
            console.error('Error details:', e.error)
          })

          map.current.on('style.load', () => {
            console.log('🎨 Estilo del mapa cargado')
          })

          map.current.on('style.error', (e) => {
            console.error('❌ Error de estilo:', e)
          })

          // Actualizar estado de zoom
          const updateZoomButtons = () => {
            if (map.current) {
              const zoom = map.current.getZoom()
              setCanZoomIn(zoom < 22)
              setCanZoomOut(zoom > 0)
            }
          }

          map.current.on('zoom', updateZoomButtons)
          updateZoomButtons()
          
          // Añadir evento para recargar capas cuando sea necesario
          map.current.on('zoomend', () => {
            // Verificar si las capas siguen visibles después del zoom
            setTimeout(() => {
              if (map.current && map.current.isStyleLoaded()) {
                const hasHeatmap = map.current.getLayer('crime-heatmap')
                const hasPoints = map.current.getLayer('crime-points')
                
                if (!hasHeatmap || !hasPoints) {
                  console.log('🔄 Capas perdidas después del zoom, recargando...')
                  addHeatmapLayers()
                }
              }
            }, 100)
          })
          
          console.log('✅ Eventos del mapa configurados')
        } catch (error) {
          console.error('❌ Error inicializando mapa:', error)
          if (error instanceof Error) {
            console.error('Error stack:', error.stack)
          }
        }
      } else {
        console.error('❌ Contenedor del mapa no encontrado')
      }
    }

    // Esperar a que el DOM esté listo
    if (mapContainer.current) {
      initializeMap()
    } else {
      // Si el contenedor no está listo, esperar un poco más
      console.log('⏳ Esperando a que el contenedor esté listo...')
      setTimeout(() => {
        initializeMap()
      }, 100)
    }

    return () => {
      if (map.current) {
        console.log('🗑️ Limpiando mapa...')
        map.current.remove()
        map.current = null
      }
    }
  }, [containerReady])

  // Función para añadir las capas del mapa de calor - MEJORADA
  const addHeatmapLayers = () => {
    console.log('🎨 Iniciando addHeatmapLayers...')
    
    if (!map.current) {
      console.log('❌ Mapa no existe')
      return
    }

    if (!map.current.isStyleLoaded()) {
      console.log('❌ Estilo del mapa no está cargado')
      return
    }

    try {
      console.log('🧹 Limpiando capas existentes...')
      
      // Limpiar fuentes y capas existentes de forma segura
      if (map.current.getLayer('crime-heatmap')) {
        console.log('🗑️ Eliminando capa crime-heatmap')
        map.current.removeLayer('crime-heatmap')
      }
      if (map.current.getLayer('crime-points')) {
        console.log('🗑️ Eliminando capa crime-points')
        map.current.removeLayer('crime-points')
      }
      if (map.current.getSource('crime-data')) {
        console.log('🗑️ Eliminando fuente crime-data')
        map.current.removeSource('crime-data')
      }

      // Obtener datos y verificar que hay datos disponibles
      const dataToUse = getCrimeDataToUse()
      console.log('📊 Datos a usar:', {
        hasData: !!dataToUse,
        featuresCount: dataToUse?.features?.length || 0,
        dataType: typeof dataToUse
      })
      
      if (!dataToUse || !dataToUse.features || dataToUse.features.length === 0) {
        console.log('⚠️ No hay datos de crimen disponibles para mostrar')
        return
      }

      console.log('➕ Añadiendo fuente de datos...')
      // Añadir fuente de datos para el mapa de calor
      map.current.addSource('crime-data', {
        type: 'geojson',
        data: dataToUse as any
      })
      console.log(`✅ Fuente de datos añadida exitosamente con ${dataToUse.features.length} características`)

      // Añadir capa de mapa de calor - prominente desde lejos
      map.current.addLayer({
        id: 'crime-heatmap',
        type: 'heatmap',
        source: 'crime-data',
        maxzoom: 12,
        paint: {
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'intensity'],
            0, 0,
            1, 1
          ],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(255, 255, 255, 0)',
            0.05, 'rgba(255, 240, 240, 0.8)',
            0.1, 'rgba(255, 200, 200, 0.9)',
            0.2, 'rgba(255, 150, 150, 1)',
            0.3, 'rgba(255, 100, 100, 1)',
            0.4, 'rgba(255, 60, 60, 1)',
            0.5, 'rgba(220, 40, 40, 1)',
            0.6, 'rgba(180, 20, 20, 1)',
            0.7, 'rgba(140, 10, 10, 1)',
            0.8, 'rgba(100, 5, 5, 1)',
            0.9, 'rgba(80, 0, 0, 1)',
            1, 'rgba(60, 0, 0, 1)'
          ],
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 30,
            3, 40,
            6, 50,
            9, 60,
            12, 80
          ],
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 0.9,
            3, 1,
            6, 0.9,
            9, 0.7,
            12, 0.5
          ]
        }
      })

      // Añadir capa de círculos para mostrar puntos individuales al acercarse
      map.current.addLayer({
        id: 'crime-points',
        type: 'circle',
        source: 'crime-data',
        minzoom: 10,
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 6,
            12, 8,
            14, 12,
            16, 16,
            18, 20
          ],
          'circle-color': [
            'case',
            ['==', ['get', 'risk'], 'Very High'], '#8B0000',
            ['==', ['get', 'risk'], 'High'], '#DC143C',
            ['==', ['get', 'risk'], 'Medium'], '#FF6347',
            '#FFB6C1'
          ],
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2,
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0,
            11, 0.3,
            12, 0.6,
            13, 0.8,
            14, 1
          ]
        }
      })

      console.log('✅ Capas del mapa de calor añadidas exitosamente')

      // Añadir eventos de click a los puntos de crimen
      map.current.on('click', 'crime-points', (e) => {
        const features = e.features
        if (features && features.length > 0 && features[0].properties) {
          const feature = features[0]
          const properties = feature.properties!
          
          // Crear popup con información detallada
          new mapboxgl.Popup({ 
            offset: 25,
            className: 'crime-popup'
          })
            .setLngLat(e.lngLat)
            .setHTML(`
              <div class="crime-popup-content">
                <div class="crime-header">
                  <h3>${properties.city || 'Unknown'}</h3>
                  <span class="risk-badge ${properties.risk?.toLowerCase().replace(' ', '-') || 'unknown'}">${properties.risk || 'Unknown'} Risk</span>
                </div>
                <div class="crime-location">
                  <strong>📍 ${properties.city || 'Unknown'}, ${properties.country || 'Unknown Country'}</strong>
                </div>
                <div class="crime-details">
                  <div class="incident-info">
                    <strong>Incident:</strong> ${properties.incident || 'Unknown'}
                  </div>
                  <div class="incident-date">
                    <strong>Date:</strong> ${properties.date || 'Unknown'}
                  </div>
                  <div class="incident-details">
                    <strong>Details:</strong> ${properties.details || 'No details available'}
                  </div>
                  <div class="crime-stats">
                    <strong>Total Crimes:</strong> ${properties.crimes || '0'}
                  </div>
                </div>
              </div>
            `)
            .addTo(map.current!)
        }
      })

      // Cambiar cursor al hover sobre los puntos
      map.current.on('mouseenter', 'crime-points', () => {
        map.current!.getCanvas().style.cursor = 'pointer'
      })

      map.current.on('mouseleave', 'crime-points', () => {
        map.current!.getCanvas().style.cursor = ''
      })

    } catch (error) {
      console.error('❌ Error añadiendo capas del mapa de calor:', error)
      console.error('Detalles del error:', error)
      
      // Intentar reintentar después de un breve delay
      setTimeout(() => {
        console.log('🔄 Reintentando añadir capas...')
        if (map.current && map.current.isStyleLoaded()) {
          addHeatmapLayers()
        }
      }, 1000)
    }
  }

  // Funciones para manejar los controles
  const handleZoomIn = () => {
    if (map.current && canZoomIn) {
      map.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (map.current && canZoomOut) {
      map.current.zoomOut()
    }
  }


  // Funciones para el buscador - MEJORADA con ciudades dinámicas globales
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 0) {
      // Usar ciudades dinámicas de Firebase si están disponibles, sino usar la lista estática como fallback
      const citiesToSearch = dynamicCities.length > 0 ? dynamicCities : germanCities
      
      const results = citiesToSearch.filter(city => {
        const cityName = city.name?.toLowerCase() || ''
        const cityCountry = city.country?.toLowerCase() || city.state?.toLowerCase() || ''
        const searchQuery = query.toLowerCase()
        
        // Buscar en nombre de ciudad, país, o combinación ciudad, país
        const fullLocation = `${cityName} ${cityCountry}`.toLowerCase()
        
        return cityName.includes(searchQuery) || 
               cityCountry.includes(searchQuery) || 
               fullLocation.includes(searchQuery)
      }).slice(0, 8) // Mostrar máximo 8 resultados
      
      setSearchResults(results)
      setShowSearchResults(results.length > 0)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  const handleCitySelect = (city: any) => {
    if (map.current && mapLoaded) {
          map.current!.flyTo({
            center: city.coordinates,
            zoom: 12,
        duration: 2000
      })
    } else {
      // Si el mapa no está listo, esperar un poco y reintentar
      setTimeout(() => {
        if (map.current) {
          map.current!.flyTo({
            center: city.coordinates,
            zoom: 12,
            duration: 2000
          })
        }
      }, 1000)
    }
    setSearchQuery(city.name)
    setShowSearchResults(false)
    setSearchResults([])
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/auth')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleGetLocation = () => {
    if (!map.current) return

    setIsLocating(true)
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported by this browser')
      setIsLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        
        // Centrar el mapa en la ubicación del usuario
        map.current!.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          duration: 2000
        })

        // Añadir un marcador en la ubicación actual
        const userLocationMarker = new mapboxgl.Marker({
          color: '#FFFFFF',
          scale: 1.2
        })
          .setLngLat([longitude, latitude])
          .setPopup(new mapboxgl.Popup({ 
            offset: 25,
            closeButton: true,
            closeOnClick: false,
            className: 'custom-location-popup'
          })
            .setHTML(`
              <div class="popup-header">
                <span class="location-icon">📍</span>
                <span class="location-title">Your Location</span>
              </div>
              <div class="popup-content">
                <div class="coord-row">
                  <span class="coord-label">Latitude:</span>
                  <span class="coord-value">${latitude.toFixed(6)}</span>
                </div>
                <div class="coord-row">
                  <span class="coord-label">Longitude:</span>
                  <span class="coord-value">${longitude.toFixed(6)}</span>
                </div>
              </div>
            `)
          )
          .addTo(map.current!)

        setIsLocating(false)
      },
      (error) => {
        let errorMessage = 'Error getting location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location not available'
            break
          case error.TIMEOUT:
            errorMessage = 'Request timeout'
            break
        }
        
        setLocationError(errorMessage)
        setIsLocating(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  // Mostrar loading solo brevemente mientras se verifica la autenticación
  if (loading) {
    console.log('⏳ Verificando autenticación...')
    return (
      <div className="relative w-screen h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    )
  }

  // Si no hay usuario, no mostrar nada (se redirigirá automáticamente)
  if (!user) {
    console.log('❌ No hay usuario, no renderizando mapa')
    return null
  }

  console.log('🎨 Renderizando componente del mapa')

  return (
    <div className="relative w-screen h-screen bg-gray-900">
      <div 
        ref={mapContainer} 
        className="absolute inset-0" 
        style={{ 
          width: '100%', 
          height: '100%',
          minWidth: '100vw',
          minHeight: '100vh'
        }} 
      />
      
      
      {!hasToken && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <p className="text-white text-xl mb-4">⚠️ Mapbox Token Required</p>
            <p className="text-white/70 text-sm max-w-md">
              To display the map, you need to configure your Mapbox token.<br/>
              Create a <code className="bg-white/10 px-2 py-1 rounded">.env.local</code> file in the project root and add:<br/>
              <code className="bg-white/10 px-2 py-1 rounded block mt-2">
                NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
              </code>
              <br/><br/>
              Get your free token at: <a href="https://account.mapbox.com/access-tokens/" target="_blank" className="text-blue-400 hover:text-blue-300">mapbox.com</a>
            </p>
          </div>
        </div>
      )}
      
      {/* Map controls */}
      {mapLoaded && (
        <div className="map-controls-container">
          {/* Location button */}
          <button
            onClick={handleGetLocation}
            className={`map-control-bubble ${isLocating ? 'locating' : ''}`}
            title="My Location"
            disabled={isLocating}
          >
            {isLocating ? '⟳' : '📍'}
          </button>

          {/* Add crime button */}
          <button
            onClick={openAddCrimeModal}
            className="map-control-bubble"
            title="Add Crime Point"
          >
            🚨
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="map-control-bubble"
            title="Sign Out"
          >
            🚪
          </button>
          
          {/* Zoom controls */}
          <div className="zoom-controls">
            <button
              onClick={handleZoomIn}
              className={`zoom-control ${!canZoomIn ? 'disabled' : ''}`}
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className={`zoom-control ${!canZoomOut ? 'disabled' : ''}`}
              title="Zoom Out"
            >
              −
            </button>
          </div>
        </div>
      )}

      {/* Location error message */}
      {locationError && (
        <div className="absolute top-20 right-20 bg-red-500/90 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm z-50 max-w-xs">
          {locationError}
        </div>
      )}

      {/* Firebase loading indicator */}
      {firebaseLoading && (
        <div className="absolute top-20 left-20 bg-blue-500/90 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm z-50 max-w-xs">
          🔄 Loading Firebase data...
        </div>
      )}

      {/* Data source indicator */}
      {!firebaseLoading && mapLoaded && (
        <div className="absolute top-20 left-20 bg-green-500/90 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm z-50 max-w-xs">
          {crimeDataFromFirebase && crimeDataFromFirebase.features.length > 0 ? 
            `✅ Firebase (${crimeDataFromFirebase.features.length} points)` : 
            '⚠️ Loading data...'
          }
        </div>
      )}

      {/* Authenticated user indicator */}
      {user && (
        <div className="absolute top-20 right-20 bg-blue-500/90 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm z-50 max-w-xs">
          👤 {user.email}
        </div>
      )}



      {/* City search - Global */}
      <div style={{ 
        position: 'absolute', 
        bottom: '0px', 
        left: '0px', 
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTopRightRadius: '12px',
        padding: '10px',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        width: '240px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        transform: 'translateY(0)',
        transition: 'all 0.3s ease'
      }}>
        {dynamicCities.length > 0 && (
          <div style={{
            fontSize: '10px',
            color: '#6b7280',
            marginBottom: '6px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            🌍 Global Crime Data ({dynamicCities.length} cities)
          </div>
        )}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder={dynamicCities.length > 0 ? "Search cities with incidents..." : "Search city or country..."}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 32px 10px 12px',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '400',
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 1)';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0, 0, 0, 0.1)';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
              e.target.style.boxShadow = 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          />
          <span style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '14px',
            color: '#9ca3af',
            pointerEvents: 'none'
          }}>🔍</span>
        </div>
        
        {searchResults.length > 0 && (
          <div style={{
            marginTop: '8px',
            maxHeight: '180px',
            overflowY: 'auto',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: '6px',
            backgroundColor: 'rgba(249, 250, 251, 0.6)'
          }}>
            {searchResults.map((city, index) => (
              <div
                key={index}
                onClick={() => handleCitySelect(city)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  borderBottom: index < searchResults.length - 1 ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
                  backgroundColor: 'transparent',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div style={{ 
                  fontWeight: '500', 
                  color: '#1f2937', 
                  fontSize: '13px',
                  marginBottom: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>{city.name}</span>
                  {city.crimeCount && (
                    <span style={{
                      fontSize: '10px',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontWeight: '600'
                    }}>
                      {city.crimeCount}
                    </span>
                  )}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#6b7280',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <span>🌍 {city.country || city.state}</span>
                  {city.riskLevel && (
                    <span style={{
                      fontSize: '9px',
                      backgroundColor: city.riskLevel === 'High' || city.riskLevel === 'Very High' ? '#ef4444' : 
                                       city.riskLevel === 'Medium' ? '#f59e0b' : '#10b981',
                      color: 'white',
                      padding: '1px 4px',
                      borderRadius: '4px',
                      fontWeight: '500'
                    }}>
                      {city.riskLevel}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leyenda del mapa de calor */}
      {mapLoaded && (
        <div className="absolute bottom-20 right-20 z-10">
          <div className="heatmap-legend">
            <div className="legend-title">Crime Risk Level</div>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#8B0000' }}></div>
                <span>Very High Risk</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#DC143C' }}></div>
                <span>High Risk</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#FF6347' }}></div>
                <span>Medium Risk</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#FFB6C1' }}></div>
                <span>Low Risk</span>
              </div>
            </div>
          </div>
        </div>
      )}

       {/* Report incident modal */}
      {showAddCrimeModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4" 
          style={{ 
            zIndex: 9999,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backdropFilter: 'blur(8px)'
          }}
          onClick={closeAddCrimeModal}
        >
          <div 
            className="crime-modal"
             style={{ height: '520px', width: '600px' }}
            onClick={(e) => e.stopPropagation()}
          >
             {/* Modal header */}
            <div className="crime-modal-header">
              <div>
                 <h2 className="crime-modal-title">Report Incident</h2>
                 <p className="crime-modal-subtitle">Quick Report - Your location detected automatically</p>
              </div>
              <button
                onClick={closeAddCrimeModal}
                className="crime-modal-close"
                disabled={isAddingCrime}
              >
                ×
              </button>
            </div>

             {/* Modal content - Single Step */}
            <div className="crime-modal-content">
               {showSuccessMessage ? (
                 <div className="h-full flex flex-col items-center justify-center text-center">
                   <div className="mb-6">
                     <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                       <span className="text-white text-2xl">✓</span>
                  </div>
                     <h3 className="crime-section-title mb-2">Report Submitted Successfully!</h3>
                     <p className="crime-section-subtitle">
                       Your incident has been added to the map and is now visible to other users.
                     </p>
                   </div>
                 </div>
               ) : (
                 <div className="h-full flex flex-col">
                   {/* Incident Type Selection */}
                   <div className="mb-6">
                     <h3 className="crime-section-title mb-4">Select Incident Type *</h3>
                     <div className="grid grid-cols-3 gap-3">
                    {incidentTypes.map((incident) => (
                      <button
                        key={incident.id}
                        onClick={() => selectIncidentType(incident.name)}
                        className="crime-incident-button"
                           style={{
                             border: newCrimePoint.incident === incident.name ? '2px solid #3b82f6' : '1px solid rgba(156, 163, 175, 0.3)',
                             backgroundColor: newCrimePoint.incident === incident.name ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.8)'
                           }}
                           disabled={isAddingCrime}
                      >
                           <span className="crime-incident-icon">{incident.icon}</span>
                           <span className="crime-incident-text">{incident.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                   {/* Details Input */}
                   <div className="flex-1">
                      <div className="crime-input-group">
                        <label className="crime-label">
                         Incident Details *
                      </label>
                      <textarea
                        value={newCrimePoint.details}
                        onChange={(e) => setNewCrimePoint({...newCrimePoint, details: e.target.value})}
                        className="crime-input"
                         placeholder="Describe what happened..."
                        rows={4}
                        required
                        disabled={isAddingCrime}
                         style={{ resize: 'vertical', minHeight: '100px' }}
                      />
                    </div>
                  </div>
                </div>
              )}
                  </div>
                  
             {/* Footer with buttons */}
             {!showSuccessMessage && (
            <div className="crime-modal-footer">
              <div className="flex gap-3">
                  <button
                    type="button"
                     onClick={closeAddCrimeModal}
                    className="crime-button"
                    disabled={isAddingCrime}
                  >
                     Cancel
                  </button>
                   
                  <button
                    type="button"
                    onClick={handleAddCrimePoint}
                     disabled={isAddingCrime || !newCrimePoint.incident || !newCrimePoint.details}
                    className="crime-button flex-1"
                  >
                     {isAddingCrime ? 'Submitting...' : 'Submit Report'}
                  </button>
              </div>
            </div>
             )}
          </div>
        </div>
      )}

    </div>
  )
}

