// New Script //
var map;

function initMap() {
  // Create a map object and specify the DOM element for display.
  map = new google.maps.Map(document.getElementById('map-div'), {
    center: {lat: -34.397, lng: 150.644},
    scrollwheel: false,
    zoom: 8
  });
}



var App = angular.module("myApp", []);

// Master Angular Controller
App.controller('masterCtrl', function($scope) {

   // When document (WebSite) loads up, run this function
   $(document).ready(function() {
      // When user presses a key, run this funtion. the parameter(input) e
      //represents the key that was pressed.
      $(document).keyup(function(e) {
         //console.log(e);
         // If user pressed the enter key. (Enter's keycode is 13)
         if(e.keyCode == 13) {
            event = 13;
            $scope.loadInfo();
         }
         else {
            // Do Nothing
         }

      });
   });


$scope.loadInfo = function(){

	var query = $("#query").val();

   if(query == '') {
      $('#message').text('Please search a City/Location in the World.');
      setTimeout(function(){
         $('#message').text('');
      },3000);
      return;
   }

   $('#s-q').text(query);

   $('#message').text('Showing results for: ' + query + '');
   setTimeout(function(){
      $('#message').text('');
   },3000);

   var image = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + query + "";
   $scope.img = image;
   console.log($scope.img);
   $('#g-img').attr('src', image);
	var geocode = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "%20rd&key=AIzaSyCMUZlWdpM7LBb26c0PGOSxEC57EBJLABY";

   $.getJSON(geocode , function(data){

		console.log(data);

		var coordinates = data.results[0].geometry.location;

		map = new google.maps.Map(document.getElementById('map-div'), {
		  center: coordinates,
		  scrollwheel: false,
		  zoom: 8
		});
		var marker = new google.maps.Marker({
		  map: map,
		  position: coordinates
		});

	}).error(function(){
      $('#message').text('An error occured with your search. Try a different query.');
      setTimeout(function(){
         $('#message').text('');
      },3000);
   })

   $scope.articles = [];

   var nytURL = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + query + '&sort=newest&api-key=14132d207c54f0e27f34c90f3e5e4e59:9:73463344'

   $.getJSON(nytURL, function(data) {
		console.log(data);

		//$('#nytimes-header').text(city);

		articles = data.response.docs;

		for (var i = 0; i < articles.length; i++) {
			var article = articles[i];

			var HLK = article.headline.content_kicker;
			var HLM = article.headline.main;
			var HLP = article.headline.print_headline;
			var LP = article.lead_paragraph;
			if(article.byline == null){
				continue;
			}
			var BL = article.byline.original;
			var PD = article.pub_date;
			var WL = article.web_url;

			$scope.articles.push({
				headLineKicker: HLK,
				headLineMain: HLM,
				headLinePrint: HLP,
				leadParagraph: LP,
				byLine: BL,
				pubDate: PD,
				webLink: WL,
			});

		}

		$scope.$apply(function () {
			console.log($scope.articles);
		});

	}).error(function() {
		$("#nytimes-header").text('New York Times Could Not Be Loaded');
	});

   $("#query").val('');
}

});


$(document).ready(function(){

	var mapicon = $("#map-icon");
	var search = $("#search-icon");

	mapicon.click(function(){
		$(".search-div").hide()
		$("#img-div").hide()
		$("#news-div").hide()
		$("#map-div").show()

	})

	search.click(function(){
		$(".search-div").show()
		$("#img-div").show()
		$("#news-div").show()
		$("#map-div").hide()


	})


})
