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
    .then(function(location){
        console.log(location);
        lat = location[0].lat;
        console.log(lat);
        lon = location[0].lon;
        console.log(lon);

        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`) 
    })
    .then(response => response.json())
    .then(function(weatherData){
        console.log(weatherData);
        let name = weatherData.name;
        console.log(name);
        let temp = weatherData.main.temp;
        console.log(temp);
        let wind = weatherData.wind.speed;
        console.log(wind);
        let humidity = weatherData.main.humidity;
        console.log(humidity);
        let iconURL = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        console.log(iconURL);
        let date = moment(weatherData.dt, 'X').format('DD/MM/YY');
        console.log(date);

        

        todayEl.innerHTML = `<h2>${name} (${date})<img src=${iconURL}></h2>
        <p>Temp: ${temp} °C</p>
        <p>Wind: ${wind} KPH</p>
        <p>Humidity: ${humidity}%`
    })
})