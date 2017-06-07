var app = angular.module('app', ['ngMaterial','ngAnimate','ngRoute']);

var URL_PREFIX = 'http://localhost:8080/';
var CLIENT_ID='HHszEvPWQg4Y0X88aAdslmjMqXEiQsnPp3gEInnI';
var CLIENT_SECRET='F1GsPWUJhoCkQ0DdAsh1VHaaT6p5Hs0NMD2JjxGuYgR01pYMOHHRBDhjgNUd46d26wjlN5lkXBM9ychYMwUTrVG0mcE9gRUZ4aXRjxozCGWqfNIiyzmOvmBnZnKptU9Z';

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
  }).when("/signup", {
    controller: "MainCtrl",
    templateUrl: "templates/signup.html"
  }).when("/dashboard", {
    controller: "MainCtrl",
    templateUrl: "templates/dashboard.html",
    resolve: {
        auth: function ($q, Auth) {
            var userInfo = Auth.getUserInfo();
            if (userInfo) {
                return $q.when(userInfo);
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
    $rootScope.$on("$routeChangeSuccess", function (userInfo) {
        // console.log(userInfo);
    });
    $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
        if (eventObj.authenticated === false) {
            $location.path("/");
        }
    });
}]);
app.factory("Auth", ["$http","$q","$window",function ($http, $q, $window) {
    var userInfo;
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
             userInfo = {
                 accessToken: response.data.access_token,
                 email: response.data.email,
                 hostel:response.data.hostel,
                 name:response.data.name,
                 id:response.data.id
             };
             $window.localStorage["userInfo"] = JSON.stringify(userInfo);
             deferred.resolve(userInfo);
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
              'Authorization':'Bearer '+userInfo.accessToken
            }
        }).then(function (result) {
            // console.log(result);
            userInfo = null;
            $window.localStorage["userInfo"] = null;
            deferred.resolve(result);
        }, function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    function getUserInfo() {
        return userInfo;
    }
    function init() {
        if ($window.localStorage["userInfo"]) {
            userInfo = JSON.parse($window.localStorage["userInfo"]);
        }
    }
    init();
    return {
        login: login,
        logout: logout,
        getUserInfo: getUserInfo
    };
}]);
