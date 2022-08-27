let goButton = document.getElementById("goButton");
let bikeButton = document.getElementById("bike");
let walkButton = document.getElementById("walk");
let driveButton = document.getElementById("drive");
let transitButton = document.getElementById("transit");

//set up walk components to update

let walkTime = document.getElementById("walktime");
let walkCals = document.getElementById("walkcals");
let walkGas = document.getElementById("walkgas");

//set up bike components to update

let bikeTime = document.getElementById("biketime");
let bikeGas = document.getElementById("bikegas");
let bikeCals = document.getElementById("bikecals");

let driveTime = document.getElementById("drivetime");
let driveGas = document.getElementById("drivegas");
let driveFuel = document.getElementById("drivefuel");
let driveCost = document.getElementById("drivecost");

let transitTime = document.getElementById("transittime");
let transitGas = document.getElementById("transitgas");
let transitCost = document.getElementById("transitcost");

let startLat, startLong, endLat, endLong, usa

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

  var requestOptions2 = {
    method: 'POST',
    mode: 'no-cors'
    // headers: {
    //   'Content-Type': 'application/json'}
  };


  goButton.addEventListener("click", getData)



  async function getData() {

    console.log (`${startLat}, ${startLong}, to ${endLat}, ${endLong}`)

//     if (startLat || startLong || endLat || endLong == undefined) {
// console.log("you need to enter locations!")
//     } else {
      console.log("here");


    let driveData = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat}%2C${startLong}%7C${endLat}%2C${endLong}&mode=drive&apiKey=${apiKey}`, requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(result);
      return result})
    .catch(error => console.log('error', error));


      let bikeData = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=bicycle&apiKey=${apiKey}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        return result})
      .catch(error => console.log('error', error));


      let walkData = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=walk&apiKey=${apiKey}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result);
        return result})
        .catch(error => console.log('error', error));


      let transitData = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=transit&apiKey=${apiKey}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          return result})
        .catch(error => console.log('error', error));

        let gasPrice = await fetch(`https://www.gasbuddy.com/gaspricemap/county?lat=${startLat}&lng=${startLong}&usa=${usa}`, requestOptions2)
        .then(response => response.json())
        .then(result => {
          console.log(result);
          return result})
        .catch(error => console.log('error', error));

     await L.geoJSON(driveData, {
      style: (feature) => {
        return {
          color: "rgba(20, 137, 255, 0.7)",
          weight: 5
        };
      }
    }).bindPopup((layer) => {
      return `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`
    }).addTo(map);

    map.fitBounds([[startLat, startLong],[endLat, endLong]])

    L.marker([startLat, startLong]).addTo(map);
    L.marker([endLat, endLong]).addTo(map);

    //set the info in the cards

    //set the walk info

    walkTime.textContent = Math.round((walkData.features[0].properties.time/60)*100+Number.EPSILON)/100 + " mins"

    //walking calories = CB = [0.0215 x KPH3 - 0.1765 x KPH2 + 0.8710 x KPH + 1.4577] x WKG x T
    //http://www.shapesense.com/fitness-exercise/calculators/walking-calorie-burn-calculator.shtml
    //Calories burned per minute = (MET x body weight in Kg x 3.5) ÷ 200 https://captaincalculator.com/health/calorie/calories-burned-walking-calculator/

    //mean dietary GHG emissions for 2000 calorie diet, medium meat eaters = 5.63 kgCO2e https://www.researchgate.net/figure/Mean-greenhouse-gas-emissions-per-2-000-kcal-by-diet-type-and-sex_tbl3_263353807

    //ghgs for food : https://ourworldindata.org/grapher/ghg-kcal-poore

    walkCals.textContent = Math.round(((walkData.features[0].properties.time/60)*((3.5*79.4*3.5)/200))*100+Number.EPSILON)/100 + " kcals"
    walkGas.textContent = Math.round(((walkData.features[0].properties.time/60)*((3.5*79.4*3.5)/200)/2000*5.63)*100+Number.EPSILON)/100 + " kg CO2e"


    //set the bike info

    bikeTime.textContent = Math.round((bikeData.features[0].properties.time/60)*100+Number.EPSILON)/100 + " mins"
    //a 175 lb person biking 1 mile would burn 56 calirues @ 12mph https://caloriesburnedhq.com/calories-burned-biking/#:~:text=The%20average%20person%20will%20burn,speed%20and%20time%20spent%20biking.
    //a 185 lb person biking for a half hour would burn 355 calories https://www.healthline.com/health/how-many-calories-do-you-burn-biking#outdoor-biking
    //Calories burned per minute = (MET x body weight in Kg x 3.5) ÷ 200 https://captaincalculator.com/health/calorie/calories-burned-cycling-calculator/
    bikeCals.textContent = Math.round(((bikeData.features[0].properties.time/60)*((7.5*79.4*3.5)/200))*100+Number.EPSILON)/100 + " kcals" //175 lb person

    bikeGas.textContent = Math.round(((bikeData.features[0].properties.time/60)*((7.5*79.4*3.5)/200)/2000*5.63)*100+Number.EPSILON)/100 + " kg CO2e"

