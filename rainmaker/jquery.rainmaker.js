// jQuery Weather Widget
// Powered by Google weather api
// Author Stanko Tadić
// stanko87 [at] gmail [dot] com
// You can use and abuse it, as long the link back to home page stays intact
// Both links must stay, the one on the widget itself, and the one in the source code ;)
// Widget home page http://sale.mfhinc.net/2010/04/24/jquery-weather-widget/

// TODO mph to kph

(function($){

 	$.fn.rainmaker = function(options){
		var defaults = {  
		   url: "rainmaker/google-weather.php",
		   language: "en",
		   cities: Array(
				"belgrade", "Belgrade",
				"paris", "Paris",
				"london", "London", 
				"moscow", "Moscow", 
				"10099","New York", // postal code
				",,,43724590,19707284","Zlatibor" // coordinates (notice 3 comas)
		   ),
		   showForecast: true,
		   showForecastString: 'Show forecast',
		   hideForecastString: 'Hide forecast',
		   hideCurrentConditions: true
		};	
	
		var options = $.extend(defaults, options); 


		// adds all needed html
		$(this).html('<h4 id="city"></h4><div id="current"><noscript><h4>No JavaScript detected.</h4></noscript></div><div id="forecast"></div><a id="show-forecast">'+options.showForecastString+' &raquo;</a><select id="cities"></select>');
	
		// adds loading bar, then getting forecast for the first of the selected cities
		$('#current').text("").append("<h4>Loading...</h4>");
		getWeather(options.cities[0],options.cities[1], options.language,options.url);
	
		// making of select box for the all entered cities
		if(options.cities.length>2){
			for(var i=0; i<options.cities.length; i++){
				j=i; i++;
				$('#cities').append($("<option></option>").attr("value",options.cities[j]).text(options.cities[i]));
			}
			$('#cities').show();
		}
	
		$("#cities").change(function(){
			getWeather($("#cities :selected").val(), $("#cities :selected").text(), options.language, options.url);
		});

		// show hides forecast
		$("#show-forecast").click(function () {
			if(options.showForecast){
				if(options.hideCurrentConditions)
					$('#current').stop().hide();
				$('#forecast').stop().fadeIn();
				$("#show-forecast").html(options.hideForecastString+' &laquo;');
				options.showForecast=false;
			}
			else{
				$('#forecast').stop().hide();
				$('#current').stop().fadeIn();
				$("#show-forecast").html(options.showForecastString+' &raquo;');
				options.showForecast=true;
			}
		  }
		);
	
		// shows forecast if set in config
		if(options.showForecast){
			$('#show-forecast').css({"display": 'block'});
		}
	};
})(jQuery);


// function which replaces all cyrillic characters to latin
// only for Serbian users
function cyrToLat(str){
	var lat = new Array
	('A','B','V','G','D','Đ','E','Ž','Z','I','J','K','L','M','N','Nj',
	'O','P','R','S','T','U','Š','Č','Ć','C','Dž','Lj','F','H','a','b',
	'v','g','d','đ','e','ž','z','i','j','k','l','m','n','nj','o','p',
	'r','s','t','u','š','č','ć','c','dž','lj','f','h');
	var cyr = new Array
	('А','Б','В','Г','Д','Ђ','Е','Ж','З','И','Ј','К','Л','М','Н','Њ',
	'О','П','Р','С','T','У','Ш','Ч','Ћ','Ц','Џ','Љ','Ф','Х','a','б',
	'в','г','д','ђ','e','ж','з','и','ј','к','л','м','н','њ','о','п',
	'р','с','т','у','ш','ч','ћ','ц','џ','љ','ф','х');    
		
	for (var i = 0; i < cyr.length; i++) {
	    var regexp = new RegExp(cyr[i], 'g');
	    str = str.replace(regexp, lat[i]);
	}
	
	return str;
}

// functions which does the magic, gets data from google weather api
// weather - name, post code or coordinates of the city (check google-api documentation for more information)
// cityName - city name to be dosplayed
// lang - ISO language code (check google-api documentation for more information)

function getWeather(weather, cityName, language, url){
	$('#current').html("<h4>Loading...</h4>");
	$('#city').html(cityName);

	// function for XML parsing
	var childData = function(selector, arg){
	    return selector.find(arg).attr('data');
	}
	$.ajax({
	    type: "GET",
	    url: url, // path to PHP file which gets XML from google-api
	    data: "weather=" + weather + "&hl=" + language,
	    success: function(data){


	        curConditions = $(data).find('current_conditions');
	        forecastInfo = $(data).find('forecast_information');
	        
	        $('#current').text('');
	        $('#forecast').text('');
	        
	        // error when google-api doesn't return results
	        if (childData(curConditions, 'temp_c') == null) {
	            $('#current').text("").append("<h4>Error. Please try later.</h4>");
	            return;
	        }

	        // checking unit system, for converting °F to °C
	        conversion=false;
	        if (childData(forecastInfo, 'unit_system') == 'US'){
	            conversion=true;
	        }
	        
	        // displaying current conditons
			$('#current').append('\
				<img src="http://www.google.com'+childData(curConditions, 'icon')+'" alt="" />\
				<span>'+cyrToLat(childData(curConditions, 'condition'))+' '+childData(curConditions, 'temp_c')+'°C</span>\
				<span>'+cyrToLat(childData(curConditions, 'wind_condition'))+'</span>\
				<span>'+cyrToLat(childData(curConditions, 'humidity'))+'</span>');
		
			// displaying forecast conditons
			$(data).find('forecast_conditions').each(function(){
				low = childData($(this),'low');
				high = childData($(this),'high');
				if(conversion){
					low = Math.round(5/9 * (low-32));
					high = Math.round(5/9 * (high-32));
				}
				$('#forecast').append('\
				<div>\
					<span class="day">'+cyrToLat(childData($(this), 'day_of_week'))+'</span>\
					<img src="http://www.google.com'+childData($(this), 'icon')+'" alt="" />\
					<span>'+cyrToLat(childData($(this), 'condition'))+'</span>\
					<span>'+low+"°C | "+high+'°C</span>\
				</div>');
	
			});
			
	    }, // :success end 
	    error: function(){
	    	alert('error')
	    }

	}); // ajax end 
	
} // function end 



