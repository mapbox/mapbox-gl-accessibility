Mapbox GL Accessibility Plugin
---

An accessibility control for [mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js).

__Note:__ This is experimental and welcomes contributions. See [issues](https://github.com/mapbox/mapbox-gl-accessibility/issues) to learn what needs to be worked on!

### Demo

https://labs.mapbox.com/mapbox-gl-accessibility Enable voice-over and try pressing tab to see the result.

### Usage

```js
// Should be run after the map has been initialized

map.on('load', () => {
  map.addControl(new MapboxAccessibility({

    // A string value representing a property key in the data. This 
    // will be used as the text in voiceover.
    accessibleLabelProperty: 'name',

    // The layers within the style that
    // 1. Contain the `accessibleLabelProperty` value as a key
    // 2. Should be used for voiceover.
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
```

### Developing

    npm install & npm start

Visit http://localhost:9966/example/ to load the demo
