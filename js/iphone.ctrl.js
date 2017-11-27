app.controller('IphoneCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $rootScope) {

  var client = new ClientJS();

  var curr_os = client.getOS();

  console.log(curr_os);

  $scope.ratings = ["1.0","1.5","2.0","2.5","3.0","3.5","4.0","4.5","5.0","5.5"];

  $scope.submitRating = function(data) {
    console.log("bro");
  }


});
