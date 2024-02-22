<template>
  <GoogleMap ref="mapRef" :center="mapCenter" :zoom="zoomLevel" style="width: 100%; height: 50vh"></GoogleMap>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useGoogleMap } from 'vue3-google-map'
import mapstyles from './../mapStyles.js'

defineProps(['center', 'zoom', 'markers', 'geoJSON'])
const mapRef = ref(null)

// Konverterer `center` til et objekt for Google Maps
const mapCenter = computed(() => {
  let coordinates = props.center.split(',').map((d) => +d)
  return { lat: coordinates[0], lng: coordinates[1] }
})
const zoomLevel = computed(() => +props.zoom)

onMounted(() => {
  const map = useGoogleMap(mapRef.value)

  // Map options
  map.setOptions({
    styles: mapstyles,
    gestureHandling: 'cooperative',
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: true,
  })

  // Draw markers on map
  props.markers.forEach((markerCoordinates) => {
    new google.maps.Marker({
      position: { lat: markerCoordinates[0], lng: markerCoordinates[1] },
      animation: google.maps.Animation.DROP,
      map: map,
    })
  })

  // Draw district overlays
  if (props.geoJSON && props.geoJSON.type === 'FeatureCollection') {
    map.data.addGeoJson(props.geoJSON)
  }

  // Overlay styling
  map.data.setStyle({
    fillColor: 'blue',
    strokeWeight: 1,
  })
})
</script>
