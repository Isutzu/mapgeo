
export function printLayers(mapaObject, sourceName, datageojson) {
  if (mapaObject.getSource(sourceName)) {
    //console.log(mapaObject.isSourceLoaded('mapa-rutas'))
    mapaObject.removeSource(sourceName);
  }
  mapaObject.addSource(sourceName, {
    type: "geojson",
    data: datageojson,
  });

  mapaObject.addLayer({
    id: "mapa-rutas-linea",
    type: "line",
    source: sourceName,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": "#4e8ff8",
      "line-width": 6,
    },
  });

  mapaObject.addLayer({
    id: "mapa-rutas-puntos",
    type: "circle",
    source: sourceName,
    paint: {
      "circle-radius": 4,
      "circle-color": "#B42222",
    },
  });
}

/******************* removeLayers() *******************/
export function removeLayers(mapaObject) {
  mapaObject.removeLayer("mapa-rutas-linea");
  mapaObject.removeLayer("mapa-rutas-puntos");
}