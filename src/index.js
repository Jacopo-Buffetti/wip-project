import { DateTime } from "luxon";

const results = [];
let template = '';

// XMLHttpRequest wrapper using callbacks
function request(obj, successHandler, errorHandler) {
  const xhr = new XMLHttpRequest();
  console.log('loading...');
  xhr.open(obj.method || "GET", obj.url);
  if (obj.headers) {
    Object.keys(obj.headers).forEach(function(key) {
      xhr.setRequestHeader(key, obj.headers[key]);
    });
  }
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      successHandler(xhr.response);
    } else {
      errorHandler(xhr.statusText);
    }
    console.log('end loading');
  };
  xhr.onerror = function() {
    errorHandler(xhr.statusText);
  };
  xhr.send(obj.body);
}

// Function to create the Single Card of Timeline
function templateCard(planet, i) {
  const dateCreated = DateTime.fromISO(planet.created).setLocale('it').toLocaleString(DateTime.DATETIME_SHORT);
  return `
        <div class="timeline-container">
            <div class="timeline-icon">
                <img src="${i % 2 === 0 ? './images/yingyang1.png' : './images/yingyang2.png'}" class="far fa-grin-wink" />
            </div>
            <div class="timeline-body">
                <h3 class="timeline-title"><span class="badge">${planet.name}</span></h3>
                <h5 class="timeline-subtitle">${dateCreated}</h5>
                <h4>Short description of the planet</h4>
                <ul>
                    <li>Climate of the planet: ${planet.climate}</li>
                    <li>Planet diameter: ${planet.diameter}km</li>
                    <li>Gravity: ${planet.gravity}</li>
                    <li>Planet rotation orbital: ${planet.orbital_period} day</li>
                    <li>Number of inhabitants: ${planet.population}</li>
                    <li>Planet rotation time: ${planet.rotation_period}h</li>
                    <li>Surface water: ${planet.surface_water}</li>
                    <li>Terrain: ${planet.terrain}</li>
                </ul>
            </div>
        </div>`
}

// Function to create the Empty Search Card
function templateNoResult() {
  return `
        <div class="timeline-container">
            <div class="timeline-icon">
                <img src="./images/yingyang1.png" />
            </div>
            <div class="timeline-body">
                <h3 class="timeline-title"><span class="badge">may the force be with you</span></h3>
                <h5 class="timeline-subtitle-error">no! try not. do! or do not. there is no try. <br>do it again</h5>
            </div>
        </div>`
}

// Function to do the request and populate the timeline
function planetRequest(url) {
  request({ url },
    function(data) {
      const planets = JSON.parse(data);
      planets.results.forEach(function(planet, i){
        results.push(planet);
        results[i].createdTimestamp = DateTime.fromISO(planet.created).toMillis();
        template += templateCard(planet, i)
      });
      // If exists the next page call the next endpoint
      if (planets.next) planetRequest(planets.next)
      document.getElementById("timeline").innerHTML = template;
    },
    function(error) {
      console.log(error);
    }
  );
}

// Call the first endpoint at the start
planetRequest('https://swapi.dev/api/planets');

// Declare the onClick function
window.showFilters = showFilters;
window.filterDataName = filterDataName;
window.filterDataDate = filterDataDate;

// Function to show/hide the date filter and Sort
function showFilters() {
  var x = document.getElementById("filters");
  if (x.classList.contains("show")) {
    x.classList.remove("show");
  } else {
    x.classList.add("show");
  }
}

// Function to manage if the data exists/not exists
function searchTemplate(namePlanet) {
  let templateSearch = '';

  if (namePlanet.length > 0){
    namePlanet.forEach((planet, i) => {
      let resultsDate = results.slice(0);
      resultsDate.push(planet);
      templateSearch += templateCard(planet, i);
    })
  }else{
    templateSearch += templateNoResult();
  }
  return templateSearch;
}

// Search function
function filterDataName() {
  const planetSearch = document.getElementById("planet-search").value;

  const findPlanetDate = results.filter(({ name }) => name.toLowerCase().includes(planetSearch.toLowerCase()) );

  document.getElementById("timeline").innerHTML = searchTemplate(findPlanetDate);
}

// Event Listener to run the search on Enter keyboard
const inputPlanetSearch = document.getElementById('planet-search');
inputPlanetSearch.addEventListener("keypress", function(event) {
  if (event.key === 'Enter') {
    filterDataName();
  }
});

// Search range date function
function filterDataDate() {
  const dateStart = document.getElementById("start-date").value;
  const dateEnd = document.getElementById("end-date").value;

  const findPlanetDate = results.filter(({ created }) => (created >= dateStart) &&  (created <= dateEnd));

  document.getElementById("timeline").innerHTML = searchTemplate(findPlanetDate);
}

window.sortDataDate = sortDataDate;

// Sort function ASC/DESC
function sortDataDate(btn) {
  const direction = btn.classList.contains('asc') ? 'DESC' : 'ASC';
  btn.innerHTML = direction === 'ASC' ? 'ASC sort by date' : 'DESC sort by date';
  btn.classList.add(direction === 'ASC' ? 'asc' : 'desc');
  btn.classList.remove(direction === 'ASC' ? 'desc' : 'asc');
  let sortedActivities1 = results.slice(0);
  let sortedActivities2 = results.slice(0);

  // DESC sort
  sortedActivities1 = sortedActivities1.sort((a, b) => {
    return a.createdTimestamp - b.createdTimestamp;
  });

  // ASC sort
  sortedActivities2 = sortedActivities2.sort((a, b) => {
    return b.createdTimestamp - a.createdTimestamp;
  });

  const namePlanet = direction === 'ASC' ? sortedActivities2 : sortedActivities1;
  document.getElementById("timeline").innerHTML = searchTemplate(namePlanet);

}
