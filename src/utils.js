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

/******************** getGeojsonFormat()****************/
// Esta funcion es para fines de prueba. Es parte de la Simulacion del formato de la data en dynamoDB
// Retorna la data en formato geojson
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
/**************************** displayTodasLasRutas()********************/
export function displayTodasLasRutas() {
  // Esta funcion es para fines de prueba. Simula el formato de la data del dynamoDB
  let data = [
    [66, -77.02344417415036, -12.054010087308075],
    [66, -77.02361583553322, -12.055017344072041],
    [66, -77.02372328756853, -12.055583114620019],
    [66, -77.02395915829895, -12.056696096941591],
    [66, -77.02421892172019, -12.057858242132719],
    [66, -77.02453248618347, -12.058253914512916],
    [66, -77.02454260116617, -12.058263806314939],
    [66, -77.02499777538709, -12.058323157119437],
    [77, -77.09764303450447, -11.996755463024328],
    [77, -77.09748082772765, -11.997196196217345],
    [77, -77.0972645520254, -11.997531152961642],
    [77, -77.09695816144702, -11.997337230686753],
    [77, -77.09656165599262, -11.99751352367008],
    [77, -77.09625526541426, -11.99763692868899],
    [77, -77.09589480591048, -11.997795592203147],
    [77, -77.09562446128226, -11.997936626358992],
    [77, -77.09492156524952, -11.998183435954076],
    [77, -77.09423669219206, -11.998994380176967],
    [77, -77.09436285301874, -11.998923863384448],
    [77, -77.09490354227468, -11.999840580242662],
    [77, -77.09567853020773, -12.000228421051503],
    [66, -77.02704976368354, -12.058560729981759],
    [66, -77.03014801947108, -12.058995014083504],
    [66, -77.03213090315836, -12.059197006453083],
    [66, -77.0351362113584, -12.059600990722437],
    [66, -77.03551832958989, -12.059439397088584],
  ];
  let result = {};
  for (let i = 0; i < data.length; i++) {
    let placa = data[i][0].toString();
    let coordinates = data[i].slice(1);
    if (result.hasOwnProperty(placa)) {
      result[placa].coordinates.push(coordinates);
    } else {
      result[placa] = {
        placa: placa,
        coordinates: [coordinates],
      };
    }
  }
  let finalResult = Object.values(result);
  const geojsonRutasTotales = getGeojsonFormat(finalResult);
  return geojsonRutasTotales;
}

/**************************** getGeojsonTypePoint()********************/
export function getGeojsonTypePoint(grupoDeCoordenadas) {
  let geojsonTypePoint = [];

  grupoDeCoordenadas.forEach(function (parDeCoordenadas) {
    const geojsonBloque = [
      {
        type: "Feature",
        properties: {
          title: "Punto en coordenada",
          description:
            "<h3>Placa XX-YYYY</h3><p> Fecha y hora irá aquí</p>",
        },
        geometry: {
          type: "Point",
          coordinates: parDeCoordenadas, //[xxx, yyy]
        },
      },
    ];
    geojsonTypePoint.push(geojsonBloque);
  });

  return geojsonTypePoint.flat();
  //formato [[x,y], [x,y]....]
}
