angular.module('agence').service('consultorService', [ function() {

    var isLoaded = false;
    var map = {};

    this.getConsultores = function(values) {
        map = {};
        angular.forEach(values.consultores, function(value){
            map[value.bookId] = value;
        });
        isLoaded = true;
    };

    this.getReporte = function(values) {
        map = {};
        angular.forEach(values.consultores, function(value){
            map[value.bookId] = value;
        });
        isLoaded = true;
    };

    this.getBar = function(values) {
        map = {};
        angular.forEach(values.consultores, function(value){
            map[value.bookId] = value;
        });
        isLoaded = true;
    };

    this.setValue = function(id, value) {
        map[id] = value;
        isLoaded = true;
    };

    this.deleteValue = function(id) {
        delete map[id];
    };

    this.getValues = function() {
        return map;
    };

    this.getValue = function(id) {
        return map[id];
    };

    this.isLoaded = function(){
        return isLoaded;
    };

} ]);

