angular.module('app.directives', [])

    .directive('focusMe', function($timeout) {
        return {
            scope: { trigger: '=focusMe' },
            link: function(scope, element) {
                scope.$watch('trigger', function(value) {
                    if (value === true) {
                        //console.log('trigger',value);
                        //$timeout(function() {
                        element[0].focus();
                        scope.trigger = false;
                        //});
                    }
                });
            }
        };
    })


    .directive('cActivate', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                element.bind("click", function(e) {
                    angular.element(document.querySelector(".footerBtn")).find("h5").removeClass("underlined");
                    if (attrs.cActivate == "logo") {
                        angular.element(document.querySelector("#toolbar")).find("h5").removeClass("underlined");
                    } else {
                        angular.element(document.querySelector("#" + attrs.cActivate)).find("h5").removeClass("underlined");
                        element.addClass("underlined");
                    }
                });
            }
        }
    })

    .directive('fileInput', function($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attributes) {
                element.bind('change', function() {
                    $parse(attributes.fileInput).assign(scope, element[0].files[0]);
                    scope.$apply();
                });
            }
        };
    });