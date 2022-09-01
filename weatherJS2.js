const weatherBaseURL =`https://api.openweathermap.org/data/2.5/weather`
const weatherApiKey = "a6836b7693f4aea55769e50c0aed2f11"
const countryBaseURL = `https://country-info.p.rapidapi.com/code/`
const countryApiKey = 'a70d0cb934msh5bd944b21db7f08p15f7b4jsn1d2a6f4f7508'

let inputValue = document.querySelector('input#cityInput');
let wrapper = document.querySelector('.wrapper');
let btn = document.querySelector('#add');


//fetch(`https://api.openweathermap.org/data/2.5/weather?q=Nairobi&APPID="a6836b7693f4aea55769e50c0aed2f11"`)

async function accessWeatherAPI(){
    //This is the API link from where all the information will be collected
    await fetch(`${weatherBaseURL}?q=${inputValue.value}&APPID=${weatherApiKey}`)
    .then(res => res.json())
    .then(data => {
        removeAllChildNodes(wrapper);
        let httpResponseCode = data['cod'];
        if (httpResponseCode !== 200) {alert('Location not found')}

        let neededWeatherInfo = new Object();

        neededWeatherInfo.describe = data['weather']['0']['description'];
        neededWeatherInfo.temperature = data['main']['temp'];
        neededWeatherInfo.windSpeed = data['wind']['speed'];
        neededWeatherInfo.cityName = data['name'];
        neededWeatherInfo.longitude = data['coord']['lon'];
        neededWeatherInfo.latitude = data['coord']['lat'];
        neededWeatherInfo.countryCode = data['sys']['country'];
        
        putElementsInHTML(neededWeatherInfo);

    }).catch(err => {
        console.error(err)
    });
};


async function getCountryInfo(countryShortCode) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': countryApiKey,
            'X-RapidAPI-Host': 'country-info.p.rapidapi.com'
        }
    };

    await fetch(`${countryBaseURL}${countryShortCode}`, options)
        .then(response => response.json())
        .then(response => {
            let neededCountryInfo = new Object();
            console.log(response);
        })
        .catch(err => console.error(err));
}

function putElementsInHTML(data) {
    createElements(wrapper, 'h2', { id: 'cityOutput', innerData: `Weather in ` });
    createElements(document.querySelector('#cityOutput'), 'span', { id:'citySearch', innerData: ` ${data.cityName}` });
    
    createElements(wrapper, 'p', { id: 'coordinates', innerData: `Coordinates: ` });
    createElements(document.querySelector('#coordinates'), 'span', { innerData: data.latitude });
    createElements(document.querySelector('#coordinates'), 'span', { innerData: `, ${data.longitude}` });

    createElements(wrapper, 'p', { id: 'temp', innerData: `Temperature: ` });
    createElements(document.querySelector('#temp'), 'span', { innerData: ` ${data.temperature} K or ${convertTemp(data.temperature)} C` });

    createElements(wrapper, 'p', { id: 'description', innerData: `Sky Conditions: ` });
    createElements(document.querySelector('#description'), 'span', { innerData: data.describe });

    createElements(wrapper, 'p', { id: `wind`, innerData: `Wind Speed: ` });
    createElements(document.querySelector('#wind'), 'span', { innerData: `${data.windSpeed} km/h` });

    getCountryInfo(data.countryCode);
}

function convertTemp(val){
    //1 Kelvin is equal to -272.15 Celsius.
    return (val - 273).toFixed(2)
}

function createElements(parentNode, elementToCreate='p',{id=null, className=null, innerData=null, innerHTML=null}={}) {
    const element = document.createElement(elementToCreate);
    if (id !== null) {element.setAttribute('id', id)};
    if (className !== null) { element.setAttribute('class', className)};
    if (innerData !== null) { element.appendChild(document.createTextNode(innerData))};

    parentNode.appendChild(element);
};

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

btn.addEventListener('click', accessWeatherAPI)


