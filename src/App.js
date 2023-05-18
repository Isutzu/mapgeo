/*  - Para usar los iconos . Primero hay que instalarlos de la siguiente forma:
    npm install react-icons --save

    - Luego ir a la siguiente pagina: 
      https://react-icons.github.io/react-icons/

      y buscar el icono que deseas

      - el atributo gap="0.3rem" te permite aunmentar la distancia 
      entre el icono y el texto. Mientras mayor sea el valor en rem (0.3rem, 0.7rem, 1.2rem, etc) mayor sera la distancia.

*/

import {
  Flex,
  Button,
  Heading,
  TextField,
  FieldGroupIcon,
} from "@aws-amplify/ui-react";
import { FaArrowLeft } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { FaMapMarkedAlt, FaCar } from "react-icons/fa";
import { MdCalendarMonth } from "react-icons/md";

import "@aws-amplify/ui-react/styles.css";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import {
  getGeojsonFormat,
  generateColor,
  generateRandomColor,
  printLayers,
  removeLayers,
} from "./utils.js";
mapboxgl.accessToken =
  "pk.eyJ1Ijoib3NjYXJpc21hZWwiLCJhIjoiY2xmbGYycDB2MDE5aTNybzRsNGMwZmM0cCJ9.QdwZE-SVTNUx6AfnHFEWog";

