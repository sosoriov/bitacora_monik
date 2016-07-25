'use strict';

import { ALL_DATA } from '../data/patterns';

angular.module('app')
  .controller("DashboardCtrl", ['$scope', function ($scope) {

    $scope.patterns = [];
    $scope.data = {};
    $scope.formData = {};

    function getPatternNames() {
      _.forEach(ALL_DATA, function (pattern) {
        var tmpPattern = _.pick(pattern, 'name');
        // adding the pattern to the scope
        $scope.patterns.push(tmpPattern['name']);
      })
    }

    getPatternNames();


    $scope.display = function (currentItem) {
      if (_.isUndefined($scope.currentPattern.selectedTrade) || _.isUndefined(currentItem)) {
        return true;
      }

      if ($scope.currentPattern.selectedTrade in currentItem) {
        if (currentItem[$scope.currentPattern.selectedTrade] == true) {
          return true;
        } else {
          return false;
        }
      }
      return true;
    }

    $scope.cleanPattern = function () {
      var patternKeys = ["validation", "zone", "confirmation", "probabilities", "Adhesion", "Stop Loss", "Trailing Stop Loss", "Target"];

      _.forEach(patternKeys, key => {
        _.forEach($scope.currentPattern[key], function (opt, k) {
          $scope.currentPattern[key][k]["value"] = false;
          $scope.currentPattern[key][k]["comments"] = "";
        });
      });

      $scope.currentPattern['selectedTrade'] = '';
      $scope.currentPattern['generalComments'] = '';

    }

    $scope.currentPattern = {};
    $scope.findPattern = function (patternName: string) {
      let filtered = _.filter(ALL_DATA, (p, i) => {
        if (p['name'] == patternName) {
          return p;
        }
      });

      $scope.currentPattern = filtered[0];
    }



    $scope.submit = function () {
      console.log("submiting ----");
      console.log($scope.formData.items);
    }





  }]);
