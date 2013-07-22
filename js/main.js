/* 
 * Angular - Shift8 demo/documentation app.
 */
angular.module('demoApp', ['ui', 'ui.jq', 'ui.bootstrap', 'ui.validate', 'shift8.bootstrap.form'], function($locationProvider) {
	$locationProvider.hashPrefix('');
	// Make code pretty
	window.prettyPrint && prettyPrint();
}).directive('scrollto', [function() {
	return function(scope, elm, attrs) {
		elm.bind('click', function(e) {
			e.preventDefault();
			if (attrs.href) {
				attrs.scrollto = attrs.href;
			}
			var top = $(attrs.scrollto).offset().top;
			$('body,html').animate({
				scrollTop: top
			}, 800);
		});
	};
}]);


var MainCtrl = function($scope, $element) {

	// TODO: Move this to another controller and setup routes in the future as more sections are added.
	$scope.DemoFormSchema = {
		Name: {
			type: 'text',
			label: 'Your Name'
		},
		Email: {
			label: 'E-mail',
			helpBlock: '<small>Some help text here...Which can be inline or block by defining <code>help-block</code> or <code>help-inline</code> attributes.</small>'
		},
		Colors: {
			label: 'Select A Color',
			options: {"red": {"option": "Red"}, 'blueGreen': {"option": "Blue Green"}, 'blue': {"option": "Blue"}}
		}
	};
	
	$scope.validate = {
		email: function(val) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(val);
		}
	};

};

