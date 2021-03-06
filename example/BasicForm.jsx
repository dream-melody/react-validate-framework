/**
 * Created by MingYi on 2016/12/23.
 */

import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import formConnect, {
  Checkbox,
  Radio,
  Select,
  Text,
  Textarea,
  Message,
} from '../src';
import './BasicForm.scss';
import ChildForm from './ChildForm';

// Rules and messages
const schemas = {
  email: {
    rules: 'required | isEmail | maxLength(32)',
    messages: 'Can not be empty! | Please enter a valid email address. | Can not exceed {{param}} characters.',
  },
  phone: {
    rules: 'isPhone',
    messages: 'Mobile: {{value}} is not valid.',
  },
  birthday: {
    rules: 'requiredField(phone) | isDate',
    messages: 'Phone and birthday at least one entry! | Please enter a valid date.',
  },
  sex: {
    rules: 'required',
    messages: 'Can not be empty!',
  },
  city: {
    rules: 'required',
    messages: 'Can not be empty!',
  },
  hobby: {
    rules: 'required | selectLimit(3)',
    messages: 'Can not be empty! | Select at least {{param}}.',
  },
  remarks: {
    rules: 'minLength(10) | maxLength(60)',
    messages: 'Can not be less than {{param}} characters. | Can not exceed {{param}} characters.',
  },
  money: {
    rules: 'required | isNumeric | maxLength(5)',
    messages: 'Can not be empty! | Please enter an integer amount. | Can not exceed {{param}} characters.',
  },
  url: {
    rules: 'isUrl',
    messages: 'Please enter the link address.',
  },
};

// Custom methods
const methods = {
  // Rely on other fields
  requiredField(field, param) {
    const otherField = this.fields[param];
    return this.required(field) || (otherField.result && this.required(otherField));
  },
  selectLimit(field, param) {
    if (Array.isArray(field.value)) {
      return field.value.length >= param;
    }
    return false;
  },
};

class BasicForm extends Component {

  static propTypes = {
    formValues: PropTypes.object,
    isAllValid: PropTypes.bool,
    validate: PropTypes.func,
    removeSchemas: PropTypes.func,
  };

  handleSubmitClick = () => {
    const { validate } = this.props;
    // @return {Boolean}
    validate();
  };

  render() {
    const {
      formValues,
      isAllValid,
      removeSchemas,
    } = this.props;

    return (
      <div className="container">
        <h3>BasicForm</h3>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <Text
            id="email"
            name="email"
            type="email"
            placeholder="Please input your email"
          />
          <Message className="valid-error-message" name="email" />
        </div>
        <div className="form-group">
          <button
            className="btn btn-default"
            type="button"
            onClick={() => {
              removeSchemas('email');
            }}
          >
            Do not validate the email
          </button>
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <Text
            id="phone"
            name="phone"
            placeholder="Please enter phone number"
          />
          <Message className="valid-error-message" name="phone" />
        </div>
        <div className="form-group">
          <label htmlFor="birthday">Birthday:</label>
          <Text
            id="birthday"
            name="birthday"
            placeholder="Please fill in your birthday"
          />
          <Message className="valid-error-message" name="birthday" />
        </div>
        <div className="form-group">
          <label htmlFor="male">Sex:</label>
          <div className="radio">
            <label htmlFor="male">
              <Radio
                id="male"
                name="sex"
                value="0"
              />
              male
            </label>
            <label htmlFor="female">
              <Radio
                id="female"
                name="sex"
                value="1"
              />
              female
            </label>
          </div>
          <Message className="valid-error-message" name="sex" />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <Select
            id="city"
            name="city"
          >
            <option value="">Please choose</option>
            <option value="0">beijing</option>
            <option value="1">shanghai</option>
            <option value="2">new York</option>
          </Select>
          <Message className="valid-error-message" name="city" />
        </div>
        <div className="form-group">
          <label htmlFor="hobby">Hobby:</label>
          <div className="checkbox">
            <label htmlFor="hobby1">
              <Checkbox
                id="hobby1"
                name="hobby"
                value="1"
              />
              hobby1
            </label>
            <label htmlFor="hobby2">
              <Checkbox
                id="hobby2"
                name="hobby"
                value="2"
              />
              hobby2
            </label>
            <label htmlFor="hobby3">
              <Checkbox
                id="hobby3"
                name="hobby"
                value="3"
              />
              hobby3
            </label>
            <label htmlFor="hobby4">
              <Checkbox
                id="hobby4"
                name="hobby"
                value="4"
              />
              hobby4
            </label>
          </div>
          <Message className="valid-error-message" name="hobby" />
        </div>
        <div className="form-group">
          <label htmlFor="remarks">Introduction:</label>
          <Textarea
            id="remarks"
            name="remarks"
            rows="3"
            placeholder="Describe yourself"
          />
          <Message className="valid-error-message" name="remarks" />
        </div>
        <ChildForm {...this.props} />
        <input
          className={classNames('btn', {
            'btn-primary': !isAllValid,
            'btn-success': isAllValid,
          })}
          id="submit"
          type="button"
          onClick={this.handleSubmitClick}
          value={isAllValid ? 'Success' : 'Commit'}
        />
        <div className="well-sm">
          <p>Form Values:</p>
          {JSON.stringify(formValues)}
        </div>
      </div>
    );
  }
}

export default formConnect(schemas, methods)(BasicForm);
