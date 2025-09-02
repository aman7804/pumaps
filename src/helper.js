import L from "leaflet";

export function addAllMarkers(
  map,
  markerData,
  toggleDrawerVisibility,
  toggleDrawer,
  getCurrentMarkerData,
  setDrawerView
) {
  Object.values(markerData).forEach((markerType) => {
    const markerCluster = L.markerClusterGroup({
      maxClusterRadius: (zoom) => {
        const sizes = {
          16: 80,
          17: 70,
          18: 60,
          19: 50,
          20: 40,
          21: 30,
          22: 20,
        };
        return sizes[zoom] || 10;
      },
      disableClusteringAtZoom: 25, // beyond zoom 25, no clustering
      iconCreateFunction: (cluster) => {
        const children = cluster.getAllChildMarkers();
        const color = children[0]?.options.iconColor || "#000";

        return L.divIcon({
          html: `
            <div style="
              width: 20px;
              height: 20px;
              background-color: ${color};
              border-radius: 50%;
              color: white;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 16px;
            ">
              ${cluster.getChildCount()}
            </div>
          `,
          className: "",
          iconSize: L.point(25, 25),
        });
      },
    });

    markerType.forEach(({ coords, icon, name, iconColor }) => {
      let marker = L.marker([coords.lat, coords.lng], {
        icon: new L.divIcon({
          className: "marker-div-icon",
          html: `
            <div class="marker-wrapper">
              <img class="icon-img" src="${icon.options.iconUrl}">
              <span class="icon-span">${name}</span>
            </div>
          `,
          iconSize: [170, 25],
        }),
        iconColor,
        myData: { coords, icon, name, iconColor }, // ✅ Ensure marker data is accessible
      }).on("click", (e) => {
        toggleDrawerVisibility(true)();
        setDrawerView("OPEN");
        toggleDrawer(true);
        getCurrentMarkerData(e.target.options.myData);
      });

      markerCluster.addLayer(marker);
    });

    map.addLayer(markerCluster);
  });
}
