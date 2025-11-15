import getIcons from "./getIcons";
import getMarkerData from "./getMarkerData";

//creates and returns marker(icon + location name)
export function createIconForMarker(locName, iconUrl, isActive = false) {
  const scale = isActive ? 1.5 : 1; // enlarge active marker

  return new L.divIcon({
    className: "marker-div-icon",
    html: `
      <div class="marker-wrapper">
        <img class="location-icon-img" src="${iconUrl}" style="transform: scale(${scale}); width: 30px; height: 30px;" />
        <span class="icon-span">${locName}</span>
      </div>
    `,
    iconSize: null, // let CSS/HTML define size
  });
}

export function toLowerCamelCase(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    )
    .replace(/\s+/g, "");
}
const icons = getIcons();
const markerData = getMarkerData(icons);

// Dropdown search: only checks type
export function dropDownSearch(value) {
  const name = toLowerCamelCase(value);
  const markers = Object.values(markerData).flat();
  return markers.filter((m) => m.type === name);
}

// General search: checks multiple fields
export function changeMarkerIconOnClick(marker, map) {
  if (!marker || !map?.eachLayer) return;

  // Reset all markers
  map.eachLayer((layer) => {
    if (layer.options?.myData) {
      const { name, defaultIconUrl } = layer.options.myData;
      layer.setIcon(createIconForMarker(name, defaultIconUrl));
    }
  });

  // Highlight clicked marker
  const { name } = marker.options.myData;
  marker.setIcon(createIconForMarker(name, "assets/redLocationIcon.png", true));
}
