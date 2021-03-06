/**
 * A lightweight and extensible React validation component
 */

import React, { Component, PropTypes } from 'react';
import Validator from 'validate-framework-utils';

/**
 * React validation component
 * @param schemas
 * @param methods Extended Validation Method
 * @return Component
 */
export default (schemas, methods) => FormComponent => (

  /**
   * Returns a react form
   */
  class FormControl extends Component {

    static childContextTypes = {
      fields: PropTypes.object.isRequired,
      handleChange: PropTypes.func.isRequired,
    };

    static propTypes = {
      values: PropTypes.object,
      classNames: PropTypes.object,
    };

    static defaultProps = {
      classNames: {},
    };

    constructor(props) {
      super(props);
      const {
        classNames,
        values,
      } = props;

      const fields = {};
      // Assemble the initialization data into fields
      if (values) {
        Object.keys(values).forEach((name) => {
          fields[name] = {
            className: classNames.static,
            value: values[name],
          };
        });
      }

      this.state = {
        fields,
      };

      // Initializes the validation component and customizes the validation method
      this.validator = new Validator();
      Object.assign(this.validator, methods, {
        fields,
      });
    }

    getChildContext() {
      return {
        fields: this.state.fields,
        handleChange: this.handleChange,
      };
    }

    componentWillReceiveProps(nextProps) {
      const { values } = nextProps;
      // No value
      if (!values) {
        return;
      }
      // Updates the state from the parent component
      const { classNames } = this.props;
      const { fields } = this.state;

      Object.keys(values).forEach((name) => {
        const newValue = values[name];
        // Validate the new data
        if (fields[name]) {
          // diff
          if (fields[name].value !== newValue) {
            this.assembleFieldValidate(name, newValue);
          }
        } else {
          // Add a new field
          fields[name] = {
            className: classNames.static,
            value: newValue,
          };
        }
      });

      this.setState({
        fields,
      });
    }

    /**
     * Get the fields object
     * @returns {Object}
     */
    get fields() {
      return this.state.fields;
    }

    /**
     * Gets a list of form values
     * @return {Object}
     */
    get formValues() {
      const { fields } = this.state;
      const values = {};
      Object.keys(fields).forEach((name) => {
        values[name] = fields[name].value;
      });
      return values;
    }

    /**
     * Gets the global validation status
     * @return {Boolean}
     */
    get isAllValid() {
      const { fields } = this.state;
      return Object.keys(schemas)
        .every(name => fields[name] && fields[name].result);
    }

    /**
     * Assemble the data
     * This method is not operational
     * @param name
     * @param value
     */
    assembleFieldValidate(name, value) {
      const { classNames } = this.props;
      const { fields } = this.state;
      // No schema is not to validate
      const schema = schemas[name] && Object.assign(schemas[name], { value });
      const { result, error } = schema ? this.validator.validateByField(schema) : {};
      // Assembly class name
      // Validation success and validation failure Add the appropriate class
      const classNameArray = [
        classNames.static,
        result ? classNames.success : null,
        result === false ? classNames.error : null,
      ];
      // Assemble
      Object.assign(fields[name], {
        value,
        className: classNameArray.filter(item => item).join('\u{20}'),
        result,
        message: error ? error.message : undefined,
      });
    }

    /**
     * Validate a single field
     * @param name
     * @param value
     * @return {Boolean}
     */
    validateField(name, value) {
      const { fields } = this.state;
      // Assemble
      this.assembleFieldValidate(name, value);
      return fields[name].result;
    }

    /**
     * Validate fields by names
     * @param names
     * @return {Boolean}
     */
    validateFieldsByNames(...names) {
      const { fields } = this.state;
      let isValid = true;
      names.forEach((name) => {
        const result = fields[name] && this.validateField(name, fields[name].value);
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
    initValues = (values) => {
      const { classNames } = this.props;
      const { fields } = this.state;
      Object.keys(values).forEach((name) => {
        fields[name] = {
          className: classNames.static,
          value: values[name],
        };
      });
    };

    /**
     * Initializes the classNames
     * @param classNames
     */
    initClassNames = (classNames) => {
      Object.assign(this.props.classNames, classNames);
    };

    // Form change event listener
    handleChange = (e) => {
      const { name, type, value } = e.target;
      const { fields } = this.state;

      // Dependent on the name attribute
      if (!name) {
        return;
      }

      let theValue;
      // Checkbox processing
      if (type === 'checkbox') {
        theValue = fields[name].value.slice();
        const index = theValue.indexOf(value);
        if (index === -1) {
          theValue.push(value);
        } else {
          theValue.splice(index, 1);
        }
      } else {
        theValue = value;
      }
      // Synchronize values external state
      if (this.props.values) {
        this.props.values[name] = theValue;
      }
      // Validate
      this.validateField(name, theValue);
      // Update
      this.setState({
        fields,
      });
    };

    /**
     * Customize to change the values
     * @param values
     */
    changeValues = (values) => {
      const { fields } = this.state;
      // Initializes
      this.initValues(values);
      Object.keys(values).forEach((name) => {
        const value = values[name];
        // Synchronize values external state
        if (this.props.values) {
          this.props.values[name] = value;
        }
        this.validateField(name, value);
      });
      // Update
      this.setState({
        fields,
      });
    };

    /**
     * Add one or more validation rules
     * @param schema
     */
    addSchemas = (schema) => {
      Object.assign(schemas, schema);
    };

    /**
     * Delete one or more validation rules
     * @param names
     */
    removeSchemas = (...names) => {
      const { fields } = this.state;
      names.forEach((name) => {
        delete schemas[name]; // eslint-disable-line no-param-reassign
      });
      // Validate the deleted status
      this.validateFieldsByNames(...names);
      // Update
      this.setState({
        fields,
      });
    };

    /**
     * Add one or more fields
     * @param newFields
     */
    addFields = (newFields) => {
      const { classNames } = this.props;
      const { fields } = this.state;
      Object.keys(newFields).forEach((name) => {
        Object.assign(newFields[name], {
          className: classNames.static,
        });
      });
      Object.assign(fields, newFields);
      // Update
      this.setState({
        fields,
      });
    };

    /**
     * Deletes one or more fields
     * @param names
     */
    removeFields = (...names) => {
      const { fields } = this.state;
      names.forEach((name) => {
        delete fields[name];
      });
      // Update
      this.setState({
        fields,
      });
    };

    /**
     * Validate the component through names
     * @param names
     * @return {Boolean}
     */
    validateByNames = (...names) => {
      const result = this.validateFieldsByNames(...names);
      const { fields } = this.state;
      // Update
      this.setState({
        fields,
      });
      return result;
    };

    // Validate all
    validate = () => {
      const names = Object.keys(schemas);
      const result = this.validateFieldsByNames(...names);
      const { fields } = this.state;
      // Update
      this.setState({
        fields,
      });
      return result;
    };

    render() {
      return (
        <FormComponent
          {...this.props}
          fields={this.fields}
          isAllValid={this.isAllValid}
          formValues={this.formValues}
          initValues={this.initValues}
          initClassNames={this.initClassNames}
          onChange={this.handleChange}
          changeValues={this.changeValues}
          validate={this.validate}
          validateByNames={this.validateByNames}
          addFields={this.addFields}
          removeFields={this.removeFields}
          addSchemas={this.addSchemas}
          removeSchemas={this.removeSchemas}
        />
      );
    }
  }
);
