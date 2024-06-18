import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import {GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { getFillColor } from './utils.js';

const modalElement = document.getElementById('modal');
const modalContentElement = document.getElementById('modal__content');

const map = new maplibregl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  center: [54.58, 24.40],
  zoom: 11.5,
  bearing: 0,
  pitch: 30
});

const deckOverlay = new DeckOverlay({
  // interleaved: true,
  layers: [
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