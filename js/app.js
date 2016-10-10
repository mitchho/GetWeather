
var city;

var getCityWeather = function(city) {
 	 
    console.log("city from getCityWeather: " + city);

var parameters = { 
	 	q: city,
	 	units: "imperial",
	 	APPID: "8b8023b0f5e383e8275fa7d74317a3ed"
	};

    $.ajax({
		url: "http://api.openweathermap.org/data/2.5/weather",
		data: parameters,
		dataType: "jsonp", // use jsonp to avoid cross origin issues
		type: "GET" 
	})
	.done(function(weatherData){ // this waits for the ajax to return with a succesful object
		 
		console.log("weatherData from getCityWeather: ", weatherData);
		//console.log("weatherData.main.temp from getCityWeather: ", weatherData.main.temp);
 
		//var temperatureInF = convertTempFromKelvinToFahrenheit(parseInt(weatherData.main.temp));
		var temperatureInF = parseInt(weatherData.main.temp);
		//console.log("temperatureInF from getCityWeather: ", temperatureInF); 
		var tempElement = showTemperature(temperatureInF);
		$('.currentDataText').html('');
		$('.currentDataText').append(tempElement);

		var conditions = weatherData.weather[0].description;
		//console.log("conditions: ", conditions);
		var conditionsElement = showConditions(conditions);
		//console.log("conditionsElement: ", conditionsElement);
		$('.currentDataText').append(conditionsElement);

		var humidity = parseInt(weatherData.main.humidity);
		var humidityElement = showHumidity(humidity);
		$('.currentDataText').append(humidityElement);
  
		//var windSpeed = convertMetersPerSecToMilesPerHr(weatherData.wind.speed);
		var windSpeed = weatherData.wind.speed;
		//console.log("wind speed: ", windSpeed);
		var windSpeedElement = showWindSpeed(windSpeed);
		$('.currentDataText').append(windSpeedElement);

		var cloudCover = weatherData.clouds.all;
		//console.log("cloud cover: ", cloudCover);
		var cloudCoverElement = showCloudCover(cloudCover);
		$('.currentDataText').append(cloudCoverElement);

		var detailedForecastElement = showDetailedForecastLink();
		$('.currentDataText').append(detailedForecastElement);

		getCityDailyForecast(city);
	})
	.fail(function(jqXHR, error){

	});	
};

var getCityDailyForecast = function(city) {

	var parameters = { 
	 	q: city,
	 	units: "imperial",
	 	APPID: "8b8023b0f5e383e8275fa7d74317a3ed"
	};

	$.ajax({
		url: "http://api.openweathermap.org/data/2.5/forecast/daily",
		data: parameters,
		dataType: "jsonp", // use jsonp to avoid cross origin issues
		type: "GET" 
	})
	.done(function(dailyForecastData){ // this waits for the ajax to return with a succesful object
		 
		console.log("dailyForecastData from getCityDailyForecast: ", dailyForecastData);
		 
		var minDailyTemp = dailyForecastData.list[0].temp.min;
		//console.log("minDailyTemp: ", minDailyTemp);

		var maxDailyTemp = dailyForecastData.list[0].temp.max;
		//console.log("maxDailyTemp: ", maxDailyTemp);

		//  note that the white space in the append call gets trimmed - very annoying
		$('#temperatureText').append(" ---               low today:     " + minDailyTemp);
		$('#temperatureText').append(" ---     high today: " + maxDailyTemp);

		
	})
	.fail(function(jqXHR, error){

	});	

};

var getCityFiveDayForecast = function(city) {

	var parameters = { 
	 	q: city,
	 	units: "imperial",
	 	APPID: "8b8023b0f5e383e8275fa7d74317a3ed"
	};

	$.ajax({
		url: "http://api.openweathermap.org/data/2.5/forecast",
		data: parameters,
		dataType: "jsonp", // use jsonp to avoid cross origin issues
		type: "GET" 
	})
	.done(function(forecastData){ // this waits for the ajax to return with a succesful object
		 
		console.log("forecastData from getCityFiveDayForecast: ", forecastData);


		$.each(forecastData.list, function(i, item) {
			//console.log(item.dt_txt);

			var weatherDescription = item.weather[0].main;
			//console.log("weatherDescription: ", weatherDescription);
			var airTemp = item.main.temp;
			//console.log("airTemp: ", airTemp);
			var humidity = item.main.humidity;
			//console.log("humidity: ", humidity);
 			var forecastElement5Day = showFiveDayForecast(item.dt_txt, weatherDescription, airTemp, humidity);
			$('.currentDataText').append(forecastElement5Day);
 			 
		   		});
		   		 

	})
	.fail(function(jqXHR, error){

		console.log("in .fail");
		var errorElem = showError(error);
		$('.currentDataText').append(errorElem);

	});	

};	

