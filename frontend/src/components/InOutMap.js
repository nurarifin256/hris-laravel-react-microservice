import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./inOutMap.css";

const greenIcon = new L.Icon({
  iconUrl:
    "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|2ecc71&chf=a,s,ee00FFFF",
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|abcdef&chf=a,s,ee00FFFF",
});

function InOutMap(props) {
  const { latitude, longitude, latitudeO, longitudeO } = props;
  return (
    <div className="map" id="map">
      {latitude ? (
        <>
          <MapContainer
            center={[latitude, longitude]}
            zoom={19}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]} icon={blueIcon}>
              <Popup>In.</Popup>
            </Marker>

            <Marker position={[latitudeO, longitudeO]} icon={greenIcon}>
              <Popup>Out.</Popup>
            </Marker>
          </MapContainer>
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default InOutMap;
