import angular from 'angular';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import Bluebird from 'bluebird';
Bluebird.longStackTraces();
import _indexOf from 'lodash.indexof';
import _remove from 'lodash.remove';

import view from './view';

//====================================================================

export default angular.module('xoWebApp.scheduler', [
  uiRouter,
  uiBootstrap
])
  .config(function ($stateProvider) {
    $stateProvider.state('scheduler', {
      url: '/scheduler',
      controller: 'SchedulerCtrl as scheduler',
      template: view,
    });
  })
  .controller('SchedulerCtrl', function ($scope, $state, $stateParams, xo, xoApi, notify) {

    this.selectMinute = function (minute) {

      if (this.isSelectedMinute(minute)) {
        _remove(this.formData.minSelect, v => v === minute);
      } else {
        this.formData.minSelect.push(minute);
      }

    };

    this.isSelectedMinute = function (minute) {

      return _indexOf(this.formData.minSelect, minute) > -1;

    };

    this.selectHour = function (hour) {

      if (this.isSelectedHour(hour)) {
        _remove(this.formData.hourSelect, v => v === hour);
      } else {
        this.formData.hourSelect.push(hour);
      }

    };

    this.isSelectedHour = function (hour) {

      return _indexOf(this.formData.hourSelect, hour) > -1;

    };

    this.selectDay = function (day) {

      if (this.isSelectedDay(day)) {
        _remove(this.formData.daySelect, v => v === day);
      } else {
        this.formData.daySelect.push(day);
      }

    };

    this.isSelectedDay = function (day) {

      return _indexOf(this.formData.daySelect, day) > -1;

    };

    this.selectMonth = function (month) {

      if (this.isSelectedMonth(month)) {
        _remove(this.formData.monthSelect, v => v === month);
      } else {
        this.formData.monthSelect.push(month);
      }

    };

    this.isSelectedMonth = function (month) {

      return _indexOf(this.formData.monthSelect, month) > -1;

    };

    this.selectDayWeek = function (dayWeek) {

      if (this.isSelectedDayWeek(dayWeek)) {
        _remove(this.formData.dayWeekSelect, v => v === dayWeek);
      } else {
        this.formData.dayWeekSelect.push(dayWeek);
      }

    };

    this.isSelectedDayWeek = function (dayWeek) {

      return _indexOf(this.formData.dayWeekSelect, dayWeek) > -1;

    };

    this.update = function () {

      let d = this.formData;

      let i = (d.min === 'all' && '*') ||
        (d.min === 'range' && ('*/' + d.minRange)) ||
        (d.min === 'select' && this._listArray(d.minSelect)) ||
        '*';

      let h = (d.hour === 'all' && '*') ||
        (d.hour === 'range' && ('*/' + d.hourRange)) ||
        (d.hour === 'select' && this._listArray(d.hourSelect)) ||
        '*';

      let dm = (d.day === 'all' && '*') ||
        (d.day === 'select' && this._listArray(d.daySelect)) ||
        '*';

      let m = (d.month === 'all' && '*') ||
        (d.month === 'select' && this._listArray(d.monthSelect)) ||
        '*';

      let dw = (d.dayWeek === 'all' && '*') ||
        (d.dayWeek === 'select' && this._listArray(d.dayWeekSelect)) ||
        '*';

      this.formData.cronPattern = i + ' ' + h + ' ' + dm + ' ' + m + ' ' + dw;
      this.summarize();

    };

    this.summarize = function () {

      let d = this.formData;

      console.log(d);

      let i = (d.min === 'all' && ', every minute') ||
        (d.min === 'range' && ('every ' + d.minRange + ' minutes')) ||
        (d.min === 'select' && ' on minutes ' + this._listArray(d.minSelect)) ||
        '*';

      let h = ((d.hour === 'all' && d.min === 'all') && ' ') ||
        (d.hour === 'all' && ' of every hour') ||
        (d.hour === 'range' && ('every ' + d.hourRange + ' hours')) ||
        (d.hour === 'select' && ' on hours ' + this._listArray(d.hourSelect)) ||
        '*';

      let dm = ((d.day === 'all' && d.month === 'all') && ' ') ||
        (d.day === 'all' && 'every day') ||
        (d.day === 'select' && (' on days ' + this._listArray(d.daySelect))) ||
        '*';

      let m = ((d.month === 'all' && d.day === 'all') && ' ') ||
        (d.month === 'all' && ' of every month ') ||
        (d.month === 'select' && ' of ' + this._listArray(d.monthSelect)) ||
        '*';

      let dw = (d.dayWeek === 'all' && ' ') ||
        (d.dayWeek === 'select' && (' on ' + this._listArray(d.dayWeekSelect + ' only'))) ||
        '*';

      this.formData.summary = dm + ' ' + m + ' ' + i + ' ' + h + ' ' + dw;

    };

    this._listArray = function (arr) {

      let list = (arr[0] && String(arr[0])) || '';

      for (let i = 1; i < arr.length; i++) {
        list += (',' + arr[i]);
      }

      return list;

    };

    xoApi.call('system.getMethodsInfo')
    .then(response => {

      var actions = [];

      for (let actionName in response) {

        let action = {};

        let index = actionName.indexOf('.');
        action.method = actionName;
        action.group = actionName.substring(0, index);
        action.command = actionName.substring(index + 1);
        action.info = response[actionName];

        /*for (let paramName in response[actionName].params) {

          let dest = response[actionName].params[paramName].optional ? 'options' : 'params';
          action[dest][paramName] = response[actionName].params[paramName].type;

        }*/

        actions.push(action);

      }

      this.actions = actions;

    });

    let i, j;
    this.minutes = [];
    for (i = 0; i < 6; i++) {
      this.minutes[i] = [];
      for (j = 0; j < 10; j++) {
        this.minutes[i].push(10 * i + j);
      }
    }
    this.hours = [];
    for (i = 0; i < 3; i++) {
      this.hours[i] = [];
      for (j = 0; j < 8; j++) {
        this.hours[i].push(8 * i + j);
      }
    }
    this.days = [];
    for (i = 0; i < 4; i++) {
      this.days[i] = [];
      for (j = 1; j < 8; j++) {
        this.days[i].push(7 * i + j);
      }
    }
    this.days.push([29,30,31]);

    this.months = [
      [
        {v: 1, l: 'Jan'},
        {v: 2, l: 'Feb'},
        {v: 3, l: 'Mar'},
        {v: 4, l: 'Apr'},
        {v: 5, l: 'May'},
        {v: 6, l: 'Jun'}
      ],
      [
        {v: 7, l: 'Jul'},
        {v: 8, l: 'Aug'},
        {v: 9, l: 'Sep'},
        {v: 10, l: 'Oct'},
        {v: 11, l: 'Nov'},
        {v: 12, l: 'Dec'}
      ]
    ];

    this.dayWeeks = [
      {v: 0, l: 'Sun'},
      {v: 1, l: 'Mon'},
      {v: 2, l: 'Tue'},
      {v: 3, l: 'Wed'},
      {v: 4, l: 'Thu'},
      {v: 5, l: 'Fri'},
      {v: 6, l: 'Sat'}
    ];

    this.formData = {
      minRange: 5,
      hourRange: 2,
      minSelect: [],
      hourSelect: [],
      daySelect: [],
      monthSelect: [],
      dayWeekSelect: [],
      min: 'all',
      hour: 'all',
      day: 'all',
      month: 'all',
      dayWeek: 'all',
      cronPattern: '* * * * *'
    };

    this.update();

  })

  // A module exports its name.
  .name
;
