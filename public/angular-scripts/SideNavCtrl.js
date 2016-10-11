angular.module('agence').controller('SideNavCtrl',['$scope', '$location', 'Consultor', 'consultorService', '$mdSidenav', '$mdUtil', function($scope, $location, Consultor, consultorService, $mdSidenav, $mdUtil) {
    $scope.consultores = consultorService.getValues();
    $scope.toggleLeft = buildToggler('left');

/**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
          },300);
      return debounceFn;
    }

    $scope.getConsultores = function(){
      $location.url('/consultor');
      $scope.closeSideNav();
    };
   
   $scope.closeSideNav = function () {
      $mdSidenav('left').close();
   };

   $scope.getBookDetails = function(id, $event){
    console.log(id);
   };


}])