var showTemperature = function(temperature) {

	// clone our result zombie code
	var temperatureElement = $('.zombieElements .temperature').clone();
	temperatureElement.text("Current Temperature (F) : " + round(temperature , 2).toString());
  
	return temperatureElement;
};

var showConditions = function(conditionsDescription) {

	//console.log("conditionsDescription from showConditions: ", conditionsDescription );
	// clone our result zombie code
	 
	var conditionElement = $('.zombieElements .conditions').clone();
	//console.log("conditionElement from showConditions: ", conditionElement);
	conditionElement.text("Conditions : " + conditionsDescription);
  
	return conditionElement;
};

var showHumidity = function(humidity) {

	// clone our result zombie code
	var humidityElement = $('.zombieElements .humidity').clone();
	humidityElement.text("Humidity (%) : " + humidity.toString());
  
	return humidityElement;
};
  
var showWindSpeed = function(windSpeed) {

 	// clone our result zombie code
	 
	var windSpeedElement = $('.zombieElements .windSpeed').clone();
	//console.log("windSpeed from showWindSpeed: ", windSpeed);
	windSpeedElement.text("Wind Speed (mph) : " + round(windSpeed, 2).toString());
  
	return windSpeedElement;
};

var showCloudCover = function(cloudCover) {

 	// clone our result zombie code
	 
	var cloudCoverElement = $('.zombieElements .cloudCover').clone();
	//console.log("cloudCover from showCloudCover: ", cloudCover);
	cloudCoverElement.text("Cloud Cover (%) : " + round(cloudCover, 2).toString());
  
	return cloudCoverElement;
};

var showFiveDayForecast = function(dateAndTime, description, airTemp, humidity) {

 	// clone our result zombie code
	 
	var fiveDayForecastElement = $('.zombieElements .forecastElement5Day').clone();

	var dateAndTimeElem = fiveDayForecastElement.find('.dateAndTime');
	dateAndTimeElem.text(dateAndTime);

	var forecastDescription = fiveDayForecastElement.find('.forecastDescription');
	forecastDescription.text(description);

	var airTemperatureElem = fiveDayForecastElement.find('.airTemperature');
	airTemperatureElem.text(round(airTemp, 0).toString());

	var humidityElem = fiveDayForecastElement.find('.humidity5Day');
	humidityElem.text(round(humidity, 0).toString());
   
	return fiveDayForecastElement;
};

var showDetailedForecastLink = function() {

	// clone our result zombie code
	var forecastElement = $('.zombieElements a').clone();
	//temperatureElement.text("Current Temperature (F) : " + round(temperature , 2).toString());
  
	return forecastElement;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.zombieElements .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

//  this never worked right
$('.zombieElements a').click(function(event) {
        event.preventDefault();
        console.log("tapped");
         

    });

function test()
{
	console.log("clicked");
	console.log("city from test(): " + city);
	$('.currentDataText').html('');
	getCityFiveDayForecast(city);
	 
}

function convertTempFromKelvinToFahrenheit(kelvinTemp) {

	var celsiusTemp = kelvinTemp - 273.15;
	var fahrenheitTemp = (1.8 * celsiusTemp) + 32.0;

	return fahrenheitTemp;
}
  
function convertMetersPerSecToMilesPerHr(metersPerSec) {

	var metersPerHr = metersPerSec * 3600;
	var milesPerHr = metersPerHr / 1609.344;

	return milesPerHr;

}

function round(value, decimals) {

  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

$(document).ready(function() {
	$('.cityGetter').submit(function(event){
		event.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the city the user submitted
		city = $(this).find("input[name='city']").val();
		console.log("city entered: " + city);
		getCityWeather(city);
		//getCityFiveDayForecast(city);
	});

	 

});