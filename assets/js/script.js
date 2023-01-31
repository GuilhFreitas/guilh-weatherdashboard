let historyEl = document.querySelector('#history');
let todayEl = document.querySelector('#today');
let forecastEl = document.querySelector('#forecast');
let searchButtonEl = document.querySelector('#search-button');
let searchInputEl = document.querySelector('#search-input');
let asideEl = document.querySelector('aside')

displayHistory();

asideEl.addEventListener('click', function(event){
    event.preventDefault();

    let cityName = '';
    // distinguishes between search button and search history
    if (event.target.matches('#search-button')){
        cityName = searchInputEl.value;
        // does not allow empty string
        if (cityName === ''){
            alert('Please enter the name of a city.');
            return;
        }
    }else if(event.target.matches('.btn-history')){
        cityName = event.target.textContent;
    }else{
        return;
    }

    // fetches latitude and longitude for the search term using Geocoding API
    let myAPIkey = '0fa3bf96a49d09b12dcec88d6fd1e0bd';
    let geoQueryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${myAPIkey}`
    let lat = '';
    let lon = '';
    fetch(geoQueryURL)
    .then(response => response.json())
    .then(function(location){
        console.log(location);
        if (location.length === 0){
            alert("The city you're trying to look for doesn't seem to exist. Please try again.");
            return;
        }else{
            lat = location[0].lat;
            lon = location[0].lon;
    // fetches current weather data and displays it on the page
            return fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${myAPIkey}`);
        }
    })

    .then(response => response.json())
    .then(function(weatherData){
        console.log(weatherData);
        let temp = weatherData.main.temp;
        let wind = weatherData.wind.speed;
        let humidity = weatherData.main.humidity;
        let iconURL = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        let date = moment(weatherData.dt, 'X').format('DD/MM/YY');

        todayEl.innerHTML = ``;
        todayEl.innerHTML = `<h2>${cityName} (${date})<img src=${iconURL}></h2>
        <p>Temp: ${temp} °C</p>
        <p>Wind: ${wind} KPH</p>
        <p>Humidity: ${humidity}%`;

    // fetches 5 day forecast data and displays it on the page
        return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${myAPIkey}`)
    })

    .then(response => response.json())
    .then(function(forecastData){
        console.log(forecastData);
        forecastEl.innerHTML = `<h3>5-Day Forecast:</h3>
        <div id="forecast-row" class="row justify-content-around"></div>`;
        let forecastRowEl = document.querySelector('#forecast-row');
        console.log('forecast loop starts next')
        for (let i = 0; i < forecastData.list.length; i = i + 8) {
            console.log(`loop ${i}`);
            const dailyData = forecastData.list[i];
            let date = moment(dailyData.dt, 'X').format('DD/MM/YY');
            let temp = dailyData.main.temp;
            let humidity = dailyData.main.humidity;
            let wind = dailyData.wind.speed;
            let iconURL = `http://openweathermap.org/img/wn/${dailyData.weather[0].icon}@2x.png`;

            let cardEl = document.createElement('div');
            cardEl.setAttribute('class', 'card');
            cardEl.innerHTML = `<div class="card-body">
            <h4>${date}</h4>
            <img src=${iconURL}>
            <p>Temp: ${temp} °C</p>
            <p>Wind: ${wind} KPH</p>
            <p>Humidity: ${humidity}%
            </div>`;

            forecastRowEl.appendChild(cardEl);
        }
    })
    storeHistory(cityName);

})

// saves searched city to history in local storage and refreshes displayed history
function storeHistory(cityName){
    let searchHistory = JSON.parse(localStorage.getItem('search_history'));
        if (searchHistory !== null){
            if(searchHistory.length >= 6){
                searchHistory.pop();
            }
            searchHistory.unshift(cityName);
            localStorage.setItem('search_history', JSON.stringify(searchHistory));
        }else{
            localStorage.setItem('search_history', JSON.stringify([cityName]));
        }
        console.log(JSON.parse(localStorage.getItem('search_history')));
        displayHistory();
}

// displays search history on the page
function displayHistory(){
    let searchHistory = JSON.parse(localStorage.getItem('search_history'));
    historyEl.innerHTML = '';
    for (let i = 0; i < searchHistory.length; i++) {
        const city = searchHistory[i];
        
        let buttonEl = document.createElement('button');
        buttonEl.setAttribute('class', 'btn btn-secondary btn-history');
        buttonEl.textContent = city;
        historyEl.prepend(buttonEl);
    }
}