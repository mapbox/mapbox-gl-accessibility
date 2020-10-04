Mapbox GL Accessibility Plugin
---

[![Build Status](https://travis-ci.com/mapbox/mapbox-gl-accessibility.svg?branch=publisher-production)](https://travis-ci.com/mapbox/mapbox-gl-accessibility)

An accessibility control for [mapbox-gl-js](https://github.com/mapbox/mapbox-gl-js).

__Note:__ This is a work in progress and we welcome contributions. See [issues](https://github.com/mapbox/mapbox-gl-accessibility/issues) to learn what needs to be worked on!

### Demo

<a href="https://vimeo.com/375772633/22ce0b9ed1" target="_blank"><img src="https://user-images.githubusercontent.com/6026447/69743104-b8655480-10f2-11ea-8621-f59e8e4f41ef.png" width=300></a>

1. Go to https://labs.mapbox.com/mapbox-gl-accessibility
2. Enable voice-over in your browser
3. Press tab to hear the result

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
      'poi-label',
      'transit-label'
    ]
  }));
});
```

`MapboxAccessibility` will locate features that belong to layers cooresponding to the `layers` option array and add button elements to the map. To hide these visually but still allow them to be picked up by a screen reader, add the following CSS to your page:

```css
.mapboxgl-accessibility-marker {
  background: transparent;
  margin: 0;
  padding: 0;
  appearance: none;
  border-radius: 0;
  border: none;
  position: fixed;
}

.mapboxgl-accessibility-marker:focus {
  border: 2px solid black;
}
```

### Developing

    npm install & npm start

Visit http://localhost:5000/examples/ to load the demo. You also need to store an access token in localstorage. Open developer tools, locate the console tab and insert:

    localStorage.setItem('accessToken', {your token});

### Tests


    MAPBOX_ACCESS_TOKEN={your token} npm run test
