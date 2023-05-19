  /******************** mostrarRuta()******************/
  async function mostraRutaIndividual(placa, fecha) {
    //console.log(map.current.isSourceLoaded('mapa-rutas'))
    // alert(`Placa : ${placa} \n  Fecha: ${fecha}`);

    // geojson almacena las coordenadas en formato geojson. Esta variable es el valor de la propiedad  "data" de la funcion addSource()
    const geojson = await getGeoJsonData(placa, fecha);

    if (!map.current.getSource("mapa-rutas")) {
      //console.log(map.current.isSourceLoaded('mapa-rutas'))
      map.current.addSource("mapa-rutas", {
        type: "geojson",
        data: geojson,
      });
    }
    if (!map.current.getLayer("mapa-rutas-linea")) {
      console.log("no hay lineas en el mapa ");

      printLayers(map.current, "mapa-rutas", geojson);
    } else {
      console.log(
        "Si hay lineas en el mapa . Por lo tanto borrarlas e imprimir las nuevas"
      );
      removeLayers(map.current);
      printLayers(map.current, "mapa-rutas", geojson);
    }
  } 