'use strict'

angular.module('xoWebApp', [
  'ngCookies',
  'ngSanitize',
  'ngRoute'
])
  .filter 'bytes', ->
    (size, unit, base) ->
      unit ?= 'B'
      base ?= 1024
      powers = ['', 'K', 'M', 'G', 'T', 'P']

      i = 0
      while size > base
        size /= base
        ++i

      # Maximum 1 decimals.
      size = ((size * 10)|0) / 10

      return "#{size}#{powers[i]}B"
  .config ($routeProvider) ->
    $routeProvider
      .when '/',
        templateUrl: 'views/main.html'
        controller: 'MainCtrl'
      .otherwise
        redirectTo: '/'
