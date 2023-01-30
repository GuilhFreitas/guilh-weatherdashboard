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
        lat = location[0].lat;
        lon = location[0].lon;

        return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${APIkey}`) 
    })
    .then(response => response.json())
    .then(function(weatherData){
        let name = weatherData.name;
        let temp = weatherData.main.temp;
        let wind = weatherData.wind.speed;
        let humidity = weatherData.main.humidity;
        let iconURL = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        let date = moment(weatherData.dt, 'X').format('DD/MM/YY');

        todayEl.innerHTML = ``;
        todayEl.innerHTML = `<h2>${name} (${date})<img src=${iconURL}></h2>
        <p>Temp: ${temp} °C</p>
        <p>Wind: ${wind} KPH</p>
        <p>Humidity: ${humidity}%`;

        let buttonEl = document.createElement('button');
        buttonEl.setAttribute('class', 'btn btn-secondary');
        buttonEl.textContent = name;
        historyEl.prepend(buttonEl);

        let searchHistory = JSON.parse(localStorage.getItem('search_history'));
        if (searchHistory !== null){
            if(searchHistory.length >= 6){
                searchHistory.pop();
            }
            searchHistory.unshift(name);
            localStorage.setItem('search_history', JSON.stringify(searchHistory));
        }else{
            localStorage.setItem('search_history', JSON.stringify([name]));
        }
        console.log(JSON.parse(localStorage.getItem('search_history')));
    })
})