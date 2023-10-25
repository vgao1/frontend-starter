<template>
  <div id="map" class="map-container"></div>
</template>
<script lang="ts">
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";

export default {
  name: "BaseMap",
  props: ["postsWithDestinations"],
  data() {
    return {
      accessToken: "pk.eyJ1IjoidmdhbyIsImEiOiJjbG8yM2VxYTcxZ3B2MmtwZG51OWphdHVvIn0.FyQStQzF5XW9Ii-w6qiIgA",
      geocoder: new MapboxGeocoder({
        accessToken: "pk.eyJ1IjoidmdhbyIsImEiOiJjbG8yM2VxYTcxZ3B2MmtwZG51OWphdHVvIn0.FyQStQzF5XW9Ii-w6qiIgA",
        mapboxgl: mapboxgl,
        marker: false,
      }),
      map: {},
    };
  },

  mounted() {
    this.createMap();
  },

  methods: {
    async createMap() {
      mapboxgl.accessToken = "pk.eyJ1IjoidmdhbyIsImEiOiJjbG8yM2VxYTcxZ3B2MmtwZG51OWphdHVvIn0.FyQStQzF5XW9Ii-w6qiIgA";
      const currentMap = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-71.110558, 42.373611],
        zoom: 12,
      }).addControl(this.geocoder);

      for (const post of this.postsWithDestinations) {
        const googleMapURL = "https://maps.google.com/?q=" + post.options.latitude + "," + post.options.longitude;
        const popupImage = `<img class="popup-img" src=${post.photoURL} />`;
        const artistLink = `<a class="popup-link" href='/searchArtist/${post.author}'>${post.author}</a>`;
        const newLine = `<hr class="popup-linebreak" />`;
        const visitButton = `<a href=${googleMapURL}><button class="pure-button brown-btn">Visit</button></a>`;
        const popup = new mapboxgl.Popup().setHTML(`<div class="base">${popupImage}<div class="location-details">${artistLink}${newLine}${visitButton}</div></div>`);
        this.geocoder.on("result", () => {
          new mapboxgl.Marker({
            draggable: false,
            color: "#D80739",
          })
            .setLngLat([post.options.longitude, post.options.latitude])
            .setPopup(popup)
            .addTo(currentMap);
          this.map = currentMap;
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.map-container {
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
