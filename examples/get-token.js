'use strict';

mapboxgl.accessToken = getAccessToken();

function getAccessToken() {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    window.alert(`Requires an accessToken in localStorage. Add with localStorage.setItem('accessToken', {YOUR TOKEN})`);
    return;
  }

  return accessToken;
}
