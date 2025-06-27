const testnum = document.getElementById("testnum");
const locationInput = document.getElementById("location-input");

/**
 * This function is the primary callback after a location has been successfully geocoded.
 * It orchestrates the fetching of all other weather-related data (current, forecast, pollution)
 * and triggers their respective display functions.
 */
function fetchAllDataAndDisplay() {
    // 1. Display the location name immediately.
    displayLocation();

    // 2. Get lat/lon from the geocode result to use in other API calls.
    const lat = omGeocode.getLat();
    const lon = omGeocode.getLon();

    // 3. Trigger all other data requests. Their callbacks will handle displaying the data.
    getWeather(lat, lon);
    getForecast(lat, lon);
    getPollution(lat, lon);
}

///////////////////////////////////////////////////////////////
// LOCATION - translate from city, state, country to lat/lon //
///////////////////////////////////////////////////////////////

function getLocation() {
    const userLocation = locationInput.value.trim();
    if (userLocation === "") {
        alert("Please enter a location");
        return;
    }
    omGeocode.city = userLocation;
    omGeocode.request(fetchAllDataAndDisplay); // Chain all requests after location is found
}

function testLocation() {
    omGeocode.testRequest(testnum.value, displayLocation);
}

///////////////////////////////////////////////////////////////
// WEATHER - the current weather conditions                  //
///////////////////////////////////////////////////////////////
function getWeather(lat, lon) {
    omWeather.lat = lat || omGeocode.getLat();
    omWeather.lon = lon || omGeocode.getLon();

    omWeather.request(displayWeather);
}

function testWeather() {
    omWeather.testRequest(testnum.value, displayWeather);
}

///////////////////////////////////////////////////////////////
// FORECAST                                                  //
///////////////////////////////////////////////////////////////
function getForecast(lat, lon) {
    omForecast.lat = lat || omGeocode.getLat();
    omForecast.lon = lon || omGeocode.getLon();

    omForecast.request(displayForecast);
}

function testForecast() {
    omForecast.testRequest(testnum.value, displayForecast);
}

///////////////////////////////////////////////////////////////
// POLLUTION - the air quality index (AQI) and contaminants  //
///////////////////////////////////////////////////////////////
function getPollution(lat, lon) {
    omPollution.lat = lat || omGeocode.getLat();
    omPollution.lon = lon || omGeocode.getLon();

    omPollution.request(displayPollution);
}

function testPollution() {
    omPollution.testRequest(testnum.value, displayPollution);
}

// Add Enter key listener for location input
locationInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getLocation();
    }
});