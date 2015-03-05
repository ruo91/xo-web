import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Bluebird from 'bluebird';

import view from './view';

//====================================================================

export default angular.module('xoWebApp.scheduler', [
  uiRouter
])
  .config(function ($stateProvider) {
    $stateProvider.state('scheduler', {
      url: '/scheduler',
      controller: 'SchedulerCtrl as scheduler',
      template: view,
    });
  })
  .controller('SchedulerCtrl', function ($scope, $state, $stateParams, xo, xoApi, notify) {

  })

  // A module exports its name.
  .name
;
