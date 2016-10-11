angular.module('agence').service('Consultor', ['$resource', function($resource){
return {
   consultor: $resource('/consultor', null, {
   	'query': { method:'GET', isArray: true }
   }),
   reporte: $resource('/reporte', null, {
   	'query': { method:'POST', isArray: true }
   }),
   bar: $resource('/bar', null, {
   	'query': { method:'POST', isArray: true }
   }),
   pie: $resource('/pie', null, {
   	'query': { method:'POST', isArray: true }
   })
};
}]);