const App = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  //const [lng, setLng] = useState(-77.02344417415036);
  const [lng, setLng] = useState(-77.0972645520254);
  //const [lat, setLat] = useState(-12.054010087308075);
  const [lat, setLat] = useState(-11.997531152961642);
  const [zoom, setZoom] = useState(14);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  /*************** getGeoJsonData() ********************/
  async function getGeoJsonData(placa, fecha) {
    // Retorna geojson. Todo lo que esta despues del keyword return es considerado formato geojson

    // Esta es el url de nuestra API que regresa en un array que contiene un objeto JSON con el numero de placa y valor de la coordenadas
    // Es solo para propositos de testeo porque no tengo una base de dynamo . Asi que tuve que crear mi propia data a traves de GET REQUEST
    // https://64533f06c18adbbdfe985034.mockapi.io/api/v1/ruta?placa=AL1234
    // https://64533f06c18adbbdfe985034.mockapi.io/api/v1/ruta?placa=SC456
    // https://64533f06c18adbbdfe985034.mockapi.io/api/v1/ruta
    const url = `https://64533f06c18adbbdfe985034.mockapi.io/api/v1/ruta/?placa=${placa}`;

    const response = await fetch(url, {
      method: "GET",
      headers: { "content-type": "application/json" },
    });
    const coord = await response.json();
    console.log(coord[0].coordinates); // En mi caso mis el json esta dentro de un arreglo de un elemento. Por eso que acceso el elemento 0 y extraigo coordenadas.
    map.current.flyTo({
      center: coord[0].coordinates[0],

      speed: 0.5,
    });
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            color: "#4e8ff8"
            },
          geometry: {
            type: "LineString",
            coordinates: coord[0].coordinates,
          },
        },
      ],
    };
  }

  /*************** getGeoJsonDataRutasCompletas() ********************/
  async function getGeoJsonDataRutasCompletas() {
    // El siguiente end point me retorna 3 rutas distintas .En mi caso retorna un arreglo de 3 elementos
    // Cada elemento contiene un objeto JSON con el numero de placa y coordenadas.
    // https://64533f06c18adbbdfe985034.mockapi.io/api/v1/ruta

    const url = "https://64533f06c18adbbdfe985034.mockapi.io/api/v1/ruta";
    const response = await fetch(url, {
      method: "GET",
      headers: { "content-type": "application/json" },
    });

    const coord = await response.json();
    console.log(coord);
    // console.log("Numero de elementos :" + coord.length )
    map.current.flyTo({
      center: [lng, lat],
      zoom: 11,
      speed: 0.5,
    });
    const geojsonRutas = [];

    coord.forEach(function (data) {
      let coor = data.coordinates;
      //console.log(coord);
      let randomColor = generateColor();
      const geojsonBloque = {
        type: "Feature",
        properties: {
          color: randomColor,
        },
        geometry: {
          type: "LineString",
          coordinates: coor,
        },
      };

      geojsonRutas.push(geojsonBloque);
      //console.log("GEOJSON", JSON.stringify(geo));
    });

    //console.log("Este es el geojson:" + geo)
    return {
      type: "FeatureCollection",
      features: geojsonRutas,
    };
  }

  /******************** mostrarTodasLasRutas()***************/
  async function mostrarTodasLasRutas() {
    // let data = [
    //   [66, -77.02344417415036, -12.054010087308075],
    //   [66, -77.02361583553322, -12.055017344072041],
    //   [66, -77.02372328756853, -12.055583114620019],
    //   [66, -77.02395915829895, -12.056696096941591],
    //   [66, -77.02421892172019, -12.057858242132719],
    //   [66, -77.02453248618347, -12.058253914512916],
    //   [66, -77.02454260116617, -12.058263806314939],
    //   [66, -77.02499777538709, -12.058323157119437],
    //   [77, -77.09764303450447, -11.996755463024328],
    //   [77, -77.09748082772765, -11.997196196217345],
    //   [77, -77.0972645520254, -11.997531152961642],
    //   [77, -77.09695816144702, -11.997337230686753],
    //   [77, -77.09656165599262, -11.99751352367008],
    //   [77, -77.09625526541426, -11.99763692868899],
    //   [77, -77.09589480591048, -11.997795592203147],
    //   [77, -77.09562446128226, -11.997936626358992],
    //   [77, -77.09492156524952, -11.998183435954076],
    //   [77, -77.09423669219206, -11.998994380176967],
    //   [77, -77.09436285301874, -11.998923863384448],
    //   [77, -77.09490354227468, -11.999840580242662],
    //   [77, -77.09567853020773, -12.000228421051503],
    //   [66, -77.02704976368354, -12.058560729981759],
    //   [66, -77.03014801947108, -12.058995014083504],
    //   [66, -77.03213090315836, -12.059197006453083],
    //   [66, -77.0351362113584, -12.059600990722437],
    //   [66, -77.03551832958989, -12.059439397088584],
    // ];

    // let result = {};

    // for (let i = 0; i < data.length; i++) {
    //   let placa = data[i][0].toString();
    //   let coordinates = data[i].slice(1)
    //   if (result.hasOwnProperty(placa)) {
    //      result[placa].coordinates.push(coordinates);
    //   } else {
    //     result[placa] = {
    //             placa: placa,
    //             coordinates: [coordinates]
    //           };
    //   }
    // }
    // let finalResult = Object.values(result);
    //const geojsonRutasTotales = getGeojsonFormat(finalResult);
    const geojsonRutasTotales = await getGeoJsonDataRutasCompletas();

    console.log(geojsonRutasTotales);
    if (!map.current.getSource("mapa-rutas")) {
      //console.log(map.current.isSourceLoaded('mapa-rutas'))
      map.current.addSource("mapa-rutas", {
        type: "geojson",
        data: geojsonRutasTotales,
      });
    }
    if (!map.current.getLayer("mapa-rutas-linea")) {
      console.log("no hay lineas en el mapa ");

      printLayers(map.current, "mapa-rutas", geojsonRutasTotales);
      //printLayers()
    } else {
      console.log(
        "Si hay lineas en el mapa . Por lo tanto borrarlas e imprimir las nuevas"
      );
      removeLayers(map.current);
      printLayers(map.current, "mapa-rutas", geojsonRutasTotales);
    }
  }

  /******************** mostrarRuta()******************/
  async function mostrarRuta(placa, fecha) {
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
  } // final de la funcion  mostrarRuta()

  /***************** handleSubmit()*************/
  //  Obtener valores de placa y fecha y pasarlos a la funcion mostarRuta()

  const handleSubmit = (event) => {
    event.preventDefault();

    const placa = event.target.numero_de_placa.value;
    const fecha = event.target.fecha.value;
    mostrarRuta(placa, fecha);
  };

  return (
    <div>
      <Flex direction="row" justifyContent="center" alignContent="center">
        <Heading level={4}>Flota Vehiculos</Heading>
      </Flex>

      <Flex
        as="form"
        direction="column"
        alignItems="center"
        justifyContent="center"
        onSubmit={handleSubmit}
      >
        <TextField
          isRequired={true}
          placeholder="ex: LU12345"
          label="Numero de placa"
          name="numero_de_placa"
          errorMessage="hay un error"
          innerEndComponent={
            <FieldGroupIcon ariaLabel="">
              <FaCar />
            </FieldGroupIcon>
          }
        />

        <TextField
          isRequired={true}
          placeholder="01/02/20223"
          label="Fecha"
          name="fecha"
          errorMessage="hay un error"
          innerEndComponent={
            <FieldGroupIcon ariaLabel="">
              <MdCalendarMonth />
            </FieldGroupIcon>
          }
        />

        <Button
          type="submit"
          gap="0.3rem"
          variation="primary"
          className="color-submit-button"
          // onClick={mostrarRuta}
        >
          <FaMapMarkedAlt />
          Mostrar ruta
        </Button>
        <Button
          //type="submit"
          gap="0.3rem"
          variation="warning"
          className="color-submit-button"
          onClick={mostrarTodasLasRutas}
        >
          <FaMapMarkedAlt />
          Mostrar Flota
        </Button>
      </Flex>

      <div ref={mapContainer} className="map-container" />
    </div>
  ); //end of return HTML
}; // end of Flota component

export default App;
