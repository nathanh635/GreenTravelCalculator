let goButton = document.querySelector("goButton");

const apiKey = "56f79fc3785a4fc9804d2fe059b6b486";

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
  
  fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=drive&apiKey=${apiKey}`, requestOptions)
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));

  }

  function getBike(startLat, startLong, endLat, endLong) {
  
    fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=bicycle&apiKey=${apiKey}`, requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  
    }

    function getWalk(startLat, startLong, endLat, endLong) {
  
      fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=walk&apiKey=${apiKey}`, requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    
      }



      function getTransit(startLat, startLong, endLat, endLong) {
  
        fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=transit&apiKey=${apiKey}`, requestOptions)
          .then(response => response.json())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
      
        }


/* 
    The addressAutocomplete takes a container element (div) as a parameter
*/
function addressAutocomplete(containerElement) {
  // create input element
  var inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", "Enter an address here");
  containerElement.appendChild(inputElement);

   /* Active request promise reject function. To be able to cancel the promise when a new request comes */
   var currentPromiseReject;

   /* Execute a function when someone writes in the text field: */
   inputElement.addEventListener("input", function(e) {
     var currentValue = this.value;
 
     // Cancel previous request promise
     if (currentPromiseReject) {
       currentPromiseReject({
         canceled: true
       });
     }
 
     if (!currentValue) {
       return false;
     }
 
     /* Create a new promise and send geocoding request */
     var promise = new Promise((resolve, reject) => {
       currentPromiseReject = reject;
 
       var apiKey = "47f523a46b944b47862e39509a7833a9";
       var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&limit=5&apiKey=${apiKey}`;
 
       fetch(url)
         .then(response => {
           // check if the call was successful
           if (response.ok) {
             response.json().then(data => resolve(data));
           } else {
             response.json().then(data => reject(data));
           }
         });
     });
 
     promise.then((data) => {
         // we will process data here
     }, (err) => {
       if (!err.canceled) {
         console.log(err);
       }
     });
   });
}

addressAutocomplete(document.getElementById("autocomplete-container"));
addressAutocomplete(document.getElementById("autocomplete-container2"));


  /* Options for results.

  "Not likely."
  "I don't think so."
  "Worth a shot."
  "There are better options."
"There are worse options."
  "You could definitely consider this."*/