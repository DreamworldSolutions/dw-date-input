/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { css } from "lit-element";
import { DwInput } from "@dreamworld/dw-input/dw-input";
import moment from "moment/src/moment";
import { dateParse } from "./date-parse";

export class DateInput extends DwInput {
  static get properties() {
    return {
      /**
       * Prefered date input format
       * It should be `dd/mm/yyyy` or `mm/dd/yyyy` or `dd-mm-yyyy` or `mm-dd-yyyy`
       */
      inputFormat: { type: String },

      /**
       * The minimum allowed date (inclusively).
       */
      minDate: { type: String },

      /**
       * The maximum allowed date (inclusively).
       */
      maxDate: { type: String },

      /**
       * Date separator. Possible value: `/` or  `-`
       */
      _separator: { type: String },
    };
  }

  constructor() {
    super();
    this.iconTrailing = "date_range";
    this.allowedPattern = "^[a-zA-Z0-9-/,_ ]*$";
    this.clickableIcon = true;
    this.validator = this._customValidator;
    this.inputFormat = "dd/mm/yyyy";
    this._separator = "/";
    this.addEventListener("enter", this._onEnter);
    this.addEventListener("paste", this._onPaste);
    this.addEventListener("blur", this._onBlur);
  }

  set value(val) {
    let oldValue = this._value;

    if( oldValue === val) {
      return;
    }

    this._value = this.parseValue(val);

    this.requestUpdate("value", oldValue);
  }

  get value() {
    return this._value;
  }

  firstUpdated(changedProps) {
    super.firstUpdated && super.firstUpdated(changedProps);

    if (changedProps.has("inputFormat")) {
      this._separator = this.inputFormat.slice(2, 3);
    }

    if(this.value) {
      this.value = this.parseValue(this.value);
    }
  }

  formatText(value) {
    return (
      value &&
      value.replace(/ /g, "").split(`${this._separator}`).join(` ${this._separator} `)
    );
  }

  parseValue(value) {
    if(!value){
      return "";
    }
    return dateParse(value, this.inputFormat, this._separator);
  }

  /**
   * Performs date validations like required, minDate, maxDate, invalid
   * @param {String} value - date entered by value
   * @returns {Boolean} returns false if it's invalid
   */
  _customValidator(value) {
    if (!value) {
      return true;
    }

    value = value.replace(/ /g, "");

    if (!value && !this.required) {
      return true;
    }

    let inputFormat = this.inputFormat ? this.inputFormat.toUpperCase() : "MM/DD/YYYY";

    if (!moment(value, inputFormat, true).isValid()) {
      return false;
    }

    value = moment(value, inputFormat).format("MM/DD/YYYY");
    let minDate = moment(this.minDate, inputFormat).format("MM/DD/YYYY");
    let maxDate = moment(this.maxDate, inputFormat).format("MM/DD/YYYY");

    if (this.maxDate && this.minDate) {
      let isInputGreater = moment(value).isAfter(maxDate);
      let isInputLower = moment(value).isBefore(minDate);

      return !(isInputLower || isInputGreater);
    }

    if (this.maxDate) {
      return moment(value).isSameOrBefore(maxDate);
    }

    if (this.minDate) {
      return moment(value).isSameOrAfter(minDate);
    }

    return true;
  }

  _onEnter(e) {
    this._updateTextfieldValue();

    this.dispatchEvent(new CustomEvent("change"));
  }

  _onPaste(e) {
    let paste = (e.clipboardData || window.clipboardData).getData("text");
    this.value = this.parseValue(paste);

    this._updateTextfieldValue();

    this.dispatchEvent(new CustomEvent("change"));

    e.preventDefault();
  }

  _onBlur(e) {
    super._onInputBlur(e);

    this.dispatchEvent(new CustomEvent("change"));
  }
}

window.customElements.define("date-input", DateInput);
