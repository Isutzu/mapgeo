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

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const lng = -77.0972645520254;
  const lat = -11.997531152961642;
  const zoom = 14;

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.addSource("source-mapa-rutas", { type: "geojson" });

    map.current.addLayer({
      id: "layer-mapa-lineas",
      type: "line",
      source: "source-mapa-rutas",
    });

    map.current.addLayer({
      id: "layer-mapa-circles",
      type: "circle",
      source: "source-mapa-rutas",
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
    console.log(coord[0].coordinates); // En mi caso el json esta dentro de un arreglo de un elemento. Por eso que accedo el elemento 0 y extraigo coordenadas.
    map.current.flyTo({
      center: coord[0].coordinates[0],//primera coordenada
      speed: 0.5,
    });
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            color: "#4e8ff8",
          },
          geometry: {
            type: "LineString",
            coordinates: coord[0].coordinates,
          },
        },
      ],
    };
  }

  /******************** mostrarRuta()******************/
  async function mostrarRuta(placa, fecha) {
    //console.log(map.current.isSourceLoaded('mapa-rutas'))
    // alert(`Placa : ${placa} \n  Fecha: ${fecha}`);

    const geojson = await getGeoJsonData(placa, fecha);
    map.current.getSource('source-mapa-rutas').setData(geojson)
  }
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
}
