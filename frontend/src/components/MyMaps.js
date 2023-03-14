import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
// import "./style2.css";

const MyMaps = ({ koordinat }) => {
  return (
    <div className="map" id="map">
      <>
        <MapContainer
          center={[-6.1839964, 106.6981386]}
          zoom={16}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {koordinat.map((koor, i) => {
            return (
              <div key={i}>
                <Marker position={[koor.latitude, koor.longitude]}>
                  <Popup>{koor.employees.name}</Popup>
                </Marker>
              </div>
            );
          })}

          <Circle
            center={[-6.1840221, 106.6981393]}
            fillColor="blue"
            radius={40}
          />
        </MapContainer>
      </>
    </div>
  );
};

export default MyMaps;
