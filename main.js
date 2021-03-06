var app = angular.module('app', ['ngMaterial','ngAnimate','ngRoute','chart.js','md.data.table', 'ja.qr']);

var URL_PREFIX = 'http://localhost:8080/';
var CLIENT_ID='oqW46naw0gfW7Vh7z6rEhSvXmIrW0qMZB2T1pR54';
var CLIENT_SECRET='3T3W8zxIlLNbAIVjST0izNFOKSzrwIumfA4Q76BdKVpvW1B6spYB035KothHvJEayhVUgnewzzOALtxqVNLpIdonrArxjG5FWu5xe6mjS3Zu7z1qMlEZSe38pcutlOnc';

app.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
});

app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
  $routeProvider.when("/", {
    controller: "MainCtrl",
    templateUrl: "templates/home.html"
  }).when("/login", {
    controller: "MainCtrl",
    templateUrl: "templates/login.html"
  }).when("/qrlogin", {
    controller: "MainCtrl",
    templateUrl: "templates/qrlogin.html"
  }).when("/signup", {
    controller: "MainCtrl",
    templateUrl: "templates/signup.html"
  }).when("/rebate", {
    controller: "DashCtrl",
    templateUrl: "templates/rebate.html"
  }).when("/data", {
    controller: "DashCtrl",
    templateUrl: "templates/data.html"
  }).when("/verifyemail", {
    controller: "VerificationCtrl",
    templateUrl: "templates/verifyemail.html"
  }).when("/iphoneuser", {
    controller: "IphoneCtrl",
    templateUrl: "templates/iphone.html"
  }).when("/dashboard", {
    controller: "DashCtrl",
    templateUrl: "templates/dashboard.html",
    resolve: {
        auth: function ($q, Auth) {
            var userDetails = Auth.getuserDetails();
            if (userDetails) {
                return $q.when(userDetails);
            } else {
                return $q.reject({ authenticated: false });
            }
        }
    }
  }).otherwise({
    controller: "MainCtrl",
    templateUrl: "templates/error.html"
  });
}]);
app.run(["$rootScope", "$location", function ($rootScope, $location) {
    $rootScope.$on("$routeChangeSuccess", function (userDetails) {
        // console.log(userDetails);
    });
    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            $location.path("/");
        }
    });
}]);
app.factory("Auth", ["$http","$q","$window",function ($http, $q, $window) {
    var userDetails;
    function login(user) {
        var url=URL_PREFIX+'login/';
        var deferred = $q.defer();
        $http({
             method: "POST",
             transformRequest: function(obj) {
                var str = [];
                for(var p in obj)
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                return str.join("&");
             },
             data: {
                'email':user.email,
                'password':user.password,
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'grant_type': 'client_credentials'
             },
             headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
             url: url
           }).then(function successCallback(response) {
             console.log(response);
             userDetails = {
                 accessToken: response.data.access_token,
                 hostel:response.data.hostel,
                 name:response.data.name,
                 email: response.data.email,
                 id:response.data.id,
                 role:response.data.role
             };
             $window.localStorage.userDetails = JSON.stringify(userDetails);
             deferred.resolve(userDetails);
           }, function errorCallback(error) {
             deferred.reject(error);
         });
         return deferred.promise;
    };

    function logout() {
        var deferred = $q.defer();
        $http({
            method: "POST",
            url: URL_PREFIX+"logout/",
            headers: {
              'Content-Type': 'application/json; charset=UTF-8',
              'Authorization':'Bearer '+userDetails.accessToken
            }
        }).then(function (result) {
            // console.log(result);
            userDetails = null;
            $window.localStorage.userDetails = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    function getuserDetails() {
        return userDetails;
    }
    function init() {
        if ($window.localStorage.userDetails) {
            userDetails = JSON.parse($window.localStorage.userDetails);
        }
    }
    init();
    return {
        login: login,
        logout: logout,
        getuserDetails: getuserDetails
    };
}]);
