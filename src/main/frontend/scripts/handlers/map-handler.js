import mapStyles from '../mapStyles.js'

function init() {
  const mapElements = document.querySelectorAll('.map')
  const mapKey = mapElements[0].getAttribute('googleMapsKey')

  createMapScriptElement(mapKey)
}

function renderMaps() {
  let mapElements = [...document.querySelectorAll('.map')]

  mapElements.forEach(el => {
    const markers = JSON.parse(el.getAttribute('markers')) || []
    const geoJSON = JSON.parse(el.getAttribute('geoJSON')) || null
    const zoom = +el.getAttribute('zoom')
    const coordinates = el
      .getAttribute('coordinates')
      .split(',')
      .map(d => +d)

    // Map settings
    const map = new google.maps.Map(el, {
      center: {
        lat: coordinates[0],
        lng: coordinates[1]
      },
      zoom: zoom,
      disableDefaultUI: true,
      zoomControl: true,
      fullscreenControl: true,
      styles: mapStyles
    })

    // Draw distric overlays
    if (geoJSON) {
      map.data.addGeoJson(geoJSON)
    }

    // Overlay styling
    map.data.setStyle({
      fillColor: 'blue',
      strokeWeight: 1
    })

    // Draw map markers
    markers.forEach(coordinates => {
      new google.maps.Marker({
        position: {
          lat: coordinates[0],
          lng: coordinates[1]
        },
        animation: google.maps.Animation.DROP,
        map: map
      })
    })
  })
}

// Create map script element including map Key
function createMapScriptElement(key) {
  // Name of the callback function.
  const callback = 'renderMaps'

  const mapsScript = document.createElement('script')
  mapsScript.setAttribute(
    'src',
    `https://maps.googleapis.com/maps/api/js?key=${key}&callback=${callback}`
  )
  mapsScript.setAttribute('async', true)
  mapsScript.setAttribute('defer', true)
  document.body.appendChild(mapsScript)
}

// Expose render function for Google Maps's callback
window.renderMaps = renderMaps

export { init }
