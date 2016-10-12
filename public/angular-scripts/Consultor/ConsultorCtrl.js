  angular.module('agence')
  .controller('ConsultorCtrl',['$scope', 'Consultor','consultorService', '$q', '$timeout','$mdDialog','$mdMedia', '$filter', '$location', function($scope, Consultor, consultorService, $q, $timeout, $mdDialog, $mdMedia, $filter, $location){
    
        $scope.bar = {};
        $scope.pie = {};
        var pendingSearch, cancelSearch = angular.noop;
        var cachedQuery, lastSearch;
        $scope.consultor = [];
        $scope.conEnviado = [];
        $scope.filterSelected = true;
        $scope.querySearch = querySearch;
        $scope.desde = new Date('2007-01-02');
        $scope.hasta = new Date('2008-01-01');
        $scope.delayedQuerySearch = delayedQuerySearch;

        $scope.cssStyle = "height:500px; width:80%;display: block;margin: 0 auto;";

        Consultor.consultor.get(function(data){
          consultorService.getConsultores(data);
          $scope.consultores=data.consultores;
          $scope.allContacts = $scope.loadContacts();
        });

        $scope.loadContacts = function () {
         var contacts = $scope.consultores;
         return contacts.map(function (c, index) {
           var contact = {
             name: c.no_usuario,
             email: c.no_email,
             image: '/img/account_circle_black.png',
             user: c.co_usuario
           };
           contact._lowername = contact.name.toLowerCase();
           return contact;
         });
       };
        
      function querySearch (criteria) {
            cachedQuery = cachedQuery || criteria;
            return cachedQuery ? $scope.allContacts.filter(createFilterFor(cachedQuery)) : [];
      };

       function delayedQuerySearch(criteria) {
         cachedQuery = criteria;
         if ( !pendingSearch || !debounceSearch() )  {
           cancelSearch();

           return pendingSearch = $q(function(resolve, reject) {
             cancelSearch = reject;
             $timeout(function() {

               resolve( $scope.querySearch() );

               refreshDebounce();
             }, Math.random() * 500, true)
           });
         }

         return pendingSearch;
       };

       function refreshDebounce() {
         lastSearch = 0;
         pendingSearch = null;
         cancelSearch = angular.noop;
       };

       function debounceSearch() {
         var now = new Date().getMilliseconds();
         lastSearch = lastSearch || now;
         return ((now - lastSearch) < 300);
       };

       function createFilterFor(query) {
         var lowercaseQuery = angular.lowercase(query);

         return function filterFn(contact) {
           return (contact._lowername.indexOf(lowercaseQuery) != -1);;
         };

       };
       $scope.cancel = function() {
         $mdDialog.cancel();
       };
       $scope.calcTotal = function(field){
            var sum = 0;
            angular.forEach($scope.conReport, function(value, key){
              for(var i = 0 ; i<value.length ; i++){
                 sum = sum + value[i][field];
              }
            });
            return sum;
       };
        $scope.showReport = function(ev) {
          $scope.conReport = {};
          $scope.conEnviado = [];
          $scope.consultoresr = $scope.consultor.map(function(c) {
              $scope.conEnviado.push(c);
              c = "'"+c.user+"'";
              return c;
          });
          Consultor.reporte.save({ users: $scope.consultoresr, from:$scope.desde, to:$scope.hasta }, function(data){
              $scope.title = data.title;
              $scope.relatorio = data.result;
              for(var i=0; i<$scope.conEnviado.length; i++) {
                var array = [];
                for(var j=0; j<$scope.relatorio.length; j++) {
                    if($scope.conEnviado[i].user === $scope.relatorio[j].co_usuario) {
                        var index = array.push($scope.relatorio[j]);
                    }
                }
                if (array.length >0){
                $scope.conReport[$scope.conEnviado[i].name] = array;
                }
              }
          });
          $mdDialog.show({
             templateUrl: '/angular-views/report.html',
             parent: angular.element(document.body),
             targetEvent: ev,
             scope: $scope.$new(),
             clickOutsideToClose:false,
             fullscreen: true
          });
        };

        $scope.showBarGraph = function(ev) {
            $scope.data = [];
            $scope.conEnviado = [];
            $scope.data = ['mes'];
            $scope.consultoresr = $scope.consultor.map(function(c) {
              $scope.conEnviado.push(c.user);
              $scope.data.push(c.name);
              c = "'"+c.user+"'";
              return c;
            });
            Consultor.bar.save({ users: $scope.consultoresr, from:$scope.desde, to:$scope.hasta }, function(data){
              $scope.title = data.title;
              $scope.barg = data.result;
              var monthLabels = ["Ene", "Feb", "Mar","Abr", "May", "Jun", "Jul", "Ago", "Sep","Oct", "Nov", "Dic"],
                  meses = [[], [], [], [], [], [], [], [], [], [], [], []],
                  listaAgrupados = [],
                  mediaArray = [],
                  media = 0,
                  ser;
              for (var i = 0; i < $scope.barg.length; i++) {
                 if (mediaArray.indexOf($scope.barg[i].nuser) === -1){
                  mediaArray.push($scope.barg[i].nuser);
                  media = media + parseInt($scope.barg[i].custoFM);
                 }
              }
              media = media / $scope.consultoresr.length;
              $scope.data.push('Costo Fijo Medio');
              var ser = $scope.data.indexOf('Costo Fijo Medio') -1;
              
              for (var i = 0; i < $scope.conEnviado.length; i++) {
                var found = $scope.barg.some(function (el) { return el.nuser === $scope.conEnviado[i]; });
                for (var j = 0; j < meses.length; j++) {
                  var valMes = 0;                  
                    if(found){
                      valMes = $.grep($scope.barg, function(e){ return e.mesN == j + 1 && e.nuser == $scope.conEnviado[i]; });
                        if (valMes.length > 0){
                          meses[j].push(valMes[0].Receita_liquida);
                        }else{
                          meses[j].push(0);
                        }
                    }else{
                      meses[j].push(0);
                    }
                }
              }
              
              for (var i = 0; i < meses.length; i++) {
                  if (meses[i].length) {
                    meses[i].unshift(monthLabels[i]);
                    listaAgrupados.push(meses[i]);
                      meses[i].push(media);
                  }
              }
              listaAgrupados.unshift($scope.data);
              if (listaAgrupados.length == 1){
                $scope.ceros = []
                for (var i =0; i < $scope.data.length; i++) {                  
                  $scope.ceros.push(0);
                }
                listaAgrupados.push($scope.ceros);
              }
              $scope.bar.type = "ComboChart";
              $scope.bar.data = listaAgrupados;
              console.log(listaAgrupados);
              $scope.bar.options = {
                  title : 'Performance Comercial',
                  vAxis: {viewWindow: {max: 32000},
                          viewWindow: {max: 32000}
                         },
                  seriesType: 'bars',
                  series: {
                           0: {targetAxisIndex:0},
                           1: {targetAxisIndex:1}
                          },
                  legend:'bottom',
              };
              $scope.bar.options.series[ser] = {type : "line"};
            });
           $mdDialog.show({
             templateUrl: '/angular-views/bar.html',
             parent: angular.element(document.body),
             targetEvent: ev,
             scope: $scope.$new(),
             clickOutsideToClose:false,
             fullscreen: true
           });
        };

        $scope.showPieGraph = function(ev) {
            $scope.consultoresr = $scope.consultor.map(function(c) {
              $scope.conEnviado.push(c);
              c = "'"+c.user+"'";
              return c;
            });
            Consultor.pie.save({ users: $scope.consultoresr, from:$scope.desde, to:$scope.hasta }, function(data){
              $scope.title = data.title;
              $scope.resPie = data.result;
              $scope.pien = [];
              $scope.pien.push(['Consultor', 'total']);
              for(var i=0; i<$scope.resPie.length; i++) {
                $scope.pien.push([$scope.resPie[i].nombre, $scope.resPie[i].Receita_liquida]);              
              }
              $scope.pie.type = "PieChart";
              $scope.pie.data = $scope.pien;
              $scope.pie.options = {
                  title : 'Participacao na receita',
                  displayExactValues: true,
                  is3D: true,
              };
              $scope.pie.formatters = {
                number : [{
                  columnNum: 1,
                  pattern: "R$ #,##0.00"
                }]
              };
            });
           $mdDialog.show({
             templateUrl: '/angular-views/pie.html',
             parent: angular.element(document.body),
             targetEvent: ev,
             scope: $scope.$new(),
             clickOutsideToClose:false,
             fullscreen: true
           });
        };
  }])
  .config(function($mdDateLocaleProvider) {
      $mdDateLocaleProvider.formatDate = function(date) {
          return date ? moment(date).format('YYYY-MM-DD') : '';
      };

  });
