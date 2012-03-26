Rainmaker
===========

jQuery Weather Widget

Powered by Google weather api

Version 1.0

You can use and abuse it :)

Soon live demo...



What is it:
-----------
Rainmaker displays current weather conditions and the four day forecast for the selected cities. 
If multiple cities are selected, select box will be shown. It gets weather information from Google weather api via php file.
Of course you can use language of your choice to provide xml from Google api (can't get it directly due the cross domain AJAX). 

How it works:
-------------
Weather Widget uses google-weather.php to get XML file from Google weather api for selected cities and language. 
Then XML file is parsed and weather information is displayed, using Ajax requests which are done by jQuery.

How to install:
---------------
* Copy whole 'rainmaker' folder somewhere in your hosting.
* Be sure to have jQuery.
* Edit page where you want to put widget and insert:
<pre>
	<div id="rainmaker"></div>
</pre>
(Note that widget itself is 180px wide and floats left. 
(Fully customizable via CSS.)

* Put this in header of your page
<pre><link href="rainmaker/rainmaker.css" rel="stylesheet"  type="text/css" />
	<script type="text/javascript" src="rainmaker/rainmaker.js"></script>
	<script type="text/javascript">
	$(document).ready(function(){
		$("#rainmaker").rainmaker({
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
		});	
	});
	</script>
</pre>

Available options (default options displayed)
---------------------------------------------
	url                     path to google-weather.php file
	language		        language in ISO format (en, sr...)
	cities			        arrays of cities, in one of following formats, 
							second string is the name which will be displayed
								name - "belgrade", "Belgrade",
								postal code - "10099","New York"
								coordinates (notice 3 comas) - ",,,43724590,19707284","Zlatibor"
	showForecast	        if set to false, "Show forecast" link will not be displayed
	showForecastString      text for "Show forecast" link
	hideForecastString      text for "Hide forecast" link
	hideCurrentConditions   if set to false, current conditions will not be hidden when displaying forecast

