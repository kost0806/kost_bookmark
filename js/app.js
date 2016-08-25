var app = angular.module("Bookmark", ['firebase']);  
app.controller("Ctrl", function ($scope, $firebaseArray, $http) {
	$scope.url;  

    var firebaseURL = "https://kostbm.firebaseio.com/";

    $scope.getList = function(url) {
      console.log('getList');
    	var echoRef = new Firebase(url);
  		var query = echoRef.orderByChild("url");
  		$scope.urlArr = $firebaseArray(query);
    };

    $scope.add = function() {
      console.log('add');
      angular.element('#loading').toggleClass('hide');
      angular.element('#block').toggleClass('hide');

      $http.get('getImageAndThumb.php', {params: {url: $scope.url}}).success(function(data, status, headers, config) {
        console.log(data);
        var shortUrl, shortTitle;
        var title = angular.element('<textarea />').html(data['title']).text();
        var stringByteLength = (function(s,b,i,c){
          for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
          return b;
        })(title);
        if (stringByteLength > 40) {
          shortTitle = title.substr(0, title.length - Math.floor((stringByteLength - 25) / 2) - 3) + "...";
        }
        else {
          shortTitle = title;
        }
        if ((shortTitle.length + $scope.url.length) > 40) {
          shortUrl = $scope.url.substr(0, 40 - shortTitle.length - 3) + "...";
        }
        else {
          shortUrl = $scope.url;
        }
        
        console.log(title);
        $scope.urlArr.$add({
          url: $scope.url,
          shortUrl: shortUrl,
          title: title,
          shortTitle: shortTitle,
          thumbUri: data['thumb_path']
        });

        angular.element('#loading').toggleClass('hide');
        angular.element('#block').toggleClass('hide');
        angular.element('#input').val("");
        $scope.toggleInput();
      }).error(function(data, status, headers, config) {
        alert('Error occur');
        angular.element('#loading').toggleClass('hide');
        angular.element('#block').toggleClass('hide');
      });

    };

    $scope.remove = function (url) {
      console.log('remove');
      $scope.urlArr.$remove(url);
    };


    $scope.FBLogin = function () {
      console.log('FBLogin');
      var ref = new Firebase(firebaseURL);
      ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        }
        else {
          $scope.$apply(function() {
            $scope.$authData = authData;
          });
          console.log("Authenticated successfully with payload:", authData);

          // do something with the login info
          $scope.userName = authData.facebook.displayName;
          $scope.getList(firebaseURL + 'Customer/' + authData.uid);
        }
     });
   };

    $scope.FBLogout = function () {
      console.log('FBLogout');
      if ($scope.$authData == undefined) {
        return;
      }
      var ref = new Firebase(firebaseURL);
      ref.unauth();
      delete $scope.$authData;

      // do something after logout
      delete $scope.urlArr;
    };

    $scope.getWeather = function(city) {
      console.log('getWeather');
      
      //http://api.openweathermap.org/data/2.5/weather?q=seoul,uk&appid=##############
      $http.get('http://api.openweathermap.org/data/2.5/weather', 
        {params: {q: city, appid:'##############', units: 'metric'}}).
        success(function(data, status, headers, config) {
          $scope.weatherData = data;
          console.log('weather:', data);
          console.log('temp:', data.main.temp);
        }).
        error(function(data, status, headers, config) {});

    }

    $scope.toggleInput = function() {
      console.log('hide');
      // angular.element('#urlForm').toggleClass('hide');
      angular.element('#urlForm').toggle({effect: "slide", direction: "right"});
    }

    // get weather
    $scope.getWeather('seoul');
});