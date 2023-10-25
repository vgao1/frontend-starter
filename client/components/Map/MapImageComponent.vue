<template>
  <div id="map" class="map-container"></div>
</template>
<script lang="ts">
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";

export default {
  name: "BaseMap",
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

      const popup = new mapboxgl.Popup().setHTML(`<h3>The Metropolitan Museum of Art</h3><p>Art from around the world</p>`);
      this.geocoder.on("result", () => {
        const marker = new mapboxgl.Marker({
          draggable: false,
          color: "#D80739",
        })
          .setLngLat([-73.96354299999999, 40.7793195])
          .setPopup(popup)
          .addTo(currentMap);
        this.map = currentMap;
      });
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
