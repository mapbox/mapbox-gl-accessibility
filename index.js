'use strict';

import xtend from 'xtend';
import bbox from '@turf/bbox';
import distance from '@turf/distance';
import debounce from 'lodash/debounce';

export default class MapboxAccessibility {
  constructor(options) {
    const defaultOptions = {
      width: 24,
      height: 24
    };

    if (!options && !options.layers) {
      throw new Error('An array of layers is required');
    }

    if (!options && !options.accessibleLabelProperty) {
      throw new Error('a valid accessibleLabelProperty is required');
    }

    this.options = xtend(defaultOptions, options);
  }

  clearMarkers = () => {
    if (this.features) {
      this.features.forEach(feature => {
        if (feature.marker) {
          this.map.getCanvasContainer().removeChild(feature.marker);
          delete feature.marker;
        }
      });
    }
  };

  queryFeatures = () => {
    this._debouncedQueryFeatures.cancel();
    this.clearMarkers();

    this.features = this.map.queryRenderedFeatures({ layers: this.options.layers });
    this.features.map((feature) => {
      let { width, height } = this.options;
      const label = feature.properties[this.options.accessibleLabelProperty];

      if (this.geolocatePosition) {
        feature.distance = distance(feature, [
          this.geolocatePosition.lng,
          this.geolocatePosition.lat,
        ])
      }

      feature.marker = document.createElement('button');
      feature.marker.setAttribute('aria-label', label);
      feature.marker.setAttribute('title', label);
      feature.marker.setAttribute('tabindex', 0);
      feature.marker.style.display = 'block';

      let position;
      if (feature.geometry.type === 'Point') {
        position = this.map.project(feature.geometry.coordinates);
      } else {
        const featureBbox = bbox(feature);
        const bl = this.map.project([featureBbox[0], featureBbox[1]]);
        const tr = this.map.project([featureBbox[2], featureBbox[3]]);

        width = Math.abs(tr.x - bl.x);
        height = Math.abs(tr.y - bl.y);

        position = {
          x: ((tr.x + bl.x) / 2),
          y: ((tr.y + bl.y) / 2),
        };
      }
      feature.marker.style.width = `${width}px`;
      feature.marker.style.height = `${height}px`;
      feature.marker.style.transform = `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`;
      feature.marker.className = 'mapboxgl-accessibility-marker';
      return feature;
    });

    if (this.geolocatePosition) {
      this.features = this.features.sort((a, b) => {
        return (a.distance - b.distance);
      });
    }

    this.features.forEach((feature) => {
      this.map.getCanvasContainer().appendChild(feature.marker);
    })
  };

  _movestart = () => {
    this._debouncedQueryFeatures.cancel();
    this.clearMarkers();
  };

  _render = () => {
    if (!this.map.isMoving()) {
      this._debouncedQueryFeatures();
    }
  };

  _geolocate = (event) => {
    // A hack because we can't query the geolocate control directly.
    if (event.geolocateSource) {
      this.geolocatePosition = this.map.getCenter();
    }
  }

  onAdd(map) {
    this.map = map;

    this._debouncedQueryFeatures = debounce(this.queryFeatures, 100);

    this.map.on('movestart', this._movestart);
    this.map.on('moveend', this._render);
    this.map.on('render', this._render);
    this.map.on('movestart', this._geolocate);

    this.container = document.createElement('div');
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map.off('movestart', this._movestart);
    this.map.off('moveend', this._render);
    this.map.off('render', this._render);
    this._debouncedQueryFeatures.cancel();
    delete this.map;
  }
}
