/* 
 * Angular.js form directives for use with Twitter Bootstrap.
 * 
 * Twitter Bootstrap has a specific HTML format for forms and form fields.
 * These directives make it a simple one liner in many cases.
 * 
 * Then for bonus points, there are additional directives that make building
 * form wizards a breeze.
 * 
 * @author Tom Maiaroto, Shift8Creative
 * @email tom@shift8creative.com
 */

angular.module('shift8.bootstrap.form', [])
	.value('bootstrapFormConfig', {
	})
	// FORM DIRECTIVES
	.directive('bField', function (bootstrapFormConfig, $compile, $http, $location) {
		return {
			priority: 50,
			require: 'ngModel',
			restrict: 'E',
			replace: true,
			scope: true,
			link: function ($scope, $element, $attrs, ngModel) {
				// All directives must have an ng-model attribute.
				if(!ngModel) return;
				
				var formElement = 'input';
				var template = 'text.html';
				switch($attrs.type) {
					case 'input':
					case 'text':
						formElement = 'input';
						template = 'text.html';
						break;
					default:
						formElement = $attrs.type;
						template = $attrs.type + '.html';
						break;
					case 'radio':
						formElement = 'input';
						template = 'radio.html';
						break;
					
				}
				
				var modelName = $attrs.ngModel;
				$scope.modelName = modelName;
				
				// The form templates directory will be within the module directory where this script is.
				var scriptEls = document.getElementsByTagName( 'script' );
				var scriptDir = '';
				for(var i=0; i < scriptEls.length; i++) {
					var scriptMatch = /.*modules\/bootstrap\/form\.js/;
					if(scriptMatch.test(scriptEls[i].src)) {
						var scriptPath = scriptEls[i].src;
						scriptDir = scriptPath.substr(0, scriptPath.lastIndexOf( '/' )+1 );
					}
				}
				// If specifically set in either the <b-form> or individual <b-field> directive use that base path instead.
				$scope.templateBasePath = ($scope.$parent.templateBasePath !== undefined) ? $scope.$parent.templateBasePath:scriptDir + 'form-templates/';
				$scope.templateBasePath = ($attrs.templateBasePath !== undefined) ? $attrs.templateBasePath:$scope.templateBasePath;
				
				// Render the template. Note: if $compile is not used, then there's no Angular.js magic and the HTML is just output plain.
				$http.get($scope.templateBasePath + template).then(function(result){
					$scope.templateHtml = result.data;
					$element.html($scope.templateHtml);
					
					// Set ng-model on the form element.
					//$element.contents().find(formElement).attr('ng-model', modelName);
					
					// Pass most attributes to the input... (it is important not to pass "type" and "value" here.)
					// Both type and value are set in the template and must be set in any custom template replacement.
					for(i in $attrs.$attr) {
						if(i !== 'type' && i !== 'value' && i !== 'label' && i !== 'help' && i !== 'helpClass' && i !== 'errorClass') {
							// If it's a radio, the HTML still uses <input>, but we don't want to assign multiple id values which are all the same.
							if($attrs.type === 'radio') {
								if(i !== 'id') {
									$element.contents().find(formElement).attr($attrs.$attr[i], $attrs[i]);
								}
							} else {
								$element.contents().find(formElement).attr($attrs.$attr[i], $attrs[i]);
							}
						}
					}
					
					// Specifically for select lists...
					if($scope.emptyOption !== undefined) {
						var selected = ($scope.value === undefined || $scope.value == '' || $scope.value === null) ? true:false;
						$element.contents().find('select').prepend('<option value="" ng-selected="' + selected + '">{{emptyOption}}</option>');
					}
					if($attrs.multiple !== undefined) {
						// Allow "ng-click" attribute to override this...The user should know to either tack on clickMultiSelect() or understand
						// that validation may not happen, but the "ng-pristine" class will be removed.
						if($attrs.ngClick === undefined) {
							$element.contents().find('select').attr('ng-click', 'clickMultiSelect();');
						}
					}
					
					// Append and prepend the passed values (which can include HTML). This way the template doesn't neeed to assume what gets passed.
					// Plus, the structure of the template changes based on whether or not anything has been appended/prepended.
					// The wrapper div is non existent if nothing is appended/prepended.
					// The values could be as simple as <span class="add-on">Some text</span> or can be more complex and include buttons, dropdowns, etc.
					// See Twitter Bootstrap documentation for more.
					if($scope.prepend !== undefined || $scope.append !== undefined || $scope.inputWrapperClass !== undefined) {
						$element.contents().find(formElement).wrap('<div class="input-wrapper {{inputWrapperClass}}">');
						$element.contents().find('.input-wrapper').prepend($scope.prepend);
						$element.contents().find('.input-wrapper').append($scope.append);
					}
					
					// Not sure how this gets here...But clean it up.
					if($scope.$form !== undefined && $scope.$form['{{name}}'] !== undefined) {
						$scope.$form['{{name}}'] = undefined;
					}
					
					$compile($element.contents())($scope);
				});
				
				// Set some values in the $scope from the $attrs...This way they can be used in templates.
				// However, all attributes should be passed along to the input element (see above).
				// So templates shouldn't need to set any attributes on the <input> element (except the type).
				// By default the input name will be the model name.
				$scope.name = $attrs.ngModel;
				// ...But allow the input name to be different than the model name.
				$scope.name = ($attrs.name !== undefined) ? $attrs.name:$scope.name;
				$scope.id = $attrs.id;
				$scope.placeholder = $attrs.placeholder;
				$scope.value = $attrs.value;
				$scope.label = $attrs.label;
				$scope.helpClass = $attrs.helpClass;
				$scope.help = $attrs.help;
				$scope.controlGroupClass = $attrs.controlGroupClass;
				$scope.errorClass = ($attrs.errorClass !== undefined) ? $attrs.errorClass:'help-inline';
				$scope.prepend = $attrs.prepend;
				$scope.append = $attrs.append;
				// Twitter Bootstrap "inline" class which is used for radio options, checkboxes, etc.
				$scope.inline = ($attrs.inline !== undefined) ? 'inline':'';
				
				// Shortcuts for help text. So you don't need to defined both "help-class" and "help"
				if($attrs.helpInline !== undefined) {
					$scope.helpClass = 'help-inline';
					$scope.help = $attrs.helpInline;
				}
				if($attrs.helpBlock !== undefined) {
					$scope.helpClass = 'help-block';
					$scope.help = $attrs.helpBlock;
				}
				
				// Set the wrapper class to include "input-prepend" and "input-append" if prepend and/or append attributes were specified.
				if($scope.prepend !== undefined) {
					$scope.inputWrapperClass = 'input-prepend';
				}
				if($scope.append !== undefined) {
					$scope.inputWrapperClass = ($scope.inputWrapperClass !== undefined) ? $scope.inputWrapperClass + ' input-append':'input-append';
				}
				
				// Allow the wrapper class to be set specifically. May come in handy.
				if($attrs.inputWrapperClass !== undefined) {
					$scope.inputWrapperClass = $attrs.inputWrapperClass;
				}
				
				// Ensure the input field has a name attribute set...Again, using the model name as the default value, but accepting other values.
				$element.attr('name', $scope.name);
				
				// Bring the form generated from the b-form directive into this $scope under something consistent ("$form") since the name value can be anything.
				$scope.$form = $scope.$parent[$scope.$parent.formName];
				// Also set the $formSchema if a schema attribute was passed to the parent b-form directive.
				$scope.$formSchema = $scope.$parent.formSchema;
				
				$scope.pristine = true;
				
				// Set the initial model value. If not set, then any validation will appear invalid until the input changes by the user.
				$scope[modelName] = $scope.value;
				
				// -------------------
				// FOR SELECT FIELDS
				// -------------------
				// For select fields...Which are a pain in the ass with Angular.
				// The default "ng-options" attribute will be: select as value.option group by value.group for (key, value) in inputOptions
				// Which works with the following format: {"M": {"option": "Choose Male", "group": "Gender"}, "F": {"option": "Choose Female", "group": "Gender"}}
				// Essentially, the select <option> value attribute is each key in the object. Then we have each value in the object which is an object itself.
				// First, it holds the "option" which is the friendly label the user sees in the select drop down. Then it can optionally have the "group" key.
				// Of course the "group" key's value will be used for the <optgroup> label attribute value. This can be mix and match. So some values could belong
				// to groups while others do not.
				// 
				// ALWAYS try to set the "options" attribute this way for your own sanity.
				// IF you need to, or aren't right in the head, set your own ng-options attribute. It will override the one in the select.html template.
				// Just be warned, it is not convention nor easy.
				// 
				// For example, this would work:
				// <b-field type='select' empty="--" ng-options="value for (key, value) in inputOptions" options='{"0800-1000": "8 AM - 10 AM", "1000-1200": " 10 AM - Noon"}' label="A select now" ng-model='Time' required></b-field>
				// Again, note that the "options" attribute becomes $scope.inputOptions... You could set the options in your controller somewhere instead for even more flexibility.
				// You are not restricted, but I do advise sticking to some sort of convention.
				// 
				// Default selected option? In the options, add an additional key to the value "selected":true
				// ex. {"M": {"option": "Choose Male", "group": "Gender", "selected": true}, "F": {"option": "Choose Female", "group": "Gender"}}
				// 
				// Empty option? You don't need to define that in ng-options...It can be: <b-field type="select" empty="--choose one--"
				if($attrs.options !== undefined) {
					try {
						$scope.inputOptions = angular.fromJson($attrs.options);
					} catch(e) {
						throw new TypeError('b-field "options" attribute was not a valid JSON string. Ensure attributes are wrapped in double quotes, ie. options=\'{"foo":"bar"}\'.');
					}
				}
				// If "checked" was set instead of "selected" turn it into "selected" for convention.
				for(i in $scope.inputOptions) {
					if($scope.inputOptions[i].checked !== undefined) {
						$scope.inputOptions[i].selected = true;
					}
				}
				$scope.emptyOption = $attrs.empty;
				
				// Select an option...If we don't, we'll have an undefined <option>
				var selectInitialOption = function() {
					// If the options specified an option with a truthy "selected" key
					for(i in $scope.inputOptions) {
						if($scope.inputOptions[i] !== undefined) {
							if($scope.inputOptions[i].selected !== undefined && $scope.inputOptions[i].selected !== false && $scope.inputOptions[i].selected !== 0 && $scope.inputOptions[i].selected !== null && $scope.inputOptions[i].selected !== '' && $scope.inputOptions[i].selected !== 'false' && $scope.inputOptions[i].selected !== '0') {
								$scope[modelName] = $scope.inputOptions[i];
							}
						}
					}
					// If not set in the options or with an empty attribute, select the first option.
					// You know, it's a feature...Not a bug.
					if($scope[modelName] === undefined && formElement == 'select' && $scope.emptyOption === undefined) {
						var x = 0;
						for(i in $scope.inputOptions) {
							if($scope.inputOptions[i] !== undefined && x == 0) {
								$scope[modelName] = $scope.inputOptions[i];
							}
							x++;
						}
					}
				};
				selectInitialOption();
				
				// For multiple selects clicking on the group name or the edge/margin of the select area will actually remove the "ng-pristine" class.
				// However, nothing will be chosen. This can turn the select and its options red (depending on CSS) because of the "ng-invalid" classes.
				// When this happens, the error messages will not display because validation has not been checked. Force a model update in this case
				// which will trigger a validation check.
				$scope.clickMultiSelect = function() {
					// Angular may have changed the class, but we'll also want to update our $scope to keep in sync.
					$scope.pristine = false;
					
					if($scope[modelName] !== undefined) {
						if($scope[modelName].length === 0 || $scope[modelName].length === undefined) {
							$scope[modelName] = undefined;
						}
					}
				};
				
				// For some reason file input types don't play nice with validation...
				if($attrs.type !== 'file') {
					$scope.$parent.totalFields++;
					if($scope.$parent !== undefined && $scope.$parent.formFields !== undefined) {
						var formFieldObj = {};
						formFieldObj[modelName] = false;
						$scope.$parent.fieldStatus.push(formFieldObj);
					}
				}
				
				
				// --------------------------------
				// $watch SOME STUFF
				// --------------------------------
				
				// Silly pristine check...For some reason it isn't available in the template through $scope.$form
				// So we're setting $scope.pristine
				if($attrs.type !== 'select') {
					$element.bind('blur keyup change', function(evt) {
							//console.dir(evt)
							if(evt.target.value !== undefined && evt.target.value !== '') {
								$scope.pristine = false;
								// no need...
								//	ngModel.$setViewValue(evt.target.value);
								//	ngModel.$render();
							}
							//console.dir(ngModel)
					});
				} else {
					$element.bind('change', function(evt) {
						if(evt.target.value !== undefined && evt.target.value !== '') {
							$scope.pristine = false;
						}
					});
				}
				
				$scope.$watch($attrs.ngModel, function (oldVal, newVal) {
					if(oldVal !== newVal) {
						// Setting a "completion" value for form completion... (other directives can use this)
						if($attrs.type !== 'file' && $scope.$form !== undefined && $scope.$form[modelName] !== undefined && $scope.$form[modelName].$valid !== undefined) {
							//console.dir($scope.$parent.fieldStatus)
							if($scope.$form[modelName].$valid === true) {
								$scope.$parent.fieldStatus[modelName] = true;
							} else {
								$scope.$parent.fieldStatus[modelName] = false;
							}
							var totalValid = 0;
							for(i in $scope.$parent.fieldStatus) {
								if($scope.$parent.fieldStatus[i] === true) {
									totalValid++;
								}
							}
							$scope.$parent.totalValidFields = totalValid;
						}
					}
					
				});
				
				
				// Set some attributes for the field using $formSchema (if possible, when it's ready).
				// Note: Any passed attributes ($attrs) will override these values.
				$scope.$watch('$formSchema', function(oldVal, newVal) {
					if(oldVal !== undefined) {
						if($scope.$formSchema[modelName] !== undefined) {
							$scope.value = ($scope.value === undefined) ? $scope.$formSchema[modelName].value:$scope.value;
							// Update the model value using the one from the schema if set in the schema (else it'll stay the same).
							$scope[modelName] = $scope.value;
							
							$scope.placeholder = ($scope.placeholder === undefined) ? $scope.$formSchema[modelName].placeholder:$scope.placeholder;
							$scope.label = ($scope.label === undefined) ? $scope.$formSchema[modelName].label:$scope.label;
							$scope.help = ($scope.help === undefined) ? $scope.$formSchema[modelName].help:$scope.help;
							$scope.helpClass = ($scope.helpClass === undefined) ? $scope.$formSchema[modelName].helpClass:$scope.helpClass;
							$scope.controlGroupClass = ($scope.controlGroupClass === undefined) ? $scope.$formSchema[modelName].controlGroupClass:$scope.controlGroupClass;
							$scope.inline = ($scope.inline === undefined && $scope.$formSchema[modelName].inline !== undefined) ? 'inline':$scope.inline;
							
							// Help shortcuts from the schema.
							if($scope.$formSchema[modelName].helpInline !== undefined) {
								$scope.helpClass = 'help-inline';
								$scope.help = $scope.$formSchema[modelName].helpInline;
							}
							if($scope.$formSchema[modelName].helpBlock !== undefined) {
								$scope.helpClass = 'help-block';
								$scope.help = $scope.$formSchema[modelName].helpBlock;
							}
							
							$scope.id = ($scope.id === undefined) ? $scope.$formSchema[modelName].id:$scope.id;
							// If id is still undefined, make one up based on form name and field name.
							// Having an id set (even if not specified) is important so that clicking the label sets focus on the field.
							// If an empty id value is realllllly desired, set $attrs.id to an empty string.
							if($scope.id === undefined) {
								$scope.id = $scope.$parent.formName + $scope.name;
							}
							
							// For select elements...
							if(formElement == 'select' && $scope.$formSchema !== undefined && $scope.$formSchema[modelName] !== undefined) {
								$scope.inputOptions = $scope.$formSchema[modelName].options;
								// ...And select an option...
								selectInitialOption();
							}
						}
					}
				});
				
			}
		};
	})
	.directive('bForm', function (bootstrapFormConfig, $compile, $http, $location) {
		return {
			priority: 100,
			//require: 'ngModel',
			restrict: 'E',
			replace: true,
			scope: true,
			link: function ($scope, $element, $attrs) {
				$scope.formContent = $element.html();
				
				var formHtml = '<form' +
						($attrs.name !== undefined ? ' name="' + $attrs.name + '"':'') +
						($attrs.id !== undefined ? ' id="' + $attrs.id + '"':'') +
						($attrs.class !== undefined ?  'class="' + $attrs.class + '"':'') +
						($attrs.style !== undefined ? ' style="' + $attrs.style + '"':'') +
						($attrs.onSubmit !== undefined ? ' onSubmit="' + $attrs.onSubmit + '"':'') +
						($attrs.target !== undefined ? ' target="' + $attrs.target + '"':'') +
						($attrs.acceptCharset !== undefined ? ' accept-charset="' + $attrs.acceptCharset + '"':'') +
						($attrs.autocomplete !== undefined ? ' autocomplete="' + $attrs.autocomplete + '"':'') +
						($attrs.method !== undefined ? ' method="' + $attrs.method + '"':' method="post"') +
						($attrs.enctype !== undefined ? ' enctype="' + $attrs.enctype + '"':'') +
						($attrs.novalidate !== undefined ? ' novalidate':'') +
						'>' +
					$scope.formContent +
				'</form>';
				
				$scope.templateBasePath = $attrs.templateBasePath;
				$scope.formName = $attrs.name;
				$scope.formSchema = {};
				
				// Holds information about form completion status...The nested <b-field> directives will adjust these values.
				$scope.fieldStatus = [];
				$scope.totalFields = 0;
				$scope.totalValidFields = 0;
				
				// This should come in as JSON.
				$attrs.$observe('schema', function(val) {
					try {
						$scope.formSchema = angular.fromJson(val);
					} catch(e) {
						throw new TypeError('b-form "schema" attribute was not a valid JSON string.');
						// Valid JSON was not passed for the form's schema. That's going to be a problem.
					}
					
					// After $observe, we can $compile.
					$element.html(formHtml);
					$compile($element.contents())($scope);
				});
			}
		};
	})
	.directive('bFormProgress', function (bootstrapFormConfig, $compile, $http, $location) {
		return {
			restrict: 'EC',
			replace: true,
			//scope: {},
			terminal: true,
			template: '<div><div class="progress {{progressBarClass}} progress-{{Math.round(totalValidFields/totalFields * 100)}}" style="{{progressBarStyle}}"><div class="bar" style="width: {{totalValidFields/totalFields * 100}}%"></div></div></div>',
			link: function ($scope, $element, $attrs) {
				$scope.Math = window.Math;
				$scope.progressBarClass = ($attrs.class !== undefined) ? $attrs.class:'progress-info';
				$scope.progressBarStyle = ($attrs.style !== undefined) ? $attrs.style:'';
			}
		};
	})
	// FORM FILTERS
	.filter('errorMessage', function ($filter) {
		/**
		 * Shows error messages.
		 *
		 * @param string text The text for the item's field
		 * @param string errorKey The error key name
		 * @param boolean valid Whether or not the field is valid
		 * @param string modelName The model name for the field
		 * @param string label The label for the field (which may be prettier than the modelName)
		 * @param boolean pristine Whether or not the field has been interacted with yet since DOM ready
		 * @return
		*/
		return function (text, errorKey, valid, modelName, label, pristine) {
			valid = ! valid; // flip it... it's really coming in as "invalid" true/false, but we want it to read valid true/false.
			if(valid) {
				// So, don't show the message if the field is valid.
				return;
			}
			
			// Also don't show error messages if the user hasn't done anything yet.
			if(pristine) {
				return;
			}
			
			// If a "required" attribute was set, the key under $error will simply be "required" ... So change it to something friendlier looking.
			if(errorKey == 'required') {
				// Use the label if possible.
				if(label === undefined || label === null || label === '') {
					return 'This field is required.';
				} else {
					return label + ' is required.';
				}
			}
			
			// If using uiValidate then by default the value is going to be "validator" ... What you should do is use uiValidate with an object.
			// Then, the key value can be the error message so it reads nicely when the directive template displays it.
			// But if you didn't, then display something generic.
			if(errorKey == 'validator') {
				return 'This value is invalid.';
			}
			
			return text;
		};
	})
	.filter('groupClassError', function ($filter) {
		/**
		 * Sets control-group parent div class to also include an error class name to follow along with Twitter Bootstrap styles.
		 *
		 * @param boolean valid Whether or not the field is valid
		 * @param boolean pristine Whether or not the field has been interacted with yet since DOM ready
		 * @return
		*/
		return function (valid, pristine) {
			valid = ! valid; // flip it... it's really coming in as "invalid" true/false, but we want it to read valid true/false.
			return (valid && !pristine) ? 'error':'';
		};
	})
	.filter('spacesToDashes', function ($filter) {
		/**
		 * Converts any spaces to dashes. Useful for converting values for attributes that can not have spaces such as HTML id attributes.
		 * 
		 * @param string text
		 * @return
		*/
		return function (text) {
			return text.replace(/\s+/g, '-');
		};
	})
	