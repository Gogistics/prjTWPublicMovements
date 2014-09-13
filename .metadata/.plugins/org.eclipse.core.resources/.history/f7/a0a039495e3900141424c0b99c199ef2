/* 
 * init ng-app
 * PS: I really appreciate all the contributions; without these contributions, it's impossible to implement the application in two weeks
 * The version is just for Demo purpose and not optimized yet, especially the async. features so please feel free to modify the project in anyways
 * 
 * */
// ng version is contributed by 保哥 and modified by Alan Tai
// Integrated with Google App Engine, the $interpolateProvider should change; the startSymbol and endSymbol should be changed to avoid the symbols of jinja2 template and consistent 


// financial type filter
angular.module('kp_api_filters', []).filter('financial_type', function() {
  return function(input) {
    return input == "income" ? "收入" : "支出" ;
  };
});


var kp_app = angular.module('unlimited_kp_app', ['ngRoute', 'kp_api_filters'], function($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
});