mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v12", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

new mapboxgl.Marker().setLngLat(campground.geometry.coordinates).addTo(map);

const popup = new mapboxgl.Popup({ closeOnClick: false, offset: 50 })
  .setLngLat(campground.geometry.coordinates)
  .setHTML(
    `<h3>${campground.title}</h3><p>${campground.geometry.coordinates}</p>`
  )
  .addTo(map);

map.addControl(new mapboxgl.NavigationControl());
