const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.urlencoded({extended : true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', function(req, res){
         
    var today = new Date();

    var options = {
     weekday: "long",
     day: "numeric",
     month: "long"
 };
 
 var day = today.toLocaleDateString("en-US", options);

    res.render('index', {
        day: day

    });
   
});




app.post('/', function(req,res){
    
    const query = req.body.city;
    const apiKey = "26aaaac4209d74a6d0c2c0ad61667e81";
    const units  =  req.body.units;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&units="+ units +"&appid="+ apiKey +"";
    https.get(url, function(response){
        console.log(response.statusCode);
        response.on("data", function(data){
        const weatherData = JSON.parse(data);
        const temp = Math.round(weatherData.main.temp);
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/"+ icon +"@2x.png";
        const city = weatherData.name;
        const feelsLike = Math.round(weatherData.main.feels_like);
        const tempHighs = Math.round(weatherData.main.temp_max);
        const tempLows = Math.round(weatherData.main.temp_min);
        const pressure = weatherData.main.pressure;
        const humidity = weatherData.main.humidity;
        const wind = Math.round(weatherData.wind.speed);
        const windDirection = weatherData.wind.deg;
        
        function degToCompass(num) {
            var val = Math.floor((num / 22.5) + 0.5);
            var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
            return arr[(val % 16)] ;
        }


        let direction = degToCompass(windDirection);
        const weatherDescription = weatherData.weather[0].description;

        
    var today = new Date();

    var options = {
     weekday: "long",
     day: "numeric",
     month: "long"
 };
 
 var day = today.toLocaleDateString("en-US", options);


        res.render('weather', {
            city: city,
            temp: temp,
            weatherDescription: weatherDescription,
            imageURL: imageURL,
            feelsLike: feelsLike,
            day: day,
            tempHighs: tempHighs,
            tempLows: tempLows,
            pressure: pressure,
            humidity: humidity,
            wind: wind,
            windDirection: direction
            
        })
       
        
        })
    });
});











app.listen('3000', function(){
    console.log("Server is listening");
})