(function (angular) {
  // Config
  angular.module('angularFormatNumber.config', []).value('angularFormatNumber.config', {debug: true});
  // Modules
  angular.module('angularFormatNumber.directives', []);
  angular.module('angularFormatNumber', ['angularFormatNumber.config','angularFormatNumber.directives']);

  /**
   * Directive that allow to format number input
   */
  var app = angular.module('angularFormatNumber');
  app.directive('formatNumber', ['$filter', function ($filter) {
    return {
      require: '?ngModel',
      link: function (scope, elem, attrs, ctrl) {
        if (!ctrl) return;

        ctrl.$formatters.unshift(function () {
          return $filter('number')(ctrl.$modelValue);
        });

        ctrl.$parsers.unshift(function (viewValue) {
          var number = viewValue.replace(/[^\d|\-+|\.+]/g, '');
          elem.val($filter('number')(number));

          /**
           * We try to make some validation if necessary (min, max)
           */
          if (attrs.hasOwnProperty('min')) {
            ctrl.$setValidity('min', number > parseInt(attrs.min));
          }

          if (attrs.hasOwnProperty('max')) {
            ctrl.$setValidity('max', number > parseInt(attrs.min));
          }

          return number;
        });
      }
    };
  }]);
})(angular);
