var foreseeDemo = angular.module('foreseeDemo',['ngRoute','ngResource', 'ui.bootstrap','foresee']);
angular.module('foreseeDemo').run(function($rootScope){
	$rootScope.hideHeader = false;
	$rootScope.year = new Date().getFullYear();
	$rootScope.errors=[{type:'info',msg:'Test alert'}];
	$rootScope.colorScheme='green';
}).factory('$exceptionHandler', function ($window) {
    return function (exception, cause) {
        console.log(exception.message);
    };
}).config(['$httpProvider', function($httpProvider) {
	var interceptor = ['$q', '$location', '$rootScope','$window', function ($q, $location, $rootScope,$window) {
        function success(response) {
            return response;
        }

        function error(response) {
            var status = response.status;
            if (status == 401) {
                $window.location.reload();
            }
            return $q.reject(response);
        }

        return function (promise) {
            return promise.then(success, error);
        };
    }];
    $httpProvider.interceptors.push(interceptor);
  }]);
;

function foreseeDemoController($scope){
	$scope.angVersion = angular.version.full;
	$scope.chartData = [
                        {"x1": 1,  "y1": 28}, {"x1": 2,  "y1": 55},
                        {"x1": 3,  "y1": 43}, {"x1": 4,  "y1": 91},
                        {"x1": 5,  "y1": 81}, {"x1": 6,  "y1": 53},
                        {"x1": 7,  "y1": 19}, {"x1": 8,  "y1": 87},
                        {"x1": 9,  "y1": 52}, {"x1": 10, "y1": 48},
                        {"x1": 11, "y1": 24}, {"x1": 12, "y1": 49},
                        {"x1": 13, "y1": 87}, {"x1": 14, "y1": 66},
                        {"x1": 15, "y1": 17}, {"x1": 16, "y1": 27},
                        {"x1": 17, "y1": 68}, {"x1": 18, "y1": 16},
                        {"x1": 19, "y1": 49}, {"x1": 20, "y1": 15}
                      ];
}

foreseeDemo.controller("foreseeDemoController", foreseeDemoController);