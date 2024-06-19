import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getFillColor, getFillColorLandCover } from './utils.js';

const modalElement = document.getElementById('modal');
const modalContentElement = document.getElementById('modal__content');

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  center: [54.494419,24.443868],
  zoom: 11.2,
  bearing: 0,
  pitch: 30
});

const deckOverlay = new DeckOverlay({
  layers: [
    new GeoJsonLayer({
        id: 'base_land_cover',
        data: 'http://localhost:3000/base_land_cover',
        filled: true,
        getFillColor: getFillColorLandCover,
        getLineWidth: 0,
        pickable: true,
        autoHighlight: true,
        onHover: ({object}) => {
            if (!object) return 
            modalContentElement.innerHTML = `
                <h3>Land cover by ESA</h3>
                <ul>
                    <li><b>ID</b>: ${object.properties.id}</li>
                    <li><b>Type</b>: ${object.properties.subtype}</li>
                </ul>                
            `
        },
    }),
    new GeoJsonLayer({
        id: 'places',
        data: 'http://localhost:3000/places',
        // Styles
        filled: true,
        pointRadiusMinPixels: 2,
        pointRadiusScale: 30,
        getPointRadius: f => f.properties.confidence*10,
        // getFillColor: [200, 0, 80, 180],
        getFillColor,
        getLineWidth: 0,
        // Interactive props
        pickable: true,
        autoHighlight: true,
        onHover: ({object}) => {
            if (!object) return 
            modalContentElement.innerHTML = `
                <h3>Place info</h3>
                <ul>
                    <li><b>ID</b>: ${object.properties.id}</li>
                    <li><b>Name</b>: ${object.properties.primary_names}</li>
                    <li><b>Category</b>: ${object.properties.primary_category}</li>
                    <li><b>Source</b>: ${object.properties.primary_source}</li>
                    <li><b>Confidence</b>: ${object.properties.confidence}</li>
                    <li><b>Website</b>: ${object.properties.websites || '-'}</li>
                    <li><b>Phone</b>: ${object.properties.phones || '-'}</li>
                    <li><b>Address</b>: ${object.properties.address || '-'}</li>
                    <li><b>Postcode</b>: ${object.properties.postcode || '-'}</li>
                    <li><b>Country</b>: ${object.properties.country || '-'}</li>
                </ul>                
            `
        },
    }),
    new GeoJsonLayer({
        id: 'bbox',       
        data: {
            "type": "Polygon",
            "coordinates": [
              [                
                [54.296494, 24.554306], // Haut gauche
                [54.692001, 24.554306], // Haut droite
                [54.692001, 24.333959], // Bas droite
                [54.296494, 24.333959], // Bas gauche
                [54.296494, 24.554306]  // Retour au point de départ
              ]
            ]
          }
        ,
        filled: false,
        getLineWidth: 20,
        getLineColor: [0, 0, 0, 200],
    }),

    // [54.296494, 24.554306], [54.692001, 24.554306], [54.692001, 24.333959], [54.296494, 24.333959],[54.296494, 24.554306]
    // new GeoJsonLayer({
    //   id: 'airports',
    //   data: AIR_PORTS,
    //   // Styles
    //   filled: true,
    //   pointRadiusMinPixels: 2,
    //   pointRadiusScale: 2000,
    //   getPointRadius: f => 11 - f.properties.scalerank,
    //   getFillColor: [200, 0, 80, 180],
    //   // Interactive props
    //   pickable: true,
    //   autoHighlight: true,
    //   onClick: info =>
    //     // eslint-disable-next-line
    //     info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
    //   // beforeId: 'watername_ocean' // In interleaved mode, render the layer under map labels
    // }),
    // new ArcLayer({
    //   id: 'arcs',
    //   data: AIR_PORTS,
    //   dataTransform: d => d.features.filter(f => f.properties.scalerank < 4),
    //   // Styles
    //   getSourcePosition: f => [-0.4531566, 51.4709959], // London
    //   getTargetPosition: f => f.geometry.coordinates,
    //   getSourceColor: [0, 128, 200],
    //   getTargetColor: [200, 0, 80],
    //   getWidth: 1
    // })
  ]});

map.addControl(deckOverlay);
map.addControl(new maplibregl.NavigationControl());