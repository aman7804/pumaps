import L from "leaflet";

export function getIcons() {
  return {
    food: L.icon({
      iconUrl: "assets/iconSetFour/food.png",
      iconSize: [35, 35],
    }),
    hospital: L.icon({
      iconUrl: "assets/iconSetFour/hospital.png",
      iconSize: [35, 35],
    }),
    basketball: L.icon({
      iconUrl: "assets/iconSetFour/basketball.png",
      iconSize: [35, 35],
    }),
    gym: L.icon({ iconUrl: "assets/iconSetThree/gym.png", iconSize: [35, 35] }),
    shopping: L.icon({
      iconUrl: "assets/iconSetFour/shopping.png",
      iconSize: [35, 35],
    }),
  };
}

export function getMarkers(icons) {
  return {
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
}

export function addAllMarkers(map, markers) {
  Object.values(markers).forEach(({ coords, icon }) => {
    L.marker(coords, { icon }).addTo(map);
  });
}
