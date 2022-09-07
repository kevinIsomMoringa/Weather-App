const weatherBaseURL =`https://api.openweathermap.org/data/2.5/weather`
const weatherApiKey = "a6836b7693f4aea55769e50c0aed2f11"
const countryBaseURL = `https://country-info.p.rapidapi.com/code/`
const countryApiKey = 'a70d0cb934msh5bd944b21db7f08p15f7b4jsn1d2a6f4f7508'

let inputValue = document.querySelector('input#cityInput');
let wrapper = document.querySelector('#nowCast');
let countryInfo = document.querySelector('#countryInfo-Dropdown');
let btn = document.querySelector('#search-submit');
let dropbtn1 = document.querySelector('#dropbtn1');


async function accessWeatherAPI(event){
    event.preventDefault()
    //This is the API link from where all the information will be collected
    await fetch(`${weatherBaseURL}?q=${inputValue.value.trim()}&APPID=${weatherApiKey}`)
    .then(async res => {
        if (!res.ok) {
            removeAllChildNodes(wrapper);
            // get error message from response status
            alert('Location not found')
            createElements(wrapper, 'h2', { id: 'cityOutput', innerData: `Weather Info not found` });
            throw new Error(`Something went wrong! \nHTTP response code: ${res.status}`);    
        }
        return await res.json();
    })
    .then(data => {
        removeAllChildNodes(wrapper);
        let neededWeatherInfo = new Object();

        neededWeatherInfo.currentTime = data['dt'];
        neededWeatherInfo.sunriseTime = data['sys']['sunrise'];
        neededWeatherInfo.sunsetTime = data['sys']['sunset'];

        neededWeatherInfo.describe = data['weather']['0']['description'];
        neededWeatherInfo.temperature = data['main']['temp'];

        neededWeatherInfo.tempFeels = data['main']['feels_like'];
        neededWeatherInfo.minTemp = data['main']['temp_min'];
        neededWeatherInfo.maxTemp = data['main']['temp_max'];
        neededWeatherInfo.humidity = data['main']['humidity'];

        neededWeatherInfo.windSpeed = data['wind']['speed'];
        neededWeatherInfo.cityName = data['name'];
        neededWeatherInfo.longitude = data['coord']['lon'];
        neededWeatherInfo.latitude = data['coord']['lat'];
        neededWeatherInfo.countryCode = data['sys']['country'];
        
        putWeatherElementsInHTML(neededWeatherInfo);

    }).catch(err => {
        console.error(err)
    });
};


async function getCountryInfo(countryShortCode) {
    getCountryFlag(countryShortCode.toLowerCase())

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': countryApiKey,
            'X-RapidAPI-Host': 'country-info.p.rapidapi.com'
        }
    };

    await fetch(`${countryBaseURL}${countryShortCode}`, options)
    .then(async response => {
        if (!response.ok) {
            removeAllChildNodes(countryInfo);
            // get error message from response status
            alert('Country not found')
            createElements(countryInfo, 'h2', { id: 'cityOutput', innerData: `Country not found` });
            throw new Error(`Something went wrong! \nHTTP response code: ${response.status}`);    
        }
        return await response.json()
    })
    .then(async res => {
        removeAllChildNodes(countryInfo);
        let entries = Object.entries(res)
        let data = entries.map( ([key, val] = entry) => {
            createElements(countryInfo, 'p', {innerData: `Country ${key}: ${val}`});
        });
        data
    })
    .catch(err => {
        console.error(err)
    });
}

async function getCountryFlag(countryCode,flagSize='w320'){
    //This is the API link that gets the Country's flag
    await fetch(`https://flagcdn.com/${flagSize}/${countryCode}.png`)
    .then(async res => {
        if (!res.ok) {
            removeAllChildNodes(wrapper);
            // get error message from response status
            alert('Country not found')
            createElements(wrapper, 'h2', { id: 'cityOutput', innerData: `Location not found` });
            throw new Error(`Something went wrong! \nHTTP response code: ${response.status}`);    
        }
        return res;
    })
    .then(data => {
        const el = document.querySelector('#countryInfor')
        //console.log(data.url)
        el.style.backgroundImage = `url(${data.url})`;
        el.style.backgroundRepeat = "no-repeat";
        el.style.backgroundPosition = "center center"
    }
    )
    .catch(err => {
        console.error(err)
    });
}


function putWeatherElementsInHTML(data) {
    createElements(wrapper, 'h2', { id: 'cityOutput', innerHtml: `Weather in <span>${data.cityName}</span>` });
    
    createElements(wrapper, 'p', { id: 'cityDate', innerHtml: `Date: <span>${unixTime2NormalFormat(data.currentTime)[0]}</span>` });
    createElements(wrapper, 'p', { id: 'cityCurrentTime', innerHtml: `Current Time: <span>${unixTime2NormalFormat(data.currentTime)[1]}</span>` });
    createElements(wrapper, 'p', { id: 'citySunriseTime', innerHtml: `Sunrise time: <span>${unixTime2NormalFormat(data.sunriseTime)[1]}</span>` });
    createElements(wrapper, 'p', { id: 'citySunsetTime', innerHtml: `Sunset time: <span>${unixTime2NormalFormat(data.sunsetTime)[1]}</span>` });
    
    createElements(wrapper, 'p', { id: 'coordinates', innerHtml: `Coordinates: <span>${data.latitude} , ${data.longitude}</span>` });

    createElements(wrapper, 'p', { id: 'temp', innerHtml: `Temperature: <span>${data.temperature} K or ${convertTemp(data.temperature)} C</span>` });

    createElements(wrapper, 'p', { id: `feels_like`, innerHtml: `Temperature feels like: <span>${data.tempFeels} K or ${convertTemp(data.tempFeels)} C</span>` });

    createElements(wrapper, 'p', { id: `temp_min`, innerHtml: `Minimum temperature: <span>${data.minTemp} K or ${convertTemp(data.minTemp)} C</span>` });

    createElements(wrapper, 'p', { id: `temp_max`, innerHtml: `Maximum temperature: <span>${data.maxTemp} K or ${convertTemp(data.maxTemp)} C</span>` });

    createElements(wrapper, 'p', { id: `humidity`, innerHtml: `Humidity: <span>${data.humidity} %</span>` });

    createElements(wrapper, 'p', { id: 'description', innerHtml: `Sky Conditions: <span>${data.describe}</span>`});

    createElements(wrapper, 'p', { id: `wind`, innerHtml: `Wind Speed: <span>${data.windSpeed} km/h </span>` });

    getCountryInfo(data.countryCode);
    
}

function convertTemp(val){
    //1 Kelvin is equal to -272.15 Celsius.
    return (val - 273).toFixed(2)
}

function createElements(parNode, elementToCreate='p',{id=null, className=null, innerData=null, innerHtml=null}={}) {
    const element = document.createElement(elementToCreate);
    if (id !== null) {element.setAttribute('id', id)};
    if (className !== null) { element.setAttribute('class', className)};
    if (innerData !== null) { element.appendChild(document.createTextNode(innerData))};
    if (innerHtml !== null) { element.innerHTML = innerHtml};

    parNode.appendChild(element);
};

function unixTime2NormalFormat(unix_timestamp){
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    let date = new Date(unix_timestamp * 1000);
    return [date.toDateString(),date.toTimeString()]
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

// When the user clicks on the button,
// toggle between hiding and showing the dropdown content
function dropDownMenu() {
        countryInfo.classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


btn.addEventListener('click', accessWeatherAPI);
dropbtn1.addEventListener('click', dropDownMenu);
