'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _validateFrameworkUtils = require('validate-framework-utils');

var _validateFrameworkUtils2 = _interopRequireDefault(_validateFrameworkUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * A lightweight and extensible React validation component
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

/**
 * React validation component
 * @param schemas
 * @param methods Extended Validation Method
 * @return Component
 */
exports.default = function (schemas, methods) {
  return function (FormComponent) {
    var _class, _temp, _initialiseProps;

    return (

      /**
       * Returns a react form
       */
      _temp = _class = function (_Component) {
        _inherits(FormControl, _Component);

        function FormControl(props) {
          _classCallCheck(this, FormControl);

          var _this = _possibleConstructorReturn(this, (FormControl.__proto__ || Object.getPrototypeOf(FormControl)).call(this, props));

          _initialiseProps.call(_this);

          var classNames = props.classNames,
              values = props.values;


          var fields = {};
          // Assemble the initialization data into fields
          if (values) {
            Object.keys(values).forEach(function (name) {
              fields[name] = {
                className: classNames.static,
                value: values[name]
              };
            });
          }

          _this.state = {
            fields: fields
          };

          // Initializes the validation component and customizes the validation method
          _this.validator = new _validateFrameworkUtils2.default();
          _extends(_this.validator, methods, {
            fields: fields
          });
          return _this;
        }

        _createClass(FormControl, [{
          key: 'getChildContext',
          value: function getChildContext() {
            return {
              fields: this.state.fields,
              handleChange: this.handleChange
            };
          }
        }, {
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps) {
            var _this2 = this;

            var values = nextProps.values;
            // No value

            if (!values) {
              return;
            }
            // Updates the state from the parent component
            var classNames = this.props.classNames;
            var fields = this.state.fields;


            Object.keys(values).forEach(function (name) {
              var newValue = values[name];
              // Validate the new data
              if (fields[name]) {
                // diff
                if (fields[name].value !== newValue) {
                  _this2.assembleFieldValidate(name, newValue);
                }
              } else {
                // Add a new field
                fields[name] = {
                  className: classNames.static,
                  value: newValue
                };
              }
            });

            this.setState({
              fields: fields
            });
          }

          /**
           * Get the fields object
           * @returns {Object}
           */

        }, {
          key: 'assembleFieldValidate',


          /**
           * Assemble the data
           * This method is not operational
           * @param name
           * @param value
           */
          value: function assembleFieldValidate(name, value) {
            var classNames = this.props.classNames;
            var fields = this.state.fields;
            // No schema is not to validate

            var schema = schemas[name] && _extends(schemas[name], { value: value });

            var _ref = schema ? this.validator.validateByField(schema) : {},
                result = _ref.result,
                error = _ref.error;
            // Assembly class name
            // Validation success and validation failure Add the appropriate class


            var classNameArray = [classNames.static, result ? classNames.success : null, result === false ? classNames.error : null];
            // Assemble
            _extends(fields[name], {
              value: value,
              className: classNameArray.filter(function (item) {
                return item;
              }).join(' '),
              result: result,
              message: error ? error.message : undefined
            });
          }

          /**
           * Validate a single field
           * @param name
           * @param value
           * @return {Boolean}
           */

        }, {
          key: 'validateField',
          value: function validateField(name, value) {
            var fields = this.state.fields;
            // Assemble

            this.assembleFieldValidate(name, value);
            return fields[name].result;
          }

          /**
           * Validate fields by names
           * @param names
           * @return {Boolean}
           */

        }, {
          key: 'validateFieldsByNames',
          value: function validateFieldsByNames() {
            var _this3 = this;

            var fields = this.state.fields;

            var isValid = true;

            for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
              names[_key] = arguments[_key];
            }

            names.forEach(function (name) {
              var result = fields[name] && _this3.validateField(name, fields[name].value);
              // Exclude unauthenticated and validated successfully
              if (result === false) {
                isValid = false;
              }
            });
            return isValid;
          }

          /**
           * Initializes the form value
           * @param values
           */


          /**
           * Initializes the classNames
           * @param classNames
           */


          // Form change event listener


          /**
           * Customize to change the values
           * @param values
           */


          /**
           * Add one or more validation rules
           * @param schema
           */


          /**
           * Delete one or more validation rules
           * @param names
           */


          /**
           * Add one or more fields
           * @param newFields
           */


          /**
           * Deletes one or more fields
           * @param names
           */


          /**
           * Validate the component through names
           * @param names
           * @return {Boolean}
           */


          // Validate all

        }, {
          key: 'render',
          value: function render() {
            return _react2.default.createElement(FormComponent, _extends({}, this.props, {
              fields: this.fields,
              isAllValid: this.isAllValid,
              formValues: this.formValues,
              initValues: this.initValues,
              initClassNames: this.initClassNames,
              onChange: this.handleChange,
              changeValues: this.changeValues,
              validate: this.validate,
              validateByNames: this.validateByNames,
              addFields: this.addFields,
              removeFields: this.removeFields,
              addSchemas: this.addSchemas,
              removeSchemas: this.removeSchemas
            }));
          }
        }, {
          key: 'fields',
          get: function get() {
            return this.state.fields;
          }

          /**
           * Gets a list of form values
           * @return {Object}
           */

        }, {
          key: 'formValues',
          get: function get() {
            var fields = this.state.fields;

            var values = {};
            Object.keys(fields).forEach(function (name) {
              values[name] = fields[name].value;
            });
            return values;
          }

          /**
           * Gets the global validation status
           * @return {Boolean}
           */

        }, {
          key: 'isAllValid',
          get: function get() {
            var fields = this.state.fields;

            return Object.keys(schemas).every(function (name) {
              return fields[name] && fields[name].result;
            });
          }
        }]);

        return FormControl;
      }(_react.Component), _class.childContextTypes = {
        fields: _react.PropTypes.object.isRequired,
        handleChange: _react.PropTypes.func.isRequired
      }, _class.propTypes = {
        values: _react.PropTypes.object,
        classNames: _react.PropTypes.object
      }, _class.defaultProps = {
        classNames: {}
      }, _initialiseProps = function _initialiseProps() {
        var _this4 = this;

        this.initValues = function (values) {
          var classNames = _this4.props.classNames;
          var fields = _this4.state.fields;

          Object.keys(values).forEach(function (name) {
            fields[name] = {
              className: classNames.static,
              value: values[name]
            };
          });
        };

        this.initClassNames = function (classNames) {
          _extends(_this4.props.classNames, classNames);
        };

        this.handleChange = function (e) {
          var _e$target = e.target,
              name = _e$target.name,
              type = _e$target.type,
              value = _e$target.value;
          var fields = _this4.state.fields;

          // Dependent on the name attribute

          if (!name) {
            return;
          }

          var theValue = void 0;
          // Checkbox processing
          if (type === 'checkbox') {
            theValue = fields[name].value.slice();
            var index = theValue.indexOf(value);
            if (index === -1) {
              theValue.push(value);
            } else {
              theValue.splice(index, 1);
            }
          } else {
            theValue = value;
          }
          // Synchronize values external state
          if (_this4.props.values) {
            _this4.props.values[name] = theValue;
          }
          // Validate
          _this4.validateField(name, theValue);
          // Update
          _this4.setState({
            fields: fields
          });
        };

        this.changeValues = function (values) {
          var fields = _this4.state.fields;
          // Initializes

          _this4.initValues(values);
          Object.keys(values).forEach(function (name) {
            var value = values[name];
            // Synchronize values external state
            if (_this4.props.values) {
              _this4.props.values[name] = value;
            }
            _this4.validateField(name, value);
          });
          // Update
          _this4.setState({
            fields: fields
          });
        };

        this.addSchemas = function (schema) {
          _extends(schemas, schema);
        };

        this.removeSchemas = function () {
          for (var _len2 = arguments.length, names = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            names[_key2] = arguments[_key2];
          }

          var fields = _this4.state.fields;

          names.forEach(function (name) {
            delete schemas[name]; // eslint-disable-line no-param-reassign
          });
          // Validate the deleted status
          _this4.validateFieldsByNames.apply(_this4, names);
          // Update
          _this4.setState({
            fields: fields
          });
        };

        this.addFields = function (newFields) {
          var classNames = _this4.props.classNames;
          var fields = _this4.state.fields;

          Object.keys(newFields).forEach(function (name) {
            _extends(newFields[name], {
              className: classNames.static
            });
          });
          _extends(fields, newFields);
          // Update
          _this4.setState({
            fields: fields
          });
        };

        this.removeFields = function () {
          for (var _len3 = arguments.length, names = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            names[_key3] = arguments[_key3];
          }

          var fields = _this4.state.fields;

          names.forEach(function (name) {
            delete fields[name];
          });
          // Update
          _this4.setState({
            fields: fields
          });
        };

        this.validateByNames = function () {
          var result = _this4.validateFieldsByNames.apply(_this4, arguments);
          var fields = _this4.state.fields;
          // Update

          _this4.setState({
            fields: fields
          });
          return result;
        };

        this.validate = function () {
          var names = Object.keys(schemas);
          var result = _this4.validateFieldsByNames.apply(_this4, _toConsumableArray(names));
          var fields = _this4.state.fields;
          // Update

          _this4.setState({
            fields: fields
          });
          return result;
        };
      }, _temp
    );
  };
};
//# sourceMappingURL=FormControl.js.map