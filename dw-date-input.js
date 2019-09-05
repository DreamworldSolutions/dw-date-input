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
import { DwFormElement } from '@dreamworld/dw-form/dw-form-element';
import moment from 'moment';
import '@vaadin/vaadin-date-picker/theme/material/vaadin-date-picker';
import './vaadin-text-field-style';
import './vaadin-date-picker-overlay-style';
import './date-input';
  
export class DwDateInput extends DwFormElement(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          outline:none;
          position: relative;
        }

        :host[hidden] {
          display: none;
        }

        vaadin-date-picker{
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
        }

        #dateInput{
          z-index: 5;
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
      hint: { type: String },

      /**
       * Always show the helper text despite focus.
       */
      hintPersistent: { type: Boolean },

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
      dense: { type: Boolean },
      
      /**
       * A string which used to check whether user has updated value or not
       * When `originalValue` and `value` is different input style is changed
       */
      originalValue: { type: String },
      
      /**
       * Set to true to highLight textfield when value is changed
       * Make sure to provide `originalValue` when setting this to true
       * It will highLight field when `value` and `originalValue` is not same
       */
      highlightChanged: { type: Boolean },
    };
  }

  render() {
    
    return html`
      <date-input
       id="dateInput"
       .inputFormat="${this.inputFormat}"
       .label="${this.label}"
       ?disabled="${this.disabled}"
       ?noLabel="${this.noLabel}"
       ?required="${this.required}"
       ?readOnly="${this.readOnly}"
       ?autoSelect="${this.autoSelect}"
       ?dense="${this.dense}"
       ?hintPersistent="${this.hintPersistent}"
       .placeholder="${this.placeholder}"
       ?highlightChanged="${this.highlightChanged}"
       .originalValue="${this.originalValue}"
       .value="${this.value}"
       .name="${this.name}"
       .hint="${this.hint}"
       .minDate="${this.minDate}"
       .maxDate="${this.maxDate}"
       .errorMessage=${this._getErrorMessage(this.value, this.errorMessagesByState)}
       @value-changed="${this._setValue}"
       @click="${this._onClick}"
      ></date-input>

      <vaadin-date-picker
        tabindex="-1"
        ?disabled="${this.disabled}"
        ?readonly="${this.readOnly}"
        .value="${this._getSelectedDate(this.value)}"
        @value-changed="${this._onSelectedDateChanged}"
        @opened-changed="${this._onOpenedChanged}">
      </vaadin-date-picker>
      
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
    this.dense = false;
    this.name = '';
    this.hint = '';
    this.hintPersistent = false;
    this.invalid = false;
    this.autoSelect = false;
    this.inputFormat = 'mm/dd/yyyy';
    this.highlightChanged = false;
    this.errorMessagesByState = {
      REQUIRED: 'Required',
      MIN_DATE: 'Date must be > {minDate}',
      MAX_DATE: 'Date must be < {maxDate}',
      MIN_MAX_DATE: 'Date must be between {minDate} and {maxDate}',
      INVALID_DATE: 'Date is invalid'
    };
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

  layout() { 
    let el = this.shadowRoot.querySelector('#dateInput');
    el && el.layout();
  }

  /**
   * @param {String} value - Current entered date
   * @param {Object} errorMessage - ErrorMessage map by possible error state
   * @returns {String} Error message by state
   */
  _getErrorMessage(value, errorMessage) {
    if (!value) { 
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

  _setValue(e) { 
    this.value = e.detail.value;
    this.dispatchEvent(new CustomEvent('value-changed', {
      detail: { value: this.value }
    }));
  }
  
  /**
   * open date picker
   */
  _onClick(e) {
    let paths = e.composedPath()
    let iconIndex = paths.findIndex((path) => {
      return path.tagName === 'DW-ICON' || path.tagName === 'DW-ICON-BUTTON';
    });

    if (iconIndex !== -1 && !this.disabled && !this.readOnly) { 
      this.shadowRoot.querySelector('vaadin-date-picker').opened = true;
      this.focus();
    }
  }

  /**
   * Sets selected date as input's value
   */
  _onSelectedDateChanged(e) { 
    if (!e.detail.value) { 
      return;
    }
    
    let selectedDate = moment(e.detail.value, 'YYYY-MM-DD').format(this.inputFormat.toUpperCase());
    this.value = selectedDate;

    setTimeout(() => {
      this.layout();
    });
  }

  /**
   * Validate input on date picker close
   */
  _onOpenedChanged(e) { 
    // validate date on calendar close
    if (e.detail && !e.detail.value && e.target.hasAttribute('focused')) { 
      setTimeout(() => {
        this.validate();
      },1);
    }
  }
  
  _getSelectedDate(value){
    if(value){
      value = value.replace(/ /g, '');
      return moment(value, this.inputFormat.toUpperCase()).format('YYYY-MM-DD');
    }
    
  }

}

window.customElements.define('dw-date-input', DwDateInput);