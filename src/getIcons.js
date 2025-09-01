import L from "leaflet";
export default function getIcons() {
  return {
    food: L.icon({
      iconUrl: "assets/markerIcons/food.svg",
      iconSize: [15, 15],
    }),
    foodCourt: L.icon({
      iconUrl: "assets/markerIcons/foodCourt.svg",
      iconSize: [15, 15],
    }),
    hospital: L.icon({
      iconUrl: "assets/markerIcons/hospital.svg",
      iconSize: [15, 15],
    }),
    sports: L.icon({
      iconUrl: "assets/markerIcons/sport.svg",
      iconSize: [15, 15],
    }),
    gym: L.icon({ iconUrl: "assets/markerIcons/gym.svg", iconSize: [15, 15] }),
    mart: L.icon({
      iconUrl: "assets/markerIcons/mart.svg",
      iconSize: [15, 15],
    }),
    academicBlock: L.icon({
      iconUrl: "assets/markerIcons/academicBlock.svg",
      iconSize: [15, 15],
    }),
    adminBlock: L.icon({
      iconUrl: "assets/markerIcons/adminBlock.svg",
      iconSize: [15, 15],
    }),
    auditorium: L.icon({
      iconUrl: "assets/markerIcons/auditorium.svg",
      iconSize: [15, 15],
    }),
    location: L.icon({
      iconUrl: "assets/markerIcons/location.svg",
      iconSize: [15, 15],
    }),
    park: L.icon({
      iconUrl: "assets/markerIcons/park.svg",
      iconSize: [15, 15],
    }),
    service: L.icon({
      iconUrl: "assets/markerIcons/service.svg",
      iconSize: [15, 15],
    }),
    study: L.icon({
      iconUrl: "assets/markerIcons/study.svg",
      iconSize: [15, 15],
    }),
    temple: L.icon({
      iconUrl: "assets/markerIcons/temple.svg",
      iconSize: [15, 15],
    }),
    touristAttraction: L.icon({
      iconUrl: "assets/markerIcons/touristSpot.svg",
      iconSize: [15, 15],
    }),
    apartment: L.icon({
      iconUrl: "assets/markerIcons/apartment.svg",
      iconSize: [15, 15],
    }),
  };
}
