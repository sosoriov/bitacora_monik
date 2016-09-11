'use strict';

import { ALL_DATA } from '../data/patterns';

declare var firebase: any;

var config = {
  apiKey: "AIzaSyCxIOPJmGcrftfSWrvoUDrD1BqAuxAxYZ8",
  authDomain: "monik-45103.firebaseapp.com",
  databaseURL: "https://monik-45103.firebaseio.com",
  storageBucket: "monik-45103.appspot.com",
};
var fapp = firebase.initializeApp(config);

angular.module('app')
  .controller("DashboardCtrl", ['$scope', '$firebaseObject',
                                '$firebaseArray', 'NgTableParams',
                                function ($scope, $firebaseObject, $firebaseArray, NgTableParams) {

    $scope.patterns = {};
    $scope.data = {};
    $scope.formData = {};
    $scope.trades = {};
    $scope.selectedPatternName = "";

    $scope.patternsData = {};
    $scope.tradesData = {};
    $scope.validationsData = {};
    $scope.confirmationsData = {};
    $scope.zonesData = {};
    $scope.probData = {};
    $scope.stopLossData = {};
    $scope.trailingStopLossData = {};
    $scope.targetsData = {};
    $scope.adhesionData = {};
    $scope.myTradesData = {};

    $scope.currentPattern = {};
    $scope.currentTrades = {};
    $scope.currentValidations = {};
    $scope.currentConfirmations = {};
    $scope.currentZones = {};
    $scope.currentProb = {};
    $scope.currentStopLoss = {};
    $scope.currentTrailStopLoss = {};
    $scope.currentTargets = {};
    $scope.currentAdhesion = {};

    $scope.myTradesTable = new NgTableParams({ sorting: { trade_date: "desc" } });

    var patternsRef = firebase.database().ref().child("patterns");
    var tradesRef = firebase.database().ref().child("trades");
    var validationsRef = firebase.database().ref().child("validations");
    var confirmationsRef = firebase.database().ref().child("confirmations");
    var zonesRef = firebase.database().ref().child("zones");
    var probabilitiesRef = firebase.database().ref().child("probabilities");
    var stopLossRef = firebase.database().ref().child("stop_loss");
    var trailingStopLossRef = firebase.database().ref().child("trailing_stop_loss");
    var targetRef = firebase.database().ref().child("targets");
    var adhesionRef = firebase.database().ref().child("adhesion");
    var myTradesRef = firebase.database().ref().child("my_trades");
    // download the data into a local object
    var patternsObj = $firebaseArray(patternsRef);
    var tradesObj = $firebaseArray(tradesRef);
    var validationObj = $firebaseArray(validationsRef);
    var confirmationsObj = $firebaseArray(confirmationsRef);
    var zonesObj = $firebaseArray(zonesRef);
    var probabilitiesObj = $firebaseArray(probabilitiesRef);
    var stopLossObj = $firebaseArray(stopLossRef);
    var trailingStopLossObj = $firebaseArray(trailingStopLossRef);
    var targetObj = $firebaseArray(targetRef);
    var adhesionObj = $firebaseArray(adhesionRef);
    var myTradesObj = $firebaseArray(myTradesRef);

    function getPatternNames() {
      _.forEach($scope.patternsData, function (pattern) {
        console.log("pattern    ", pattern);

        var tmpPattern = _.pick(pattern, 'name');
        // adding the pattern to the scope
        $scope.patterns[pattern['$id']] = tmpPattern['name'];
      })
    }


    $scope.display = function (currentItem) {
      if (!_.isUndefined(currentItem[$scope.selectedPatternName])) {
        return currentItem[$scope.selectedPatternName];
      } else {
        console.warn("The selected trade does not exist in the current item");
        return false;
      }
      // if (_.isUndefined($scope.currentPattern.selectedTrade) || _.isUndefined(currentItem)) {
      //   return true;
      // }

      // if ($scope.currentPattern.selectedTrade in currentItem) {
      //   if (currentItem[$scope.currentPattern.selectedTrade] == true) {
      //     return true;
      //   } else {
      //     return false;
      //   }
      // }
      // return true;
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


    $scope.getSelectedPatternName = function (patternName: string) {
      if (!_.isUndefined($scope.currentPattern.selectedTrade)) {
        $scope.selectedPatternName = patternName.toLocaleLowerCase();
      } else {
        $scope.selectedPatternName = "";
      }
    }

    function findPattern(patternId: string) {
      let filtered = _.filter($scope.patternsData, (p, i) => {
        if (p['$id'] == patternId) {
          return p;
        }
      });

      $scope.currentPattern = filtered[0];

      return filtered[0];
    }

    function findTrade(tradeId: string) {
      let filtered = _.filter($scope.tradesData, (t, i) => {
        if (t['$id'] == tradeId) {
          return t;
        }
      });

      return filtered[0];
    }

    function findPatternTrades(patternId: string) {
      let filtered = _.filter($scope.tradesData, (trade, i) => {
        if (trade['pattern_key'] == patternId) {
          return trade;
        }
      });

      $scope.currentTrades = filtered;
    }



    /**
     * 
     * 
     * @param {string} patternId
     * @param {string} scopeData: scope property where firebase data is stored
     * @param {string} scopeProperty: new scope property which contains the data for the selected pattern
     * @returns
     */
    function findCurrentPatternData(patternId: string, scopeData: string, scopeProperty: string) {
      if (_.isUndefined($scope[scopeData])) {
        return;
      }

      let filtered = _.filter($scope[scopeData], (item, i) => {
        if (item['pattern_key'] == patternId) {
          return item;
        }
      });
      $scope[scopeProperty] = filtered;
    }


    $scope.getAllPatternInfo = function (patternId: string) {
      findPattern(patternId);
      findCurrentPatternData(patternId, "tradesData", "currentTrades");
      findCurrentPatternData(patternId, "validationsData", "currentValidations");
      findCurrentPatternData(patternId, "confirmationsData", "currentConfirmations");
      findCurrentPatternData(patternId, "zonesData", "currentZones");
      findCurrentPatternData(patternId, "probData", "currentProb");
      findCurrentPatternData(patternId, "stopLossData", "currentStopLoss");
      findCurrentPatternData(patternId, "trailingStopLossData", "currentTrailStopLoss");
      findCurrentPatternData(patternId, "targetsData", "currentTargets");
      findCurrentPatternData(patternId, "adhesionData", "currentAdhesion");
    }



    $scope.submit = function () {
      // TODO: add comments, date and additional info to the final trade.
      var validations = getItemsToSave($scope.currentValidations);
      var trades = getItemsToSave($scope.currentTrades);
      var conf = getItemsToSave($scope.currentConfirmations);
      var zones = getItemsToSave($scope.currentZones);
      var prob = getItemsToSaveProbabilities($scope.currentProb);
      var stopLoss = getItemsToSave($scope.currentStopLoss);
      var trailStopLoss = getItemsToSave($scope.currentTrailStopLoss);
      var targets = getItemsToSave($scope.currentTargets);
      var adhesiones = getItemsToSave($scope.currentAdhesion);

      var comments = $scope.currentPattern['generalComments'] || "";

      var finalData = {
        "validations": _.toPlainObject(validations),
        "confirmations": _.toPlainObject(conf),
        "zones": _.toPlainObject(zones),
        "trailing_stop_loss": _.toPlainObject(trailStopLoss),
        "stop_loss": _.toPlainObject(stopLoss),
        "targets": _.toPlainObject(targets),
        "adhesion": _.toPlainObject(adhesiones),
        "trade": $scope.currentPattern['selectedTrade'],
        "pattern": $scope.currentPattern['$id'],
        "probabilities": _.toPlainObject(prob),
        "comments": comments,
        "trade_date": new Date().getTime()
      }

      console.log(finalData);

      // saving into the database
      myTradesRef.push(finalData);
      
      debugger

      updateMyTradesInfo();
    }

    function getItemsToSave(propertyToSave) {
      if (_.isUndefined(propertyToSave)) {
        return [];
      }

      let filtered = _.filter(propertyToSave, (item, i) => {
        if (item['value'] == true) {
          return item;
        }
      });

      // get only the id.
      return _.map(filtered, i => { return i["$id"] });
    }

    function getItemsToSaveProbabilities(propertyToSave) {
      if (_.isUndefined(propertyToSave)) {
        return [];
      }

      debugger

      let filtered = _.filter(propertyToSave, (item, i) => {
        if (item['value'] == true) {
          return item;
        }
      });

      // get only the id.
      return _.map(filtered, i => {
         return {
           "id": i["$id"],
           "prob_comments": i["comments"]
         } 
      });
    }


    // loading data asyncronously from Firebase
    patternsObj.$loaded().then(function (patternsData) {
      $scope.patternsData = patternsData;
      getPatternNames();
    });

    tradesObj.$loaded().then(function (trades) {
      $scope.tradesData = trades;
    });

    validationObj.$loaded().then(function (validations) {
      $scope.validationsData = validations;
    });

    confirmationsObj.$loaded().then(function (confirmations) {
      $scope.confirmationsData = confirmations;
    });

    targetObj.$loaded().then(function (targets) {
      $scope.targetsData = targets;
    });

    zonesObj.$loaded().then(function (zones) {
      $scope.zonesData = zones;
    });

    probabilitiesObj.$loaded().then(function (prob) {
      $scope.probData = prob;
    });

    stopLossObj.$loaded().then(function (stop) {
      $scope.stopLossData = stop;
    });

    trailingStopLossObj.$loaded().then(function (stop) {
      $scope.trailingStopLossData = stop;
    });

    adhesionObj.$loaded().then(function (adhesion) {
      $scope.adhesionData = adhesion;
    });

    /**
     * Transform Ids into human readable information
     * all the information is already in the client, so this function filters on it 
     * based on the key retrieved from the DB.
     * 
     * @param {any} items
     * @param {any} itemName
     * @param {any} collectionName
     * @param {any} patternKey
     * @returns
     */
    function returnItemFromDB(items, itemName, collectionName, patternKey ) {
      var results = [];
      _.forEach(items[itemName], item => {
        var myItem = _.find($scope[collectionName], function(i) {
          return i["pattern_key"] == patternKey &&  i["$id"] == item;
        })
        results.push(myItem);
      })

      return results;
    }

    function returnItemFromDB2(items, itemName, collectionName, patternKey ) {
      var results = [];
      debugger
      _.forEach(items[itemName], item => {
        var myItem = _.find($scope[collectionName], function(i) {
          return i["pattern_key"] == patternKey &&  i["$id"] == item['id'];
        })

        myItem["prob_comments"] = item['prob_comments']
        results.push(myItem);
      })

      return results;
    }


    function updateMyTradesInfo() {
      myTradesObj.$loaded().then(function (myTrades) {
        console.log("trades -----------", myTrades);

        var myTradeResponse = _.map(myTrades, i => {
          if (_.isUndefined(i["pattern"])) {
            return {};
          }
          var customVal = returnItemFromDB(i, "validations", "validationsData", i['pattern']);
          var customConf = returnItemFromDB(i, "confirmations", "confirmationsData", i['pattern']);
          var customZones = returnItemFromDB(i, "zones", "zonesData", i['pattern']);
          var customProb = returnItemFromDB2(i, "probabilities", "probData", i['pattern']);
          var customStopLoss = returnItemFromDB(i, "stop_loss", "stopLossData", i['pattern']);
          var customTrailStopLoss = returnItemFromDB(i, "trailing_stop_loss", "trailingStopLossData", i['pattern']);
          var customTargets = returnItemFromDB(i, "targets", "targetsData", i['pattern']);
          var customAdhesion = returnItemFromDB(i, "adhesion", "adhesionData", i['pattern']);
          var patternInfo = findPattern(i["pattern"]);
          var tradeInfo = findTrade(i["trade"]);

          return {
            "$id": i["$id"],
            "validations": customVal,
            "confirmations": customConf,
            "zones": customZones,
            "trailing_stop_loss": customTrailStopLoss,
            "stop_loss": customStopLoss,
            "targets": customTargets,
            "adhesion": customAdhesion,
            "probabilities": customProb,
            "pattern": patternInfo,
            "trade": tradeInfo,
            "comments": i["comments"],
            "trade_date": i['trade_date']

          }

        })

        $scope.myTradesData = myTradeResponse;
        $scope.myTradesTable.settings({
          dataset: myTradeResponse
        });

      });
    }

    updateMyTradesInfo();










  }]);
