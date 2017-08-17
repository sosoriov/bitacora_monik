"use strict";

import { ALL_DATA } from "../data/patterns";

declare var firebase: any;
declare var alertify: any;

var config = {
  apiKey: "AIzaSyCxIOPJmGcrftfSWrvoUDrD1BqAuxAxYZ8",
  authDomain: "monik-45103.firebaseapp.com",
  databaseURL: "https://monik-45103.firebaseio.com",
  storageBucket: "monik-45103.appspot.com"
};
var fapp = firebase.initializeApp(config);

angular.module("app").controller("DashboardCtrl", [
  "$scope",
  "$route",
  "$firebaseObject",
  "$firebaseArray",
  "NgTableParams",
  function($scope, $route, $firebaseObject, $firebaseArray, NgTableParams) {
    $scope.patterns = {};
    $scope.data = {};
    $scope.formData = {};
    $scope.trades = {};
    $scope.selectedPatternName = "";
    $scope.displayDataLoader = true;

    $scope.patternsData = {};
    $scope.pairsData = {};
    $scope.timeFrameData = {};
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

    function initCurrentStates() {
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
      // by default assign compra as initial trade
      $scope.currentPattern.tradeName = "compra";

      debugger
      $scope.currentPattern.generalComments = "";
      $scope.currentPattern.selectedPair = "";
      $scope.currentPattern.selectedTimeframe = "";
      $scope.currentPattern.riskPercentage = "";
    }

    initCurrentStates();

    $scope.myTradesTable = new NgTableParams({
      sorting: { trade_date: "desc" }
    });

    var patternsRef = firebase.database().ref().child("patterns");
    var tradesRef = firebase.database().ref().child("trades");
    var validationsRef = firebase.database().ref().child("validations");
    var confirmationsRef = firebase.database().ref().child("confirmations");
    var zonesRef = firebase.database().ref().child("zones");
    var probabilitiesRef = firebase.database().ref().child("probabilities");
    var stopLossRef = firebase.database().ref().child("stop_loss");
    var trailingStopLossRef = firebase
      .database()
      .ref()
      .child("trailing_stop_loss");
    var targetRef = firebase.database().ref().child("targets");
    var adhesionRef = firebase.database().ref().child("adhesion");
    var myTradesRef = firebase.database().ref().child("my_trades");
    var pairsRef = firebase.database().ref().child("pairs");
    var timeframeRef = firebase.database().ref().child("timeframes");

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
    var pairsObj = $firebaseArray(pairsRef);
    var timeFrameObj = $firebaseArray(timeframeRef);

    function getPatternNames() {
      _.forEach($scope.patternsData, function(pattern) {
        console.log("pattern    ", pattern);

        var tmpPattern = _.pick(pattern, "name");
        // adding the pattern to the scope
        $scope.patterns[pattern["$id"]] = tmpPattern["name"];
      });
    }

    $scope.display = function(currentItem) {
      if (!_.isUndefined(currentItem[$scope.selectedPatternName])) {
        return currentItem[$scope.selectedPatternName];
      } else {
        console.warn("The selected trade does not exist in the current item");
        return false;
      }
    };

    $scope.cleanPattern = function() {
      var patternKeys = [
        "validation",
        "zone",
        "confirmation",
        "probabilities",
        "Adhesion",
        "Stop Loss",
        "Trailing Stop Loss",
        "Target"
      ];

      _.forEach(patternKeys, key => {
        _.forEach($scope.currentPattern[key], function(opt, k) {
          $scope.currentPattern[key][k]["value"] = false;
          $scope.currentPattern[key][k]["comments"] = "";
        });
      });

      $scope.currentPattern["selectedTrade"] = "";
      $scope.currentPattern["generalComments"] = "";
    };

    $scope.getSelectedPatternName = function(tradeId: string) {
      if (!_.isUndefined($scope.currentPattern.selectedTrade)) {
        var selectedTrade = findTrade(tradeId);
        $scope.selectedPatternName = selectedTrade["label"].toLocaleLowerCase();
        //updating the trade name in the scope
        $scope.currentPattern.tradeName = selectedTrade[
          "label"
        ].toLocaleLowerCase();
      } else {
        $scope.selectedPatternName = "";
      }
    };

    function findPattern(patternId: string) {
      let filtered = _.filter($scope.patternsData, (p, i) => {
        if (p["$id"] == patternId) {
          return p;
        }
      });

      $scope.currentPattern = filtered[0];

      return filtered[0];
    }

    function findTrade(tradeId: string) {
      let filtered = _.filter($scope.tradesData, (t, i) => {
        if (t["$id"] == tradeId) {
          return t;
        }
      });

      return filtered[0];
    }

    function findPair(pairId: string) {
      let filtered = _.filter($scope.pairsData, (t, i) => {
        if (t["$id"] == pairId) {
          return t;
        }
      });

      return filtered[0];
    }

    function findTimeframe(timeframeId: string) {
      let filtered = _.filter($scope.timeFrameData, (t, i) => {
        if (t["$id"] == timeframeId) {
          return t;
        }
      });

      return filtered[0];
    }

    function findPatternTrades(patternId: string) {
      let filtered = _.filter($scope.tradesData, (trade, i) => {
        if (trade["pattern_key"] == patternId) {
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
    function findCurrentPatternData(
      patternId: string,
      scopeData: string,
      scopeProperty: string
    ) {
      if (_.isUndefined($scope[scopeData])) {
        return;
      }

      let filtered = _.filter($scope[scopeData], (item, i) => {
        if (item["pattern_key"] == patternId) {
          return item;
        }
      });

      var clonedProperty = _.cloneDeep($scope[scopeProperty]);

      $scope[scopeProperty] = filtered;
    }

    $scope.getAllPatternInfo = function(patternId: string) {
      findPattern(patternId);
      findCurrentPatternData(patternId, "tradesData", "currentTrades");
      findCurrentPatternData(
        patternId,
        "validationsData",
        "currentValidations"
      );
      findCurrentPatternData(
        patternId,
        "confirmationsData",
        "currentConfirmations"
      );
      findCurrentPatternData(patternId, "zonesData", "currentZones");
      findCurrentPatternData(patternId, "probData", "currentProb");
      findCurrentPatternData(patternId, "stopLossData", "currentStopLoss");
      findCurrentPatternData(
        patternId,
        "trailingStopLossData",
        "currentTrailStopLoss"
      );
      findCurrentPatternData(patternId, "targetsData", "currentTargets");
      findCurrentPatternData(patternId, "adhesionData", "currentAdhesion");
      // $scope.currentPattern.tradeName = "compra";
    };

    $scope.submit = function() {
      $scope.displayDataLoader = true;
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

      var comments = $scope.currentPattern["generalComments"] || "";
      var riskPercentage = $scope.currentPattern["riskPercentage"] || "";
      var stopLossPips = $scope.currentPattern["stopLossPips"] || 0;
      var targetPips = $scope.currentPattern["targetPips"] || 0;

      debugger;
      console.log("stop lossss", stopLoss);

      var finalData = {
        validations: _.toPlainObject(validations),
        confirmations: _.toPlainObject(conf),
        zones: _.toPlainObject(zones),
        trailing_stop_loss: _.toPlainObject(trailStopLoss),
        stop_loss: _.toPlainObject(stopLoss),
        targets: _.toPlainObject(targets),
        adhesion: _.toPlainObject(adhesiones),
        trade: $scope.currentPattern["selectedTrade"],
        pattern: $scope.currentPattern["$id"],
        pair: $scope.currentPattern["selectedPair"],
        timeframes: $scope.currentPattern["selectedTimeframe"],
        probabilities: _.toPlainObject(prob),
        comments: comments,
        risk: riskPercentage,
        trade_date: new Date().getTime(),
        stop_loss_pips: stopLossPips,
        target_pips: targetPips
      };

      try {
        if (_.isUndefined($scope.currentPattern.operationId)) {
          // saving into the database
          myTradesRef.push(finalData);
        } else {
          // update existing
          var updates = {};
          updates[$scope.currentPattern.operationId] = finalData;
          myTradesRef.update(updates);
        }

        updateMyTradesInfo();

        alertify.success("Your data has been saved.");

        $route.reload();
        // initCurrentStates();

        _.map($scope.validationsData, (i, k) => {
          if (!_.isUndefined(i["value"])) {
            // $scope.validationsData[k]['value'] = false;
          }

          $scope.displayDataLoader = false;
        });
      } catch (error) {
        alertify.error("An error has been occurred.");
        $scope.displayDataLoader = false;
        throw error;
      }
    };

    function getItemsToSave(propertyToSave) {
      if (_.isUndefined(propertyToSave)) {
        return [];
      }

      let filtered = _.filter(propertyToSave, (item, i) => {
        if (item["value"] == true) {
          return item;
        }
      });

      // get only the id.
      return _.map(filtered, i => {
        return i["$id"];
      });
    }

    function getItemsToSaveProbabilities(propertyToSave) {
      if (_.isUndefined(propertyToSave)) {
        return [];
      }

      let filtered = _.filter(propertyToSave, (item, i) => {
        if (item["value"] == true) {
          return item;
        }
      });

      // get only the id.
      return _.map(filtered, i => {
        return {
          id: i["$id"],
          prob_comments: i["comments"]
        };
      });
    }

    // loading data asyncronously from Firebase
    var itemsFromDb = [];
    var readListener;
    patternsObj.$loaded().then(function(patternsData) {
      $scope.patternsData = patternsData;
      getPatternNames();

      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    tradesObj.$loaded().then(function(trades) {
      $scope.tradesData = trades;
      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    validationObj.$loaded().then(function(validations) {
      $scope.validationsData = validations;
      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    confirmationsObj.$loaded().then(function(confirmations) {
      $scope.confirmationsData = confirmations;
      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    targetObj.$loaded().then(function(targets) {
      $scope.targetsData = targets;
      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    zonesObj.$loaded().then(function(zones) {
      $scope.zonesData = zones;
      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    probabilitiesObj.$loaded().then(function(prob) {
      $scope.probData = prob;
      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    stopLossObj.$loaded().then(function(stop) {
      $scope.stopLossData = stop;
      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    trailingStopLossObj.$loaded().then(function(stop) {
      $scope.trailingStopLossData = stop;
      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    adhesionObj.$loaded().then(function(adhesion) {
      $scope.adhesionData = adhesion;
      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    pairsObj.$loaded().then(function(pairsData) {
      $scope.pairsData = pairsData;
      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    timeFrameObj.$loaded().then(function(timeFrameData) {
      $scope.timeFrameData = timeFrameData;
      readListener = $scope.$emit("getting_data", itemsFromDb.push(true));
    });

    $scope.$on("getting_data", function(event, data) {
      // all items have been read
      if (itemsFromDb.length == 12) {
        updateMyTradesInfo();
        $scope.displayDataLoader = false;
      }
    });

    // $scope $destroy
    $scope.$on("$destroy", readListener);

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
    function returnItemFromDB(items, itemName, collectionName, patternKey) {
      var results = [];
      _.forEach(items[itemName], item => {
        var myItem = _.find($scope[collectionName], function(i) {
          return i["pattern_key"] == patternKey && i["$id"] == item;
        });
        results.push(myItem);
      });

      return results;
    }

    function returnItemFromDB2(items, itemName, collectionName, patternKey) {
      var results = [];
      _.forEach(items[itemName], item => {
        var myItem = _.find($scope[collectionName], function(i) {
          return i["pattern_key"] == patternKey && i["$id"] == item["id"];
        });

        myItem["prob_comments"] = item["prob_comments"];
        results.push(myItem);
      });

      return results;
    }

    function updateMyTradesInfo() {
      myTradesObj.$loaded().then(function(myTrades) {
        console.log("trades -----------", myTrades);

        var myTradeResponse = _.map(myTrades, i => {
          if (_.isUndefined(i["pattern"])) {
            return {};
          }
          var customVal = returnItemFromDB(
            i,
            "validations",
            "validationsData",
            i["pattern"]
          );
          var customConf = returnItemFromDB(
            i,
            "confirmations",
            "confirmationsData",
            i["pattern"]
          );
          var customZones = returnItemFromDB(
            i,
            "zones",
            "zonesData",
            i["pattern"]
          );
          var customProb = returnItemFromDB2(
            i,
            "probabilities",
            "probData",
            i["pattern"]
          );
          var customStopLoss = returnItemFromDB(
            i,
            "stop_loss",
            "stopLossData",
            i["pattern"]
          );
          var customTrailStopLoss = returnItemFromDB(
            i,
            "trailing_stop_loss",
            "trailingStopLossData",
            i["pattern"]
          );
          var customTargets = returnItemFromDB(
            i,
            "targets",
            "targetsData",
            i["pattern"]
          );
          var customAdhesion = returnItemFromDB(
            i,
            "adhesion",
            "adhesionData",
            i["pattern"]
          );
          var patternInfo = findPattern(i["pattern"]);
          var tradeInfo = findTrade(i["trade"]);
          var timeframe = findTimeframe(i["timeframes"]);
          var pair = findPair(i["pair"]);

          return {
            $id: i["$id"],
            validations: customVal,
            confirmations: customConf,
            zones: customZones,
            trailing_stop_loss: customTrailStopLoss,
            stop_loss: customStopLoss,
            targets: customTargets,
            adhesion: customAdhesion,
            probabilities: customProb,
            pattern: patternInfo,
            trade: tradeInfo,
            comments: i["comments"],
            risk: i["risk"],
            pair: pair,
            timeframes: timeframe,
            trade_date: i["trade_date"],
            stop_loss_pips: i["stop_loss_pips"],
            target_pips: i["target_pips"]
          };
        });

        $scope.myTradesData = myTradeResponse;
        $scope.myTradesTable.settings({
          dataset: myTradeResponse
        });
      });
    }

    $scope.editOperation = function(operationId, patternId) {
      console.log("operationId", operationId);
      console.log("pattern ID", patternId);

      $scope.getAllPatternInfo(patternId);

      var operationInfo = findOperation(operationId);
      console.log(operationInfo);

      $scope.formData.selectedPattern = patternId;
      findPatternTrades(patternId);
      $scope.currentPattern.operationId = operationId;
      $scope.currentPattern.selectedTrade = operationInfo["trade"]["$id"];
      $scope.currentPattern.selectedPair = operationInfo["pair"]["$id"];
      $scope.currentPattern.selectedTimeframe = operationInfo["timeframes"]["$id"];
      $scope.currentPattern.riskPercentage = operationInfo["risk"];
      $scope.currentPattern.generalComments = operationInfo["comments"];
      $scope.getSelectedPatternName(operationInfo["trade"]["$id"]);

      // selectPair(operationInfo["pair"]);
      selectValidations(operationInfo["validations"]);
      selectConfirmations(operationInfo["confirmations"]);
      selectZones(operationInfo["zones"]);
      selectProbs(operationInfo["probabilities"]);
      selectStopLoss(operationInfo["stop_loss"]);
      selectTrailingStopLoss(operationInfo["trailing_stop_loss"]);
      selectTargets(operationInfo["targets"]);
      selectAdhesion(operationInfo["adhesion"]);
    };

    function findOperation(operationId) {
      return _.find($scope.myTradesData, { $id: operationId });
    }

    function selectValidations(validations) {
      _.forEach(validations, i => {
        _.forEach($scope.currentValidations, (sVal, k) => {
          if (i["$id"] == sVal["$id"]) {
            $scope.currentValidations[k]["value"] = true;
          }
        });
      });
    }

    function selectConfirmations(confirmations) {
      _.forEach(confirmations, i => {
        _.forEach($scope.currentConfirmations, (sVal, k) => {
          if (i["$id"] == sVal["$id"]) {
            $scope.currentConfirmations[k]["value"] = true;
          }
        });
      });
    }

    function selectZones(zones) {
      _.forEach(zones, i => {
        _.forEach($scope.currentZones, (sVal, k) => {
          if (i["$id"] == sVal["$id"]) {
            $scope.currentZones[k]["value"] = true;
          }
        });
      });
    }

    function selectProbs(probs) {
      _.forEach(probs, i => {
        _.forEach($scope.currentProb, (sVal, k) => {
          if (i["$id"] == sVal["$id"]) {
            $scope.currentProb[k]["value"] = true;
            $scope.currentProb[k]["comments"] = i["prob_comments"];
          }
        });
      });
    }

    function selectStopLoss(stops) {
      _.forEach(stops, i => {
        _.forEach($scope.currentStopLoss, (sVal, k) => {
          if (i["$id"] == sVal["$id"]) {
            $scope.currentStopLoss[k]["value"] = true;
          }
        });
      });
    }

    function selectTrailingStopLoss(stops) {
      _.forEach(stops, i => {
        _.forEach($scope.currentTrailStopLoss, (sVal, k) => {
          if (i["$id"] == sVal["$id"]) {
            $scope.currentTrailStopLoss[k]["value"] = true;
          }
        });
      });
    }

    function selectTargets(targets) {
      _.forEach(targets, i => {
        _.forEach($scope.currentTargets, (sVal, k) => {
          if (i["$id"] == sVal["$id"]) {
            $scope.currentTargets[k]["value"] = true;
          }
        });
      });
    }

    function selectAdhesion(adhesiones) {
      _.forEach(adhesiones, i => {
        _.forEach($scope.currentAdhesion, (sVal, k) => {
          if (i["$id"] == sVal["$id"]) {
            $scope.currentAdhesion[k]["value"] = true;
          }
        });
      });
    }
  }
]);
