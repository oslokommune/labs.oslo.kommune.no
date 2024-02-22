<template>
  <GmapMap ref="mapRef" :center="{ lat: 0, lng: 0 }" :zoom="1" style="width: 100%; height: 50vh"></GmapMap>
</template>

<script>
import mapstyles from './../mapStyles.js'

export default {
  props: ['center', 'zoom', 'markers', 'geoJSON'],
  mounted() {
    this.$refs.mapRef.$mapPromise.then((map) => {
      let mapCoordinates = this.center.split(',').map((d) => +d)

      // Map options
      map.setOptions({
        zoom: +this.zoom,
        center: { lat: mapCoordinates[0], lng: mapCoordinates[1] },
        styles: mapstyles,
        gestureHandling: 'cooperative',
        disableDefaultUI: true,
        zoomControl: true,
        fullscreenControl: true,
      })

      // Draw markers on map
      this.markers.forEach((markerCoordinates) => {
        new google.maps.Marker({
          position: {
            lat: markerCoordinates[0],
            lng: markerCoordinates[1],
          },
          animation: google.maps.Animation.DROP,
          map: map,
        })
      })

      // Draw distric overlays
      if (this.geoJSON && this.geoJSON.type === 'FeatureCollection') {
        map.data.addGeoJson(this.geoJSON)
      }

      // Overlay styling
      map.data.setStyle({
        fillColor: 'blue',
        strokeWeight: 1,
      })
    })
  },
}
</script>
