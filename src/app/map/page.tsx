'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
// Sistema simplificado - usando solo datos estáticos

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [hasToken, setHasToken] = useState(true)
  const [canZoomIn, setCanZoomIn] = useState(true)
  const [canZoomOut, setCanZoomOut] = useState(true)
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)

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

  // Datos de delitos distribuidos por toda Alemania
  const crimeData = {
    type: "FeatureCollection" as const,
    features: [
      // Norte de Alemania
      { type: "Feature" as const, properties: { intensity: 0.3, risk: "Low", crimes: 45, city: "Flensburg", incident: "Traffic violation", date: "2024-01-15", details: "Speeding incident on highway A7" }, geometry: { type: "Point" as const, coordinates: [9.4300, 54.7833] }},
      { type: "Feature", properties: { intensity: 0.2, risk: "Low", crimes: 32, city: "Kiel", incident: "Petty theft", date: "2024-01-14", details: "Bicycle stolen from university campus" }, geometry: { type: "Point", coordinates: [10.1228, 54.3233] }},
      { type: "Feature", properties: { intensity: 0.4, risk: "Medium", crimes: 67, city: "Lübeck", incident: "Burglary", date: "2024-01-13", details: "Residential break-in during daytime" }, geometry: { type: "Point", coordinates: [10.6867, 53.8655] }},
      { type: "Feature", properties: { intensity: 0.5, risk: "Medium", crimes: 89, city: "Hamburg", incident: "Drug possession", date: "2024-01-12", details: "Small quantity drugs found during traffic stop" }, geometry: { type: "Point", coordinates: [9.9937, 53.5511] }},
      { type: "Feature", properties: { intensity: 0.3, risk: "Low", crimes: 41, city: "Bremen", incident: "Public disturbance", date: "2024-01-11", details: "Noise complaint in residential area" }, geometry: { type: "Point", coordinates: [8.8017, 53.0793] }},
      
      // Centro-Norte
      { type: "Feature", properties: { intensity: 0.6, risk: "Medium", crimes: 112, city: "Hannover", incident: "Vehicle theft", date: "2024-01-10", details: "Car stolen from parking garage" }, geometry: { type: "Point", coordinates: [9.7320, 52.3759] }},
      { type: "Feature", properties: { intensity: 0.4, risk: "Medium", crimes: 78, city: "Braunschweig", incident: "Shoplifting", date: "2024-01-09", details: "Items stolen from department store" }, geometry: { type: "Point", coordinates: [10.5268, 52.2689] }},
      { type: "Feature", properties: { intensity: 0.7, risk: "High", crimes: 145, city: "Berlin", incident: "Assault", date: "2024-01-08", details: "Physical altercation in nightclub district" }, geometry: { type: "Point", coordinates: [13.4050, 52.5200] }},
      { type: "Feature", properties: { intensity: 0.3, risk: "Low", crimes: 56, city: "Potsdam", incident: "Vandalism", date: "2024-01-07", details: "Graffiti on historical building" }, geometry: { type: "Point", coordinates: [13.0657, 52.3906] }},
      { type: "Feature", properties: { intensity: 0.5, risk: "Medium", crimes: 94, city: "Magdeburg", incident: "Fraud", date: "2024-01-06", details: "Credit card fraud at local business" }, geometry: { type: "Point", coordinates: [11.6298, 52.1205] }},
      
      // Este de Alemania
      { type: "Feature", properties: { intensity: 0.4, risk: "Medium", crimes: 73, city: "Leipzig", incident: "Theft", date: "2024-01-05", details: "Wallet stolen from crowded market" }, geometry: { type: "Point", coordinates: [12.3731, 51.3397] }},
      { type: "Feature", properties: { intensity: 0.2, risk: "Low", crimes: 38, city: "Dresden", incident: "Trespassing", date: "2024-01-04", details: "Unauthorized entry into construction site" }, geometry: { type: "Point", coordinates: [13.7373, 51.0504] }},
      { type: "Feature", properties: { intensity: 0.3, risk: "Low", crimes: 49, city: "Chemnitz", incident: "Property damage", date: "2024-01-03", details: "Broken windows in residential building" }, geometry: { type: "Point", coordinates: [12.9256, 50.8278] }},
      { type: "Feature", properties: { intensity: 0.6, risk: "Medium", crimes: 108, city: "Halle", incident: "Robbery", date: "2024-01-02", details: "Armed robbery at convenience store" }, geometry: { type: "Point", coordinates: [11.9689, 51.4964] }},
      { type: "Feature", properties: { intensity: 0.4, risk: "Medium", crimes: 82, city: "Erfurt", incident: "Drug dealing", date: "2024-01-01", details: "Small-scale drug operation discovered" }, geometry: { type: "Point", coordinates: [11.0297, 50.9848] }},
      
      // Oeste de Alemania
      { type: "Feature", properties: { intensity: 0.8, risk: "High", crimes: 156, city: "Cologne", incident: "Organized crime", date: "2023-12-31", details: "Money laundering operation uncovered" }, geometry: { type: "Point", coordinates: [6.9603, 50.9375] }},
      { type: "Feature", properties: { intensity: 0.6, risk: "Medium", crimes: 119, city: "Düsseldorf", incident: "Cybercrime", date: "2023-12-30", details: "Online banking fraud scheme" }, geometry: { type: "Point", coordinates: [6.7735, 51.2277] }},
      { type: "Feature", properties: { intensity: 0.5, risk: "Medium", crimes: 97, city: "Essen", incident: "Burglary", date: "2023-12-29", details: "Multiple break-ins in industrial area" }, geometry: { type: "Point", coordinates: [7.0115, 51.4556] }},
      { type: "Feature", properties: { intensity: 0.7, risk: "High", crimes: 134, city: "Dortmund", incident: "Drug trafficking", date: "2023-12-28", details: "Large quantity drugs seized" }, geometry: { type: "Point", coordinates: [7.4660, 51.5136] }},
      { type: "Feature", properties: { intensity: 0.4, risk: "Medium", crimes: 71, city: "Bochum", incident: "Theft", date: "2023-12-27", details: "Electronics stolen from store" }, geometry: { type: "Point", coordinates: [7.2162, 51.4818] }},
      { type: "Feature", properties: { intensity: 0.3, risk: "Low", crimes: 58, city: "Wuppertal", incident: "Vandalism", date: "2023-12-26", details: "Public transport vandalism" }, geometry: { type: "Point", coordinates: [7.1772, 51.2562] }},
      { type: "Feature", properties: { intensity: 0.5, risk: "Medium", crimes: 91, city: "Duisburg", incident: "Assault", date: "2023-12-25", details: "Bar fight resulting in injuries" }, geometry: { type: "Point", coordinates: [6.7669, 51.4344] }},
      { type: "Feature", properties: { intensity: 0.6, risk: "Medium", crimes: 103, city: "Gelsenkirchen", incident: "Theft", date: "2023-12-24", details: "Vehicle parts stolen from junkyard" }, geometry: { type: "Point", coordinates: [7.0857, 51.5177] }},
      { type: "Feature", properties: { intensity: 0.4, risk: "Medium", crimes: 76, city: "Mönchengladbach", incident: "Fraud", date: "2023-12-23", details: "Insurance fraud attempt" }, geometry: { type: "Point", coordinates: [6.4428, 51.1805] }},
      { type: "Feature", properties: { intensity: 0.3, risk: "Low", crimes: 47, city: "Aachen", incident: "Trespassing", date: "2023-12-22", details: "Unauthorized access to university building" }, geometry: { type: "Point", coordinates: [6.0839, 50.7753] }},
      
      // Sur de Alemania
      { type: "Feature", properties: { intensity: 0.8, risk: "High", crimes: 167, city: "Munich", incident: "Organized theft", date: "2023-12-21", details: "Coordinated shoplifting ring" }, geometry: { type: "Point", coordinates: [11.5761, 48.1374] }},
      { type: "Feature", properties: { intensity: 0.6, risk: "Medium", crimes: 125, city: "Stuttgart", incident: "Drug possession", date: "2023-12-20", details: "Drugs found during routine check" }, geometry: { type: "Point", coordinates: [9.1815, 48.7758] }},
      { type: "Feature", properties: { intensity: 0.5, risk: "Medium", crimes: 98, city: "Nuremberg", incident: "Burglary", date: "2023-12-19", details: "Residential break-in attempt" }, geometry: { type: "Point", coordinates: [11.0774, 49.4521] }},
      { type: "Feature", properties: { intensity: 0.4, risk: "Medium", crimes: 84, city: "Augsburg", incident: "Theft", date: "2023-12-18", details: "Bicycle theft from train station" }, geometry: { type: "Point", coordinates: [10.8978, 48.3705] }},
      { type: "Feature", properties: { intensity: 0.3, risk: "Low", crimes: 62, city: "Regensburg", incident: "Vandalism", date: "2023-12-17", details: "Graffiti on historical monument" }, geometry: { type: "Point", coordinates: [12.1016, 49.0134] }},
      { type: "Feature", properties: { intensity: 0.2, risk: "Low", crimes: 39, city: "Passau", incident: "Traffic violation", date: "2023-12-16", details: "Drunk driving incident" }, geometry: { type: "Point", coordinates: [13.4500, 48.5667] }},
      
      // Suroeste de Alemania
      { type: "Feature", properties: { intensity: 0.7, risk: "High", crimes: 142, city: "Frankfurt", incident: "Financial crime", date: "2023-12-15", details: "Credit card fraud network" }, geometry: { type: "Point", coordinates: [8.6821, 50.1109] }},
      { type: "Feature", properties: { intensity: 0.5, risk: "Medium", crimes: 95, city: "Wiesbaden", incident: "Theft", date: "2023-12-14", details: "Jewelry stolen from store" }, geometry: { type: "Point", coordinates: [8.2397, 50.0826] }},
      { type: "Feature", properties: { intensity: 0.4, risk: "Medium", crimes: 77, city: "Mainz", incident: "Assault", date: "2023-12-13", details: "Domestic violence incident" }, geometry: { type: "Point", coordinates: [8.2473, 49.9929] }},
      { type: "Feature", properties: { intensity: 0.6, risk: "Medium", crimes: 116, city: "Mannheim", incident: "Drug dealing", date: "2023-12-12", details: "Street-level drug sales" }, geometry: { type: "Point", coordinates: [8.4660, 49.4875] }},
      { type: "Feature", properties: { intensity: 0.3, risk: "Low", crimes: 54, city: "Heidelberg", incident: "Trespassing", date: "2023-12-11", details: "Unauthorized entry to university" }, geometry: { type: "Point", coordinates: [8.6721, 49.3988] }},
      { type: "Feature", properties: { intensity: 0.2, risk: "Low", crimes: 43, city: "Freiburg", incident: "Petty theft", date: "2023-12-10", details: "Small items stolen from market" }, geometry: { type: "Point", coordinates: [7.8421, 47.9990] }},
      { type: "Feature", properties: { intensity: 0.4, risk: "Medium", crimes: 69, city: "Karlsruhe", incident: "Burglary", date: "2023-12-09", details: "Office break-in during weekend" }, geometry: { type: "Point", coordinates: [8.4037, 49.0069] }},
      
      // Puntos adicionales distribuidos
      { type: "Feature", properties: { intensity: 0.3, risk: "Low", crimes: 51, city: "Kassel", incident: "Vandalism", date: "2023-12-08", details: "Public property damage" }, geometry: { type: "Point", coordinates: [9.5018, 51.3127] }},
      { type: "Feature", properties: { intensity: 0.5, risk: "Medium", crimes: 88, city: "Fulda", incident: "Theft", date: "2023-12-07", details: "Vehicle break-in" }, geometry: { type: "Point", coordinates: [9.6833, 50.5500] }},
      { type: "Feature", properties: { intensity: 0.4, risk: "Medium", crimes: 74, city: "Würzburg", incident: "Fraud", date: "2023-12-06", details: "Online scam operation" }, geometry: { type: "Point", coordinates: [9.9296, 49.7913] }},
      { type: "Feature", properties: { intensity: 0.2, risk: "Low", crimes: 35, city: "Bamberg", incident: "Trespassing", date: "2023-12-05", details: "Unauthorized access to brewery" }, geometry: { type: "Point", coordinates: [10.9000, 49.9000] }},
      { type: "Feature", properties: { intensity: 0.6, risk: "Medium", crimes: 107, city: "Ulm", incident: "Drug possession", date: "2023-12-04", details: "Drugs found during traffic stop" }, geometry: { type: "Point", coordinates: [9.9930, 48.4011] }},
      { type: "Feature", properties: { intensity: 0.3, risk: "Low", crimes: 48, city: "Konstanz", incident: "Theft", date: "2023-12-03", details: "Tourist belongings stolen" }, geometry: { type: "Point", coordinates: [9.1833, 47.6667] }},
      { type: "Feature", properties: { intensity: 0.5, risk: "Medium", crimes: 92, city: "Tübingen", incident: "Assault", date: "2023-12-02", details: "Student altercation" }, geometry: { type: "Point", coordinates: [9.0500, 48.5167] }},
      { type: "Feature", properties: { intensity: 0.4, risk: "Medium", crimes: 81, city: "Reutlingen", incident: "Burglary", date: "2023-12-01", details: "Residential break-in" }, geometry: { type: "Point", coordinates: [9.2044, 48.4919] }},
      { type: "Feature", properties: { intensity: 0.2, risk: "Low", crimes: 37, city: "Ravensburg", incident: "Vandalism", date: "2023-11-30", details: "Graffiti on public building" }, geometry: { type: "Point", coordinates: [9.6167, 47.7833] }},
      { type: "Feature", properties: { intensity: 0.6, risk: "Medium", crimes: 114, city: "Friedrichshafen", incident: "Drug dealing", date: "2023-11-29", details: "Small-scale drug operation" }, geometry: { type: "Point", coordinates: [9.4833, 47.6500] }}
    ]
  }


  useEffect(() => {
    if (map.current) return // Initialize map only once
    
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    console.log('Mapbox token:', token ? 'Token exists' : 'Token missing')
    
    if (!token) {
      console.error('Mapbox token is missing. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file')
      setHasToken(false)
      return
    }
    
    mapboxgl.accessToken = token

    if (mapContainer.current) {
      try {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [10.4515, 51.1657],
          zoom: 5.5,
          attributionControl: false
        })

        map.current.on('load', () => {
          console.log('Map loaded successfully')
          setMapLoaded(true)
          
          // Añadir el mapa de calor después de que el mapa esté completamente cargado
          setTimeout(() => {
            addHeatmapLayers()
          }, 1000)
        })

        map.current.on('error', (e) => {
          console.error('Map error:', e)
          console.error('Error details:', JSON.stringify(e, null, 2))
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
      } catch (error) {
        console.error('Error initializing map:', error)
      }
    }

    return () => {
      map.current?.remove()
    }
  }, [])

  // Función para añadir las capas del mapa de calor
  const addHeatmapLayers = () => {
    if (!map.current) return

    try {
      // Limpiar fuentes y capas existentes
      if (map.current.getSource('crime-data')) {
        map.current.removeLayer('crime-heatmap');
        map.current.removeLayer('crime-points');
        map.current.removeSource('crime-data');
      }

      // Añadir fuente de datos para el mapa de calor
      map.current.addSource('crime-data', {
        type: 'geojson',
        data: crimeData as any
      })
      console.log('Crime data source added successfully')

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

      console.log('Heatmap layers added successfully')

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
      console.error('Error adding heatmap layers:', error)
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


  // Funciones para el buscador
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 0) {
      const results = germanCities.filter(city => 
        city.name.toLowerCase().includes(query.toLowerCase()) ||
        city.state.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8) // Mostrar máximo 8 resultados
      setSearchResults(results)
    } else {
      setSearchResults([])
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


  return (
    <div className="relative w-screen h-screen bg-gray-900">
      <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%' }} />
      
      
      {!hasToken && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center">
            <p className="text-white text-xl mb-4">⚠️ Token de Mapbox requerido</p>
            <p className="text-white/70 text-sm max-w-md">
              Para mostrar el mapa, necesitas configurar tu token de Mapbox.<br/>
              Crea un archivo <code className="bg-white/10 px-2 py-1 rounded">.env.local</code> en la raíz del proyecto y añade:<br/>
              <code className="bg-white/10 px-2 py-1 rounded block mt-2">
                NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=tu_token_aqui
              </code>
              <br/><br/>
              Obtén tu token gratuito en: <a href="https://account.mapbox.com/access-tokens/" target="_blank" className="text-blue-400 hover:text-blue-300">mapbox.com</a>
            </p>
          </div>
        </div>
      )}
      
      {/* Controles del mapa */}
      {mapLoaded && (
        <div className="map-controls-container">
          {/* Botón de ubicación */}
          <button
            onClick={handleGetLocation}
            className={`map-control-bubble ${isLocating ? 'locating' : ''}`}
            title="My Location"
            disabled={isLocating}
          >
            {isLocating ? '⟳' : '📍'}
          </button>
          
          {/* Controles de zoom */}
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

      {/* Mensaje de error de ubicación */}
      {locationError && (
        <div className="absolute top-20 right-20 bg-red-500/90 backdrop-blur-md text-white px-4 py-2 rounded-lg text-sm z-50 max-w-xs">
          {locationError}
        </div>
      )}


      {/* Buscador de ciudades - más corto */}
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
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search city..."
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
            maxHeight: '150px',
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
                  padding: '8px 12px',
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
                  marginBottom: '1px'
                }}>
                  {city.name}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#6b7280',
                  fontWeight: '400'
                }}>
                  {city.state}
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

    </div>
  )
}

