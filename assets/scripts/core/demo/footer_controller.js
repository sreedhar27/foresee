var foreseeDemo = angular.module('foreseeDemo');
function footerController($scope){
	$scope.angVersion = angular.version;

}

foreseeDemo.controller("footerController",footerController);