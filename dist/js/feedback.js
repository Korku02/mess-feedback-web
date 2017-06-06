app.controller('MainCtrl', function($scope,$document,$http,$location) {

$scope.hostels = [
                  "Nilgiri",
                  "Karakoram",
                  "Aravali",
                  "Jwalamukhi",
                  "Kumaon",
                  "Vindhyachal",
                  "Shivalik",
                  "Zanskar",
                  "Satpura",
                  "Udaigiri",
                  "Girnar",
                  "Kailash",
                  "Himadiri"
            ];



            $scope.projectSubmit=function (project) {
              console.log(project);
              var client_id;
              var client_secret;
              $http({
                url:"http://10.194.24.86:8080/api/register/",
                method:"POST",

                headers:{
                      'Content-Type': 'application/json; charset=UTF-8'
                },
              data:{
                      // 'client_id':"96QMY9Sfo31Bz3XEt4GVzD8Ur6gEq2DpDhevTHBl",
                      // 'client_secret':"avWCCb6A6ZDQODW1aJvlfLKsiycg6RYlw4nHzDL7B3EBveIUWqV3kJROkFHjgzzqCVZ9syqYsHll7iMrIMcbSOmEKT2Xr47a2f93Vo49k6EFF8HI7eBkGfO3EBGyvt34",
                      // 'grant_type':"client_credentials",
                      'user_name':project.username,
                      'user_id':project.userid.toUpperCase(),
                      'user_hostel':project.hostel,
                      'email':project.email,
                      'password':project.password
                    }
              }).then(function sucessCallback(response) {
                console.log(response);
              }, function errorCallback(error) {
                console.log(error);
              });

            };


});