//set the drive info
//drive gas = Every gallon of gasoline burned creates about 8,887 grams of CO2. source https://www.epa.gov/greenvehicles/greenhouse-gas-emissions-typical-passenger-vehicle#:~:text=typical%20passenger%20vehicle%3F-,A%20typical%20passenger%20vehicle%20emits%20about%204.6%20metric%20tons%20of,8%2C887%20grams%20of%20CO2.
//For every litre of gasoline your vehicle uses, it generates about 2.3 kilograms of CO2 source https://www.nrcan.gc.ca/energy-efficiency/transportation-alternative-fuels/fuel-consumption-guide/21002
// In 2017, Canada's average vehicle ranked last in fuel efficiency, consuming an average of 8.9 litres of gasoline per 100 kilometres (L/100km). https://www.cer-rec.gc.ca/en/data-analysis/energy-markets/market-snapshots/2019/market-snapshot-how-does-canada-rank-in-terms-vehicle-fuel-economy.html

let fuelConsumed = driveData.features[0].properties.distance/100000*8.9
driveFuel.textContent = Math.round(fuelConsumed*100 + Number.EPSILON)/100 + " L"
let driveghgs = fuelConsumed*2.3
driveGas.textContent = Math.round(driveghgs*100+Number.EPSILON)/100 + " kg CO2e"
driveTime.textContent = Math.round((driveData.features[0].properties.time/60)*100+Number.EPSILON)/100 + " mins"

//set the transit info

transitTime.textContent = Math.round((transitData.features[0].properties.time/60)*100+Number.EPSILON)/100 + " mins"
let transitghgs = transitData.features[0].properties.distance/1000/1.6*(0.64/2.20462)

transitGas.textContent = Math.round((transitghgs)*100+Number.EPSILON)/100  + " kg CO2e"

  // };
  }

//   async function getDrive(startLat, startLong, endLat, endLong) {
//     console.log (`${startLat}, ${startLong}, to ${endLat}, ${endLong}`)
  
    
// return driveData;
//   }

//   async function getBike(startLat, startLong, endLat, endLong) {
  
//     let bikeData = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=bicycle&apiKey=${apiKey}`, requestOptions)
//       .then(response => response.json())
//       .then(result => console.log(result))
//       .catch(error => console.log('error', error));
//     return bikeData;
//     }

//     async function getWalk(startLat, startLong, endLat, endLong) {
  
//       let walkData = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=walk&apiKey=${apiKey}`, requestOptions)
//       .then(response => response.json())
//       .then(result => console.log(result))
//         .catch(error => console.log('error', error));
//       return walkData;
//       }

//       async function getTransit(startLat, startLong, endLat, endLong) {
  
