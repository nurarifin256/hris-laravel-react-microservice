import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "./style.css";

function MyMap(props) {
  const { latitude, longitude } = props;
  return (
    <div className="map" id="map">
      {latitude ? (
        <>
          <MapContainer
            center={[latitude, longitude]}
            zoom={16}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[latitude, longitude]}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>

            <Circle
              // center={[-6.1840221, 106.6981393]}
              center={[-6.184893, 106.696048]}
              fillColor="blue"
              radius={50}
            />
          </MapContainer>
          <p>
            Latitude: {latitude}, Longitude: {longitude}
          </p>
        </>
      ) : (
        "Loading.."
      )}
    </div>
  );
}

export default MyMap;
