app.controller('DashCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $window, $mdDialog) {
  var CONTENT_TYPE='application/json; charset=UTF-8';
  // cheking if user is authenticated. If authenticated than parse accessToken
  if (Auth.getuserDetails().accessToken!==undefined){
    var AUTHORIZATION='Bearer '+Auth.getuserDetails().accessToken;
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
      console.log($scope.meals);
    }, function errorCallback(error) {
      console.log(error);
    });
  };
  // don't worry  if you modify this function and remove if condition
  // you are still not able to get the user list.
  if ($scope.userDetails.role.admin || $scope.userDetails.role.supervisior) {
    $http({
      url:URL_PREFIX+"api/users/",
      method:"GET",
      headers:{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization':AUTHORIZATION
      }
    }).then(function sucessCallback(response) {
      $scope.users=response.data;
      console.log($scope.users);
    }, function errorCallback(error) {
      console.log(error);
    });
  }
  $scope.propertyName = 'created';
  $scope.reverse = true;
  $scope.sortBy = function(propertyName) {
    $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
    $scope.propertyName = propertyName;
  };
  $scope.userPropertyName = 'created';
  $scope.userReverse = true;
  $scope.sortByUser = function(userPropertyName) {
    $scope.userReverse = ($scope.userPropertyName === userPropertyName) ? !$scope.userReverse : false;
    $scope.userPropertyName = userPropertyName;
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
  $scope.modifyUser = function(ev, user) {
    $mdDialog.show({
      controller: function ($mdDialog, $scope) {
                 var vm = this;
                 vm.currentUser = {};
                 vm.currentUser = user;  //your task object from the ng-repeat
                 $scope.hide = function () {
                   $mdDialog.hide();
                 };
                 $scope.cancel = function () {
                   $mdDialog.cancel();
                 };
                 $scope.updateUser = function (user) {
                   $http({
                     url:URL_PREFIX+"api/users/",
                     method:"PUT",
                     headers:{
                       'Content-Type': 'application/json; charset=UTF-8',
                       'Authorization':AUTHORIZATION
                     },
                     data:user
                   }).then(function sucessCallback(response) {
                    //  console.log(response);
                      $scope.hide();
                      $scope.cancel();
                      $mdToast.show(
                        $mdToast.simple()
                        .textContent('Updated sucessfully!')
                        .position('bottom right')
                        .hideDelay(3000)
                      );
                   }, function errorCallback(error) {
                    //  console.log(error);
                   });
                 };
             },
      controllerAs: 'modal',
      templateUrl: 'templates/user.edit.html',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
    })
    .then(function(answer) {
    }, function() {
    });
  };

});
