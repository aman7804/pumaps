import L from "leaflet";
// import "./App.css";
import { useEffect } from "react";

function App() {
  const icons = {
    food: L.icon({
      iconUrl: "assets/iconSetFour/food.png",
      iconSize: [35, 35], // size of the icon
    }),
    hospital: L.icon({
      iconUrl: "assets/iconSetFour/hospital.png",
      iconSize: [35, 35], // size of the icon
    }),
    basketball: L.icon({
      iconUrl: "assets/iconSetFour/basketball.png",
      iconSize: [35, 35], // size of the icon
    }),
    gym: L.icon({
      iconUrl: "assets/iconSetThree/gym.png",
      iconSize: [35, 35], // size of the icon
    }),
    shopping: L.icon({
      iconUrl: "assets/iconSetFour/shopping.png",
      iconSize: [35, 35], // size of the icon
    }),
  };

  const markers = {
    hospital: { coords: [22.2882, 73.365278], icon: icons.hospital },
    basketball: { coords: [22.290268, 73.364489], icon: icons.basketball },
    food: { coords: [22.289217, 73.364918], icon: icons.food },
    food2: { coords: [22.291092, 73.363556], icon: icons.food },
    food3: { coords: [22.292382, 73.364607], icon: icons.food },
    food4: { coords: [22.293484, 73.365589], icon: icons.food },
    food5: { coords: [22.289916, 73.361214], icon: icons.food },
    food6: { coords: [22.293861, 73.358932], icon: icons.food },
    gym: { coords: [22.289896, 73.365058], icon: icons.gym },
    shopping: { coords: [22.28991, 73.364519], icon: icons.shopping },
  };

  useEffect(() => {
    // map initialization
    const map = L.map("map", {
      maxBounds: [
        [22.28402, 73.35657], // Southwest corner
        [22.29755, 73.36966], // Northeast corner
      ],
      minZoom: 16, // Prevent zooming out too much
      maxBoundsViscosity: 1.0, // Strong lock
    }).setView([22.2908, 73.36438], 16); // PU coordinates

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // user current location
    const success = (pos) => {
      if (!map) return;
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const accuracy = pos.coords.accuracy;
      console.log(lat, lng);

      L.marker([lat, lng]).addTo(map);
      L.circle([lat, lng], { radius: accuracy }).addTo(map);
    };
    const error = (e) => {
      if (e.code === 1) alert("Please allow geolocation access");
      else alert("Cannot get current location");
    };
    navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 5000,
    });

    // if ("geolocation" in navigator) {
    //   navigator.geolocation.getCurrentPosition(success, error);
    // } else {
    //   alert("Geolocation not available");
    // }

    // adding markers
    for (let key in markers) {
      const marker = markers[key];
      L.marker(marker.coords, { icon: marker.icon }).addTo(map);
    }
    // gray, white, cream
    // L.tileLayer(
    //   "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    //   {
    //     attribution: "&copy; OpenStreetMap & CartoDB",
    //     maxZoom: 20,
    //   }
    // ).addTo(map);

    // black and white
    // L.tileLayer(
    //   "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
    //   {
    //     attribution: "&copy; OpenMapTiles & Stadia Maps",
    //     maxZoom: 20,
    //   }
    // ).addTo(map);

    return () => {
      map.remove();
    };
  }, []);

  return (
    <>
      <div id="map" style={{ height: "100vh" }}></div>
    </>
  );
}

export default App;
