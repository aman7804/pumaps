import L from "leaflet";
import polyline from "@mapbox/polyline";
import getIcons from "./getIcons";
import getMarkerData from "./getMarkerData";

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

export async function getRoutes(from, to) {
  const response = await fetch(
    `https://graphhopper.com/api/1/route?point=${from.lat},${from.lng}&point=${to.lat},${to.lng}&vehicle=foot&alternative_route.max_paths=3&key=dc0eb692-08c1-4cae-bfa1-661c6e458bac`
  );
  const data = await response.json();
  const routes = data.paths.map((path) => ({
    distance: path.distance,
    time: path.time,
    points: polyline.decode(path.points),
  }));

  return routes;
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
export function searchMarkers(value) {
  const markers = Object.values(markerData).flat();
  const regex = new RegExp(value, "i"); // case-insensitive

  return markers.filter(
    (m) => regex.test(m.type) || regex.test(m.name) || regex.test(m.description)
  );
}
