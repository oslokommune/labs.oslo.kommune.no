<template>
  <GoogleMap
    ref="mapRef"
    :api-key="googleMapsKey"
    :center="mapCenter"
    :zoom="zoomLevel"
    style="width: 100%; height: 50vh"
  >
    <Marker
      v-if="markersComputed.length"
      v-for="marker in markersComputed"
      :options="{ position: marker, animation: 'DROP' }"
    ></Marker>
    <Polygon
      v-if="polygonsComputed.length"
      v-for="polygon in polygonsComputed"
      :options="{
        paths: polygon,
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillOpacity: 0.25,
      }"
    ></Polygon>
  </GoogleMap>
</template>

<script setup>
import { ref, computed } from 'vue'
import { GoogleMap, Marker, Polygon } from 'vue3-google-map'

const props = defineProps(['center', 'zoom', 'markers', 'geoJSON', 'googleMapsKey'])
const mapRef = ref(null)
const mapCenter = computed(() => {
  let coordinates = props.center.split(',').map((d) => +d)
  return { lat: coordinates[0], lng: coordinates[1] }
})
const zoomLevel = computed(() => +props.zoom)
const markersComputed = computed(() => {
  if (props.markers && props.markers.length) {
    return props.markers.map((m) => {
      return { lat: m[0], lng: m[1] }
    })
  }
  return []
})
const polygonsComputed = computed(() => {
  if (props.geoJSON && props.geoJSON.features && props.geoJSON.features.length) {
    return props.geoJSON.features.map((p) => {
      return p.geometry.coordinates[0].map((c) => {
        return { lat: c[1], lng: c[0] }
      })
    })
  }
  return []
})
</script>
