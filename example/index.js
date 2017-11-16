import mapboxgl from 'mapbox-gl'
import MapboxAccessibility from '../'

mapboxgl.accessToken = 'pk.eyJ1IjoidHJpc3RlbiIsImEiOiJjajZoOXU4Z2kwNnppMnlxd2d6bTFvZ2xtIn0.PP7AoUakMfeqdXFHdsY0oA';

const div = document.body.appendChild(document.createElement('div'));
div.style.position = 'absolute';
div.style.top = 0;
div.style.right = 0;
div.style.left = 0;
div.style.bottom = 0;

const map = new mapboxgl.Map({
  container: div,
  style: 'mapbox://styles/mapbox/streets-v9',
  center: [-79.387, 43.656],
  zoom: 13.5
});

map.on('load', () => {
  map.addControl(new MapboxAccessibility({
    accessibleLabelProperty: 'name',
    layers: [
      'poi-scalerank4-l15',
      'poi-scalerank4-l1',
      'poi-scalerank3',
      'poi-scalerank2',
      'poi-scalerank1',
      'poi-parks_scalerank4',
      'rail-label'
    ]
  }));
});
