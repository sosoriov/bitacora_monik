'use strict'

// declare var angular:any;

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.
angular.module('app').controller('TradeCtrl', function ($scope, $uibModalInstance, modalData) {
    $scope.modalData = angular.copy(modalData);

    $scope.ok = function () {

        // //updating shared object
        // nuxeoData.setData(scopeData);
        // sharedDoc.expenses = angular.copy($scope.modalData.expenses)
        // sharedDoc.totals['expenses'] = _.map(scopeData, 'expenses_total_value_wpp')
        // nuxeoData.setDoc(sharedDoc);

        // $uibModalInstance.close($scope.modalData);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };


});