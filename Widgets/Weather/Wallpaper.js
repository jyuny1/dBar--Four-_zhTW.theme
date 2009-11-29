var postal;
var demoMode = false;
var enabled;

if (location.href.indexOf("LockBackground")  == -1){
	stylesheet = stylesheetWall;
	iconSet = iconSetWall;
	iconExt = iconExtWall;
	enabled = enableWallpaper;
}else{
	stylesheet = stylesheetLock;
	iconSet = iconSetLock;
	iconExt = iconExtLock;
	enabled = enableLockScreen;
}

if(enabled == true){
if(iconSet == null || iconSet == 'null' || iconSet == ""){
	var iconSet = stylesheet;
}

var headID = document.getElementsByTagName("head")[0];         
var styleNode = document.createElement('link');
styleNode.type = 'text/css';
styleNode.rel = 'stylesheet';
styleNode.href = 'Stylesheets/'+stylesheet+'.css';
headID.appendChild(styleNode);

var scriptNode = document.createElement('script');
scriptNode.type = 'text/javascript';
scriptNode.src = 'Sources/'+source+'.js';
headID.appendChild(scriptNode);
}

function onLoad(){
	if (enabled == true){ 
	if (demoMode == true){
		document.getElementById("weatherIcon").src="Icon Sets/"+iconSet+"/"+"cloudy1"+iconExt;
		document.getElementById("city").innerText="Somewhere";
		document.getElementById("desc").innerText="Partly Cloudy";
		document.getElementById("temp").innerText="100º";
		
	}else{ 
	document.getElementById("weatherIcon").src="Icon Sets/"+iconSet+"/"+"dunno"+iconExt;
	validateWeatherLocation(escape(locale).replace(/^%u/g, "%"), setPostal)
	}
	}else{
		document.getElementsByTagName("body")[0].innerText='';
	}
}

function convertTemp(num)
{
	if (isCelsius == true)
		return Math.round ((num - 32) * 5 / 9);
	else
		return num;
}

function setPostal(obj){
	
	if (obj.error == false){
		if(obj.cities.length > 0){
			postal = escape(obj.cities[0].zip).replace(/^%u/g, "%")
			document.getElementById("WeatherContainer").className = "";	
			weatherRefresherTemp();
		}else{
			document.getElementById("city").innerText="Not Found";
			document.getElementById("WeatherContainer").className = "errorLocaleNotFound";	
		}
	}else{
		document.getElementById("city").innerText=obj.errorString;
		document.getElementById("WeatherContainer").className = "errorLocaleValidate";	
		setTimeout('validateWeatherLocation(escape(locale).replace(/^%u/g, "%"), setPostal)', Math.round(1000*60*5));
	}
}

function dealWithWeather(obj){

	if (obj.error == false){
		document.getElementById("city").innerText=obj.city;
		document.getElementById("desc").innerText=obj.description.toLowerCase();
		
		if(useRealFeel == true){
			tempValue = convertTemp(obj.realFeel);
		}else{
			tempValue = convertTemp(obj.temp)
		}
		document.getElementById("temp").innerText=tempValue+"º";
		document.getElementById("weatherIcon").src="Icon Sets/"+iconSet+"/"+MiniIcons[obj.icon]+iconExt;
		document.getElementById("WeatherContainer").className = "";	

		
	}else{
		//Could be down to any number of things, which is unhelpful...
		document.getElementById("WeatherContainer").className = "errorWeatherDataFetch";	
	}
	
	
}

function weatherRefresherTemp(){ //I'm a bastard ugly hack. Hate me.
	fetchWeatherData(dealWithWeather,postal);
	setTimeout(weatherRefresherTemp, 60*1000*updateInterval);
}