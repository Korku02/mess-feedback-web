app.controller('VerificationCtrl', function($scope, $mdToast, $document, $http, $location, Auth, $rootScope) {

VERIFY_URL_PREFIX = 'http://127.0.0.1:8080/verifyemail?email_token=';
$scope.getMsg = function(){
  if($location.search().email_token){
    var email_token = $location.search().email_token;
    $http.get(VERIFY_URL_PREFIX+email_token)
      .then(function(response) {
          $scope.verificationMsg = response.data.response;
          console.log(response);
      },
      function errorCallback(error) {
            $scope.verificationMsg = error.data.error;
            console.log("bro");
          });

  }
  else{
    $scope.verificationMsg = "Error 404";
  }
}







});
