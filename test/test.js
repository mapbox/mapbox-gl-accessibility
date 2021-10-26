'use strict';

const test = require('tape');
window.mapboxgl = require('mapbox-gl');
window.MapboxAccessibility = require('../src/index').default;
const polygon = require('./fixtures/polygon');
const polygonWithTabIndex = require('./fixtures/polygon-with-tabindex');

mapboxgl.accessToken = process.env.MAPBOX_ACCESS_TOKEN;

function createMap(opts) {
  const options = Object.assign({
    container: document.createElement('div'),
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-79.387, 43.656],
    zoom: 13.5
  }, opts);

  return new mapboxgl.Map(options);
};

test('MapboxAccessibility: basic', t => {
  const map = createMap();
  document.body.appendChild(map.getCanvasContainer());

  map.on('load', () => {

    t.throws(map.addControl(new MapboxAccessibility({
      accessibleLabelProperty: 'name'
    })), 'Missing layers array throws');

    t.throws(map.addControl(new MapboxAccessibility({
      layers: ['poi-label']
    })), 'Missing accessibleLabelProperty field value throws');

    map.addControl(new MapboxAccessibility({
      accessibleLabelProperty: 'name',
      layers: [
        'poi-label',
        'transit-label'
      ]
    }));

    window.setTimeout(() => {
      const marker = map.getCanvasContainer().querySelector('.mapboxgl-accessibility-marker');
      t.notEquals(marker, null, 'accessible element was found');
      t.equals(marker.getAttribute('tabindex'), '0', 'tabindex is set');
      t.equals(typeof marker.getAttribute('title'), 'string', 'title is set');
      t.equals(typeof marker.getAttribute('aria-label'), 'string', 'aria-label is set');
      t.equals(marker.style.getPropertyValue('width'), '24px', 'Default width is set');
      t.equals(marker.style.getPropertyValue('height'), '24px', 'Default height is set');
      t.end();
    }, 1000);
  });
});

test('MapboxAccessibility: polygon', t => {
  const map = createMap({
    center: [-69.217, 45.171],
    zoom: 6
  });

  document.body.appendChild(map.getCanvasContainer());

  map.on('load', () => {
    map.addSource('data', {
      'type': 'geojson',
      'data': polygon
    });

    map.addLayer({
      id: 'polygon',
      type: 'fill',
      source: 'data'
    });

    map.addControl(new MapboxAccessibility({
      accessibleLabelProperty: 'title',
      layers: [
        'polygon'
      ]
    }));

    window.setTimeout(() => {
      const marker = map.getCanvasContainer().querySelector('.mapboxgl-accessibility-marker');

      t.notEquals(marker, null, 'accessible element was found');

      t.equals(marker.getAttribute('tabindex'), '0', 'tabindex is set');
      t.equals(marker.getAttribute('title'), 'Maine', 'title is set');
      t.equals(marker.getAttribute('aria-label'), 'Maine', 'aria-label is set');
      t.equals(marker.style.getPropertyValue('width'), '375.062px', 'Custom width for bounds');
      t.equals(marker.style.getPropertyValue('height'), '438.625px', 'Custome height for bounds');

      t.end();
    }, 1000);
  });
});

test('MapboxAccessibility: polygon with tabindex', t => {
  const map = createMap({
    center: [-69.217, 45.171],
    zoom: 6
  });

  document.body.appendChild(map.getCanvasContainer());

  map.on('load', () => {
    map.addSource('data', {
      'type': 'geojson',
      'data': polygonWithTabIndex
    });

    map.addLayer({
      id: 'polygon',
      type: 'fill',
      source: 'data'
    });

    map.addControl(new MapboxAccessibility({
      accessibleLabelProperty: 'title',
      layers: [
        'polygon'
      ]
    }));

    window.setTimeout(() => {
      const marker = map.getCanvasContainer().querySelector('.mapboxgl-accessibility-marker');
      t.equals(marker.getAttribute('tabindex'), "2", 'tabindex is set to 2');
      t.end();
    }, 1000);
  });
});

// close the smokestack window once tests are complete
test('shutdown', t => {
  t.end();
  setTimeout(() => {
    window.close();
  });
});
