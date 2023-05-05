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





mapboxgl.accessToken =
  "pk.eyJ1Ijoib3NjYXJpc21hZWwiLCJhIjoiY2xmbGYycDB2MDE5aTNybzRsNGMwZmM0cCJ9.QdwZE-SVTNUx6AfnHFEWog";

const App = () => {
  // Esta pequeña funcion permite navegar a la pagina anterior( el boton REGRESAR)
  

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-77.02344417415036);
  const [lat, setLat] = useState(-12.054010087308075);
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
          geometry: {
            type: "LineString",
            coordinates: coord[0].coordinates, //
          },
        },
      ],
    };
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

    /******************* printLayers() *******************/
    function printLayers() {
      if (map.current.getSource("mapa-rutas")) {
        //console.log(map.current.isSourceLoaded('mapa-rutas'))
        map.current.removeSource("mapa-rutas");
      }
      map.current.addSource("mapa-rutas", {
        type: "geojson",
        data: geojson,
      });

      map.current.addLayer({
        id: "mapa-rutas-linea",
        type: "line",
        source: "mapa-rutas",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#4e8ff8",
          "line-width": 6,
        },
      });

      map.current.addLayer({
        id: "mapa-rutas-puntos",
        type: "circle",
        source: "mapa-rutas",
        paint: {
          "circle-radius": 4,
          "circle-color": "#B42222",
        },
      });
    }

    /******************* removeLayers() *******************/
    function removeLayers() {
      map.current.removeLayer("mapa-rutas-linea");
      map.current.removeLayer("mapa-rutas-puntos");
    }
    if (!map.current.getLayer("mapa-rutas-linea")) {
      console.log("no hay lineas en el mapa ");

      printLayers();
    } else {
      console.log(
        "Si hay lineas en el mapa . Por lo tanto borrarlas e imprimir las nuevas"
      );
      removeLayers();
      printLayers();
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
      <Flex
        direction="row"
        justifyContent="space-between"
        alignContent="center"
      >
        <Button gap="0.2rem"  variation="primary">
          <FaArrowLeft />
          Regresar
        </Button>

        <Heading level={4}>Flota Vehiculos</Heading>
        <Button gap="0.2rem"  variation="primary">
          <FaSignOutAlt />
          Salir
        </Button>
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
              {/** Accessibility tip: pass empty ariaLabel for decorative icons. */}
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
      </Flex>

      <div ref={mapContainer} className="map-container" />
    </div>
  ); //end of return HTML
}; // end of Flota component

export default App;
