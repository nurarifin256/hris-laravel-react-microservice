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
            <Marker position={[latitude, longitude]} greenIcon>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>

            <Circle
              center={[-6.1840221, 106.6981393]}
              fillColor="blue"
              radius={40}
            />
          </MapContainer>
          <p className="text-center">
            Latitude: {latitude}, Longitude: {longitude}
          </p>
        </>
      ) : (
        "Loading..."
      )}
    </div>
  );
}

export default MyMap;
