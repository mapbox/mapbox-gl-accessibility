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
  center: [-93.87, 41.65],
  zoom: 3
});

map.on('load', () => {
  map.addSource('data', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-77.03238901390978, 38.913188059745586]
        },
        'properties': {
          'title': 'Mapbox DC',
          'icon': 'monument'
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [-122.414, 37.776]
        },
        'properties': {
          'title': 'Mapbox SF',
          'icon': 'harbor'
        }
      }, {
        'type': 'Feature',
        'id': 0,
        'properties': {
          'title': 'Maine',
        },
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[[-67.13734351262877, 45.137451890638886],
            [-66.96466, 44.8097],
            [-68.03252, 44.3252],
            [-69.06, 43.98],
            [-70.11617, 43.68405],
            [-70.64573401557249, 43.090083319667144],
            [-70.75102474636725, 43.08003225358635],
            [-70.79761105007827, 43.21973948828747],
            [-70.98176001655037, 43.36789581966826],
            [-70.94416541205806, 43.46633942318431],
            [-71.08482, 45.3052400000002],
            [-70.6600225491012, 45.46022288673396],
            [-70.30495378282376, 45.914794623389355],
            [-70.00014034695016, 46.69317088478567],
            [-69.23708614772835, 47.44777598732787],
            [-68.90478084987546, 47.184794623394396],
            [-68.23430497910454, 47.35462921812177],
            [-67.79035274928509, 47.066248887716995],
            [-67.79141211614706, 45.702585354182816],
            [-67.13734351262877, 45.137451890638886]]]
        }
      }]
    }
  });
  map.addLayer({
    'id': 'points',
    'type': 'symbol',
    'source': 'data',
    'layout': {
      'icon-image': '{icon}-15',
      'text-field': '{title}',
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 0.6],
      'text-anchor': 'top'
    },
    'filter': ['==', '$type', 'Point']
  });
  map.addLayer({
    'id': 'polygons',
    'type': 'fill',
    'source': 'data',
    'layout': {},
    'paint': {
      'fill-color': '#088',
      'fill-opacity': 0.8
    },
    'filter': ['==', '$type', 'Polygon']
  });

  map.addControl(new MapboxAccessibility({
    accessibleLabelProperty: 'title',
    layers: [
      'points',
      'polygons'
    ]
  }));
});
