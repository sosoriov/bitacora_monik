'use strict';

/**
 * @ngdoc overview
 * @name app
 * @description
 * # app
 *
 * Main module of the application.
 */

angular
    .module('app', ['ngAnimate', 'ngRoute', 'ngSanitize', 'ui.bootstrap', 'firebase', 'ngTable', 'ngMessages'])
    .config(function($routeProvider, $httpProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/dashboard.html',
                controller: 'DashboardCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });

        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });


//Import controllers, services, directives
// import "./template_assets/core.ts";
// import "./template_assets/site.ts";
import "./controllers/dashboard_ctrl.ts";
// import "./controllers/runs_dashboard_ctrl.ts";
