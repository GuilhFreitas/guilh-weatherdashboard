let historyEl = document.querySelector('#history');
let todayEl = document.querySelector('#today');
let forecastEl = document.querySelector('#forecast');
let searchButtonEl = document.querySelector('#search-button');
let searchInputEl = document.querySelector('#search-input');

searchButtonEl.addEventListener('click', function(event){
    event.preventDefault();
    let APIkey = '0fa3bf96a49d09b12dcec88d6fd1e0bd';

    let searchTerm = searchInputEl.value;
    let geoQueryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchTerm}&limit=5&appid=${APIkey}`
    let lat = '';
    let lon = '';
    fetch(geoQueryURL)
    .then(response => response.json())
    .then(function(response){
        console.log(response);
        lat = response[0].lat;
        console.log(lat);
        lon = response[0].lon;
        console.log(lon);

        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`) 
    })
    .then(response => response.json())
    .then(function(response){
        console.log(response);
    })
})