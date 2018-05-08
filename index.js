'use strict';

import xtend from 'xtend';
import bbox from '@turf/bbox';

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
    this.features = this.map.queryRenderedFeatures({ layers: this.options.layers });
    this.features.map((feature) => {
      let { width, height } = this.options;
      const label = feature.properties[this.options.accessibleLabelProperty];

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

      this.map.getCanvasContainer().appendChild(feature.marker);
      return feature;
    });
  };

  onAdd(map) {
    this.map = map;
    this.queryFeatures();
    this.map.on('moveend', this.queryFeatures);
    this.map.on('movestart', this.clearMarkers);
    this.container = document.createElement('div');
    return this.container;
  }

  onRemove() {
    this.container.parentNode.removeChild(this.container);
    this.map.off('moveend', this.queryFeatures);
    this.map.off('movestart', this.clearMarkers);
    delete this.map;
  }
}
