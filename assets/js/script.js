let goButton = document.querySelector("goButton");

var map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);


// //getApi function for the weather data

// function getApi(requestUrl) {
//     fetch(requestUrl)
//     .then(function (response) {
//     if (response.ok) {
//       response.json().then(function (data) {
//         console.log(data);
//         displayWeather(data);
//         return data;
//       } 
//   )
//   }
//   })
//   }


  var requestOptions = {
    method: 'GET',
  };

  function getData() {

    getDrive(startLat, startLong, endLat, endLong);
    getBike(startLat, startLong, endLat, endLong);
    getWalk(startLat, startLong, endLat, endLong);
    getTransit(startLat, startLong, endLat, endLong);

    L.geoJSON(routeResult, {
      style: (feature) => {
        return {
          color: "rgba(20, 137, 255, 0.7)",
          weight: 5
        };
      }
    }).bindPopup((layer) => {
      return `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`
    }).addTo(map);
  }

  function getDrive(startLat, startLong, endLat, endLong) {
  
  fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=drive&apiKey=56f79fc3785a4fc9804d2fe059b6b486`, requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

  }

  function getBike(startLat, startLong, endLat, endLong) {
  
    fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=bicycle&apiKey=56f79fc3785a4fc9804d2fe059b6b486`, requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  
    }

    function getWalk(startLat, startLong, endLat, endLong) {
  
      fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=walk&apiKey=56f79fc3785a4fc9804d2fe059b6b486`, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    
      }



      function getTransit(startLat, startLong, endLat, endLong) {
  
        fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=transit&apiKey=56f79fc3785a4fc9804d2fe059b6b486`, requestOptions)
          .then(response => response.json())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      
        }


  /* Options for results.

  "Not likely."
  "I don't think so."
  "Worth a shot."
  "There are better options."
"There are worse options."
  "You could definitely consider this."*/