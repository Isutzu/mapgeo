import { MdCalendarMonth } from "react-icons/md";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import markerIcon from "./mapbox-marker-icon-20px-purple.png";
import "@aws-amplify/ui-react/styles.css";
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import { generateColor, getGeojsonTypePoint } from "./utils.js";
import FormComponent from "./components/FormComponent";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

mapboxgl.accessToken =
  "pk.eyJ1Ijoib3NjYXJpc21hZWwiLCJhIjoiY2xmbGYycDB2MDE5aTNybzRsNGMwZmM0cCJ9.QdwZE-SVTNUx6AfnHFEWog";

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const lng = -77.0972645520254;
  const lat = -11.997531152961642;
  const zoom = 14;

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [[0, 0]],
        },
      },
    ],
  };

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    });

    map.current.on("load", () => {
      map.current.loadImage(
        //'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        markerIcon,
        function (error, image) {
          if (error) throw error;
          map.current.addImage("custom-marker", image);
        }
      );

      map.current.addSource("source-mapa-rutas", {
        type: "geojson",
        data: geojson,
      });

      map.current.addLayer({
        id: "layer-mapa-lineas",
        type: "line",
        source: "source-mapa-rutas",
        paint: {
          "line-width": 4,
          "line-color": ["get", "color"],
        },
      });

      map.current.addLayer({
        id: "layer-mapa-circles",
        type: "circle",
        source: "source-mapa-rutas",
        paint: {
          "circle-color": "#4264fb",
          "circle-radius": 6,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },

        filter: ["==", "$type", "Point"],
      });

      map.current.addLayer({
        id: "layer-mapa-icono",
        type: "symbol",
        source: "source-mapa-rutas",
        layout: {
          "icon-image": "custom-marker",
          //  "icon-size": 1.2,
          // "text-field": ["get", "title"],
          // "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          // "text-offset": [0, 1.25],
          // "text-anchor": "top",
        },
        filter: ["==", "icon", "destino"],
      });

      map.current.on("click", "layer-mapa-circles", (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(description)
          .addTo(map.current);
      });

      map.current.on("mouseenter", "layer-mapa-circles", () => {
        map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "layer-mapa-circles", () => {
        map.current.getCanvas().style.cursor = "";
      });
    });
  }, []);

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
      let grupoDeCoordenadas = data.coordinates;
      let geojsonTypePoint = getGeojsonTypePoint(grupoDeCoordenadas);
      //console.log(coor);
      let randomColor = generateColor();
      const geojsonBloque = [
        {
          type: "Feature",
          properties: {
            color: randomColor,
          },
          geometry: {
            type: "LineString",
            coordinates: grupoDeCoordenadas,
          },
        },

        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: grupoDeCoordenadas[grupoDeCoordenadas.length - 1], // ultima coordenada
          },
          properties: {
            icon: "destino",
          },
        },
      ];

      geojsonRutas.push(geojsonBloque.concat(geojsonTypePoint));
    });

    return {
      type: "FeatureCollection",
      features: geojsonRutas.flat(),
    };
  }
  /******************** mostrarTodasLasRutas()***************/
  async function mostrarTodasLasRutas() {
    const geojsonRutasTotales = await getGeoJsonDataRutasCompletas();
    map.current.getSource("source-mapa-rutas").setData(geojsonRutasTotales);
  }

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
    //console.log(coord);
    let grupoDeCoordenadas = coord[0].coordinates;
    //console.log(coord[0].coordinates); // En mi caso el json esta dentro de un arreglo de un elemento. Por eso que accedo el elemento 0 y extraigo coordenadas.
    let ultimaCoordenada =
      coord[0].coordinates[coord[0].coordinates.length - 1]; // ultima coordenada

    let geojsonUltimaCoordenada = [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: ultimaCoordenada, // ultima coordenada
        },
        properties: {
          icon: "destino",
          "icon-allow-overlap": false,
          title: "Punto en coordenada",
          description:
            "<h3>Numero de placa</h3><p> Este es un punto de coordenada </p>",
        },
      },
    ];

    let geojsonTypeLine = [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coord[0].coordinates,
        },
        properties: {
          color: "#4e8ff8",
        },
      },
    ];

    let geojsonTypePoint = getGeojsonTypePoint(grupoDeCoordenadas);

    let geojsonLinePointsIcon = geojsonTypeLine.concat(
      geojsonTypePoint,
      geojsonUltimaCoordenada
    );

    map.current.flyTo({
      center: ultimaCoordenada, //primera coordenada
      speed: 0.5,
      zoom: 16,
    });
    return {
      type: "FeatureCollection",
      features: geojsonLinePointsIcon.flat(),
    };
  }

  /******************** mostrarRuta()******************/
  async function mostrarRuta(placa, fecha) {
    const geojson = await getGeoJsonData(placa, fecha);
    map.current.getSource("source-mapa-rutas").setData(geojson);
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
      <FormComponent />
      <div ref={mapContainer} className="map-container" />
    </div>
  ); //end of return HTML
}