//         let transitData = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLong}|${endLat},${endLong}&mode=transit&apiKey=${apiKey}`, requestOptions)
//           .then(response => response.json())
//           .then(result => {return result})
//           .catch(error => console.log('error', error));
//       return transitData;
//         }



       /* 
    The addressAutocomplete takes as parameters:
  - a container element (div)
  - callback to notify about address selection
  - geocoder options:
       - placeholder - placeholder text for an input element
     - type - location type
*/
function addressAutocomplete(containerElement, callback, options) {
  // create input element
  var inputElement = document.createElement("input");
  inputElement.setAttribute("type", "text");
  inputElement.setAttribute("placeholder", options.placeholder);
  containerElement.appendChild(inputElement);

  /* Active request promise reject function. To be able to cancel the promise when a new request comes */
  var currentPromiseReject;

    /* Current autocomplete items data (GeoJSON.Feature) */
    var currentItems;

      // add input field clear button
  var clearButton = document.createElement("div");
  clearButton.classList.add("clear-button");
  addIcon(clearButton);
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    inputElement.value = '';
    callback(null);
    clearButton.classList.remove("visible");
    closeDropDownList();
  });
  inputElement.parentNode.appendChild(clearButton);

  /* Execute a function when someone writes in the text field: */
  inputElement.addEventListener("input", function(e) {
        /* Close any already open dropdown list */
        closeDropDownList();
    var currentValue = this.value;

    // Cancel previous request promise
    if (currentPromiseReject) {
      currentPromiseReject({
        canceled: true
      });
    }

    if (!currentValue) {
      clearButton.classList.remove("visible");
      return false;
    }

    // Show clearButton when there is a text
    clearButton.classList.add("visible");
    /* Create a new promise and send geocoding request */
    var promise = new Promise((resolve, reject) => {
      currentPromiseReject = reject;


      var url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(currentValue)}&limit=5&apiKey=${apiKey}`;
      
      if (options.type) {
          url += `&type=${options.type}`;
      }
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
          currentItems = data.features;

          
      /*create a DIV element that will contain the items (values):*/
      var autocompleteItemsElement = document.createElement("div");
      autocompleteItemsElement.setAttribute("class", "autocomplete-items");
      containerElement.appendChild(autocompleteItemsElement);

      /* For each item in the results */
      data.features.forEach((feature, index) => {
        /* Create a DIV element for each element: */
        var itemElement = document.createElement("DIV");
        /* Set formatted address as item value */
        itemElement.innerHTML = feature.properties.formatted;
                /* Set the value for the autocomplete text field and notify: */
                itemElement.addEventListener("click", function(e) {
                  inputElement.value = currentItems[index].properties.formatted;
                  callback(currentItems[index]);
                  /* Close the list of autocompleted values: */
                  closeDropDownList();
                });
        
        autocompleteItemsElement.appendChild(itemElement);
              });
      }, (err) => {
        if (!err.canceled) {
          console.log(err);
        }
      });
    });

      inputElement.addEventListener("keydown", function(e) {
        var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
        if (autocompleteItemsElement) {
          var itemElements = autocompleteItemsElement.getElementsByTagName("div");
          if (e.keyCode == 40) {
            e.preventDefault();
            /*If the arrow DOWN key is pressed, increase the focusedItemIndex variable:*/
            focusedItemIndex = focusedItemIndex !== itemElements.length - 1 ? focusedItemIndex + 1 : 0;
            /*and and make the current item more visible:*/
            setActive(itemElements, focusedItemIndex);
          } else if (e.keyCode == 38) {
            e.preventDefault();
    
            /*If the arrow UP key is pressed, decrease the focusedItemIndex variable:*/
            focusedItemIndex = focusedItemIndex !== 0 ? focusedItemIndex - 1 : focusedItemIndex = (itemElements.length - 1);
            /*and and make the current item more visible:*/
            setActive(itemElements, focusedItemIndex);
          } else if (e.keyCode == 13) {
            /* If the ENTER key is pressed and value as selected, close the list*/
            e.preventDefault();
            if (focusedItemIndex > -1) {
              closeDropDownList();
            }
          }
        } else {
          if (e.keyCode == 40) {
            /* Open dropdown list again */
            var event = document.createEvent('Event');
            event.initEvent('input', true, true);
            inputElement.dispatchEvent(event);
          }
        }
      });

      function setActive(items, index) {
        if (!items || !items.length) return false;
    
        for (var i = 0; i < items.length; i++) {
          items[i].classList.remove("autocomplete-active");
        }
    
        /* Add class "autocomplete-active" to the active element*/
        items[index].classList.add("autocomplete-active");
    
        // Change input value and notify
        inputElement.value = currentItems[index].properties.formatted;
        callback(currentItems[index]);
      }

      function closeDropDownList() {
        var autocompleteItemsElement = containerElement.querySelector(".autocomplete-items");
        if (autocompleteItemsElement) {
          containerElement.removeChild(autocompleteItemsElement);
        }
        focusedItemIndex = -1;
      }

      function addIcon(buttonElement) {
        var svgElement = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        svgElement.setAttribute('viewBox', "0 0 24 24");
        svgElement.setAttribute('height', "24");
    
        var iconElement = document.createElementNS("http://www.w3.org/2000/svg", 'path');
        iconElement.setAttribute("d", "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
        iconElement.setAttribute('fill', 'currentColor');
        svgElement.appendChild(iconElement);
        buttonElement.appendChild(svgElement);
      }

      document.addEventListener("click", function(e) {
        if (e.target !== inputElement) {
          closeDropDownList();
        } else if (!containerElement.querySelector(".autocomplete-items")) {
          // open dropdown list again
          var event = document.createEvent('Event');
          event.initEvent('input', true, true);
          inputElement.dispatchEvent(event);
        }
      });
}
        
addressAutocomplete(document.getElementById("autocomplete-container1"), (data) => {
  console.log("Selected option: ");
  console.log(data);
  startLat = data.geometry.coordinates[1];
  startLong = data.geometry.coordinates[0];
  if (data.properties.country != "United States") {
    usa = "false";
  } else {
    usa = "true"
  }

}, {
    placeholder: "Enter an address here"
});

addressAutocomplete(document.getElementById("autocomplete-container2"), (data) => {
  console.log("Selected option: ");
  console.log(data);
  endLat = data.geometry.coordinates[1];
  endLong = data.geometry.coordinates[0];
}, {
    placeholder: "Enter an address here"
});

walkButton.addEventListener("click", grayOutWalk)
bikeButton.addEventListener("click", grayOutBike)
transitButton.addEventListener("click", grayOutTransit)
driveButton.addEventListener("click", grayOutDrive)

function grayOutWalk() {
    var element = document.getElementById("walkCard");
    element.classList.add("overlay");
}

function grayOutBike() {
  var element = document.getElementById("bikeCard");
  element.classList.add("overlay");
}

function grayOutTransit() {
  var element = document.getElementById("transitCard");
  element.classList.add("overlay");
}

function grayOutDrive() {
  var element = document.getElementById("driveCard");
  element.classList.add("overlay");
}

  /* Options for results.

  "Not likely."
  "I don't think so."
  "Worth a shot."
  "There are better options."
"There are worse options."
  "You could definitely consider this."*/