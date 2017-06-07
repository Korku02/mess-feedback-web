app.controller('DashCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $window) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  if (Auth.getuserDetails().accessToken!==undefined){
    var AUTHORIZATION='Bearer '+Auth.getuserDetails().accessToken;
    console.log(AUTHORIZATION);
    console.log(Auth.getuserDetails());
  }
  $scope.userDetails = JSON.parse($window.localStorage.userDetails);
  $scope.getMealData=function () {
    $http({
      url:URL_PREFIX+"api/meal/",
      method:"GET",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      }
    }).then(function sucessCallback(response) {
      $scope.meals=response.data;
    }, function errorCallback(error) {
      console.log(error);
    });
  };
  $scope.propertyName = 'created';
  $scope.reverse = true;
  $scope.sortBy = function(propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };
  $scope.logOut = function () {
    Auth.logout().then(function (result) {
        // $location.path("/");
        localStorage.clear();
        $window.location.reload();
        $mdToast.show(
          $mdToast.simple()
          .textContent('User logout sucessfully!')
          .position('bottom right')
          .hideDelay(3000)
        );
    }, function (error) {
      if (error.status=401) {
        console.log("Unauthorized");
        $window.localStorage.userDetails= null;
        $window.location.reload();
      }
    });
  };
  $scope.getMealData();
});
