/* 
 * Angular - Shift8 demo/documentation app.
 */
angular.module('demoApp', ['shift8.bootstrap.form'], function($locationProvider) {
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
		FirstName: {
			type: 'text',
			label: 'First Name',
			placeholder: 'John'
		},
		LastName: {
			type: 'text',
			label: 'Last Name',
			placeholder: 'Doe'
		},
		Email: {
			label: 'E-mail',
			placeholder: 'jdoe@example.com',
			helpBlock: '<small>Some help text here...Which can be inline or block by passing <code>help-block</code> or <code>help-inline</code></small>'
		},
		SelectTest: {
			label: 'Select Field',
			options: {'0800-1000': {"option": "8AM - 10PM"}, '1000-1200': {"option": "10AM - Noon"}, '1200-1400': {option: "Noon - 2PM"}}
		}
	};

};

