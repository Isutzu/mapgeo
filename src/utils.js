/******************** getGeojsonFormat()****************/
export function getGeojsonFormat(infoCoordenadas) {
  const geojsonRutas = [];

  infoCoordenadas.forEach(function (data) {
    let coord = data.coordinates;
    console.log(coord);

    const geojsonBloque = {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: coord,
      },
    };
    geojsonRutas.push(geojsonBloque);
    console.log("GEOJSON", JSON.stringify(geojsonBloque));
  });

  return {
    type: "FeatureCollection",
    features: geojsonRutas,
  };
}

/**************************** generateRandomColor()********************/
export function generateRandomColor() {
  // Generar un numero aleatorio entre 0 and 16777215 (tel valor maximode un RGB color)
  let randomNumber = Math.floor(Math.random() * 16777215);

  // Convertir el numero aleatorio a  HEX string
  let hexString = randomNumber.toString(16);

  // Dar el formato de un HEX string con 6 carcteres
  hexString = "000000".slice(0, 6 - hexString.length) + hexString;

  // Return HEX string
  return "#" + hexString;
}

/**************************** generateColor()********************/
export function generateColor() {
  const colors = [
    "#fabd4a",
    "#d883ff",
    "#f77976",
    "#52e3e1",
    "#ffe808",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF6600",
    "#66FF00",
    "#0066FF",
    "#FF00FF",
    "#3333FF",
    "#FF0066",
    "#6600FF",
    "#00FFFF",
    "#9999FF",
    "#33FF33",
    "#FF33FF",
    "#333333",
    "#666666",
    "#999999",
    "#CCCCCC",
  ];

  let randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
