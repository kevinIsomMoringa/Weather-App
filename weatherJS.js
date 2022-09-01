
//Now we need to determine the constant of one of the id functions. Because no html function can be used directly in JavaScript.
const baseURL =`https://api.openweathermap.org/data/2.5/weather`

let inputValue = document.querySelector('#cityInput')
let btn = document.querySelector('#add');
let city = document.querySelector('#cityOutput')
let description = document.querySelector('#description')
let temp = document.querySelector('#temp')
let wind = document.querySelector('#wind')
let coords = document.querySelector('#coordinates')
//let span = document.createElement(span)

let apiKEY = "a6836b7693f4aea55769e50c0aed2f11"


function conversion(val){
    //kelvin to Celsius. 1 Kelvin is equal to -272.15 Celsius.
    return (val - 273).toFixed(2)
}
btn.addEventListener('click', accessWeatherAPI)


function accessWeatherAPI(){
    //This is the API link from where all the information will be collected
    fetch(`${baseURL}?q=${inputValue.value}&APPID=${apiKEY}`)
    .then(res => res.json())
    .then(data => {
        //Now you need to collect the necessary information with the API link. 
        //Now I will collect that information and store it in different constants.        
        console.log(data)
        let describe = data['weather']['0']['description']
        let temperature = data['main']['temp']
        let windSpeed = data['wind']['speed']
        let cityName = data['name']
        let longitude = data['coord']['lon']
        let latitude = data['coord']['lat']
        //Now with the help of innerHTML you have to make arrangements to display all the information in the webpage.
        city.innerHTML=`Weather in <span><a id=citySearch target="_blank">${cityName}</a><span>`
        coords.innerHTML=`Coordinates: <span>${latitude}</span> , <span>${longitude}</span>`
        temp.innerHTML = `Temperature: <span>${ conversion(temperature)} C</span>`
        description.innerHTML = `Sky Conditions: <span>${describe}</span>`
        wind.innerHTML = `Wind Speed: <span>${windSpeed} km/h</span>`      
        
        citysearch = document.querySelector('#citySearch')
        citysearch.addEventListener('mouseover', function(){
            citysearch.href = 'https://en.wikipedia.org/wiki/'+citysearch.innerHTML;   
        });
})

//Now the condition must be added that what if you do not input anything in the input box.
    .catch(err => alert('You entered Wrong city/town name'))
}
//If you click on the submit button without inputting anything in the input box or typing the wrong city name then the above text can be seen.

    
