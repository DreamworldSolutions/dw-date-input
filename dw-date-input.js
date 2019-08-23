/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';
import '@dw/dw-input/dw-input';
import { DwFormElement } from '@dw/dw-form/dw-form-element';
import moment from 'moment';
  
export class DwDateInput extends DwFormElement(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          outline:none;
        }

        :host[hidden] {
          display: none;
        }
      `
    ];
  }

  static get properties() {
    return {
      /**
       * The name of input element
       */
      name: { type: String },

      /**
       * Current input value entered by user
       */
      value: { type: String },

      /**
       * The label for this element.
       */
      label: { type: String },

      /**
       * Set to true to disable this input.
       */
      disabled: { type: Boolean },

      /**
       * Set to true for input without label.
       */
      noLabel: { type: Boolean },

      /**
       * Set this to show input with helper text
       */
      hintText: { type: String },

      /**
       * Set to true to mark the input as required.
       */
      required: { type: Boolean },

      /**
       * A placeholder text in addition to the label.
       */
      placeholder: { type: String },
      
      /**
       * The error message to display when the input is invalid.
       */
      errorMessagesByState: { type: Object },

      /**
       * Set to true to make input field readonly.
       */
      readOnly: { type: Boolean },

      /**
       * True if the last call to `validate` is invalid.
       */
      invalid: { type: Boolean },

      /**
       * The minimum allowed date (inclusively).
       */
      minDate: { type: String },

      /**
       * The maximum allowed date (inclusively).  
       */
      maxDate: { type: String },

      /**
       * Set to true to auto-select text on focus
       */
      autoSelect: { type: Boolean },

      /**
       * prefered date input format  
       * it should be `dd/mm/yyyy` or `mm/dd/yyyy` or `dd-mm-yyyy` or `mm-dd-yyyy`
       */
      inputFormat: { type: String },
      
      /**
       * Set to true to make it dense
       */
      isDense: { type: Boolean },

      /**
       * Date separator. Possible value: `/` or  `-`
       */
      _separator: { type: String },

      /**
       * Current error state
       * Poissible value: `REQUIRED`, `MAX_MIN_DATE`, `MIN_DATE`, `MAX_DATE`, `INVALID_DATE`
       */
      _errorState: { type: String }

    };
  }

  render() {
    
    return html`
      <dw-input
      id="dateInput"
      .label="${this.label}"
       ?disabled="${this.disabled}"
       ?noLabel="${this.noLabel}"
       ?required="${this.required}"
       ?readOnly="${this.readOnly}"
       ?autoSelect="${this.autoSelect}"
       ?isDense="${this.isDense}"
       allowedPattern=[0-9/-]
       .placeholder="${this.placeholder}"
       .value="${this._getFormattedDate(this.value, this.inputFormat)}"
       .errorMessage="${this._getErrorMessage(this.value, this.errorMessagesByState, this._errorState)}"
       .name="${this.name}"
       .hintText="${this.hintText}"
       @blur="${this._onBlur}"
       .validator="${this._customValidator.bind(this)}"
      ></dw-input>
    `;
  }

  constructor() {
    super();
    this.disabled = false;
    this.noLabel = false;
    this.required = false;
    this.readOnly = false;
    this.placeholder = '';
    this.value = '';
    this.originalValue = '';
    this.isDense = false;
    this.errorMessagesByState = {
      REQUIRED: 'Required',
      MIN_DATE: 'Date must be >= {minDate}',
      MAX_DATE: 'Date must be <= {maxDate}',
      MIN_MAX_DATE: 'Date must be between {minDate} and {maxDate}',
      INVALID_DATE: 'Date is invalid'
    };
    this.name = '';
    this.hintText = '';
    this.invalid = false;
    this.autoSelect = false;
    this.inputFormat = 'mm/dd/yyyy';
    this._errorState = 'REQUIRED';
    this._separator = '/';
  }

  firstUpdated(changedProps) { 
    if (changedProps.has('inputFormat')) { 
      this._separator = this.inputFormat.slice(2, 3);
    }
  }

  /**
   * Call this to set focus on the field
   */
  focus() {
    let inputEl = this.shadowRoot.querySelector('#dateInput');
    inputEl && inputEl.focus();
  }
   
  /**
   * Call to perform validation
   * Returns true if it's valid, false otherwise.
   */
  validate() { 
    let el = this.shadowRoot.querySelector('#dateInput');
    let isValid = el.validate();
    this.invalid = !isValid;
    return isValid;
  }

  /**
   * Performs date validations like required, minDate, maxDate, invalid
   * @param {String} value - date entered by value
   * @returns {Boolean} returns false if it's invalid
   */
  _customValidator(value) {
    value = value.replace(/ /g, '');

    if (!value && !this.required) { 
      return true;
    }

    if (!moment(value, this.inputFormat.toUpperCase(), true).isValid()) { 
      return false;
    }

    if(this.maxDate && this.minDate){
      let isInputGreater = moment(value).isAfter(this.maxDate);
      let isInputLower = moment(value).isBefore(this.minDate);
      
      return !(isInputLower || isInputGreater);
    }
    
    if(this.maxDate){
      return moment(value). isBefore(this.maxDate);
    }
    
    if(this.minDate){
      return moment(value).isAfter(this.minDate);
    }

    return true;
  }

  /**
   * @param {String} value - Current entered date
   * @param {Object} errorMessage - ErrorMessage map by possible error state
   * @returns {String} Error message by state
   */
  _getErrorMessage(value, errorMessage) {
    if (!value && this.required) { 
      return errorMessage['REQUIRED'];
    }

    let errorText;
    value = value.replace(/ /g, '');

    if (!moment(value, this.inputFormat.toUpperCase(), true).isValid()) { 
      return errorMessage['INVALID_DATE'];
    }

    if (this.minDate && this.maxDate) {
      errorText = errorMessage['MIN_MAX_DATE'];
      errorText = errorText.replace('{maxDate}', this.maxDate);
      errorText = errorText.replace('{minDate}', this.minDate);
      return errorText;
    }

    if (this.minDate) { 
      errorText = errorMessage['MIN_DATE'];
      return errorText.replace('{minDate}', this.minDate);
    }

    if (this.maxDate) { 
      errorText = errorMessage['MAX_DATE'];
      return errorText.replace('{maxDate}', this.maxDate);
    }
  }

  _onBlur(e) { 
    this.value = e.target.value;
  }

  /**
   * Called when value and format change for formatted date
   * 
   * @param {String} value represent - `value` property
   * @param {String} format represent - `_inputFormat` property
   * @return {String} formatted date
   */
  _getFormattedDate(value, format) {
    value = value || '';
    value = value.replace(/ /g, '');
    value = value.replace(/-/g, '/');
    value = value.replace(/[\/]+/g, '\/').replace(/^\/*/, '').replace(/\/*$/, '');
    value = value.split('/').slice(0, 3).join('/');
    
    if(!value && value !== '0'){
      return '';
    }
    
    let places = this._createPlaces(value);
    places = this._fillEmptyPlaces(places, format);

    
    let formattedDate = places.join(` ${this._separator} `);
    
    this.value = formattedDate.replace(/ /g, '');
    return formattedDate;
  }
  
  /**
   * used to create places for day, month and year
   * 
   * @param {String} - value represent formated text
   * @param {Array} - Array that now have places for day, month and year
   */
  _createPlaces(value, format) {
    let place1, place2, place3;
    let splits = value.split('/');
    let countSlash = splits.length - 1;

    if(!countSlash){
      place1 = value.slice(0, 2);
      place2 = value.slice(2, 4);
      place3 = value.slice(4, 8);
    }else if(countSlash === 1){
      place1 = splits[0].slice(0, 2);
      place2 = splits[1].slice(0, 2);
      place3 = splits[1].slice(2, 6);
    }else {
      place1 = splits[0].slice(0, 2);
      place2 = splits[1].slice(0, 2);
      place3 = splits[2].slice(0, 4);
    }
    
    return [place1, place2, place3];
  }
  
  /**
   * used to set places that are empty or contain only zeros &
   * uses `_pad` method to put prefix '0' in value of place[1] and place[2] if there value's length lessthan 2 
   *
   * @param {Array} places - represent `dateArray`
   * @param {String} format - represent `_inputFormat` property
   * @return {Array} places - represent `dateArray` with filled places
   */
  _fillEmptyPlaces(places, format){
    let isMonthFirst = format.toUpperCase() === "MM/DD/YYYY"? true : false;
    let day = moment().format('DD');
    let month = moment().format('MM');
    let year = moment().format('YYYY');
    
    if(!parseInt(places[0])){
      places[0] = isMonthFirst ? month : day;
    }
    if(!parseInt(places[1])){
      places[1] = isMonthFirst ? day : month;
    }
    if(!parseInt(places[2])){
      places[2] = year;
    }
    
    places[0] = this._pad(places[0]);
    places[1] = this._pad(places[1]);
    
    if(places[2] < 1000){
      places[2] = 2000 + parseInt(places[2]);
    }
    
    return places; 
  }
  
  /**
   * used to set zero as prefix in value store in  number letiable,
   * otherwise keep number's value as it is & return it
   * 
   * @param {String} number 
   * @return {String} number
   */
  _pad(number){
    number = number.length < 2 ? ("0" + number) : number;
    return number;
  }

}

window.customElements.define('dw-date-input', DwDateInput);