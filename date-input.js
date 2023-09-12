/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { css } from "@dreamworld/pwa-helpers/lit.js";
import { DwInput } from "@dreamworld/dw-input/dw-input";
import moment from "moment/src/moment";
import { dateParse } from "./date-parse";

export class DateInput extends DwInput {
  static get properties() {
    return {
      date: { type: String },

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
       * Input property.
       * Set `true` to enable warning when user enters future date.
       * Note: Error has high priority so when error message is displayed, this warning will not be displayed
       */
      showFutureWarning: { type: Boolean, reflect: true },

      /**
       * Input property.
       * Set `true` to show error message when user select future date.
       */
      showFutureError: { type: Boolean, reflect: true },

      /**
       * Date separator. Possible value: `/` or  `-`
       */
      _separator: { type: String },

      /**
       * Custom validator for error message
       *
       * ### Usage
       * ```
       * (value) => boolean
       * ```
       * Params value: currently selected value
       * Returns invalid that helps to show error message or invalid state
       */
      customErrorValidator: { type: Function },
    };
  }

  constructor() {
    super();
    this.iconTrailing = "date_range";
    this.allowedPattern = "^[a-zA-Z0-9-/,_ ]*$";
    this.clickableIcon = false; // Set true when date picker support added
    this.validator = this._customValidator;
    this.inputFormat = "DD/MM/YYYY";
    this._separator = "/";
    this.showFutureError = false;
    this.showFutureWarning = false;
    this.addEventListener("enter", this._onEnter);
    this.addEventListener("paste", this._onPaste);
    this.addEventListener("blur", this._onBlur);
  }

  firstUpdated(changedProps) {
    super.firstUpdated && super.firstUpdated(changedProps);

    if (changedProps.has("inputFormat")) {
      this._separator = this.inputFormat.slice(2, 3);
    }
  }

  willUpdate(changedProps) {
    super.willUpdate(changedProps);
    if (changedProps.has("date")) {
      this.value = this.parseValue(
        moment(this.date, "YYYY-MM-DD").format(this.inputFormat.toUpperCase())
      );
    }
  }

  formatText() {
    return (
      this.value &&
      this.value.replace(/ /g, "").split(`${this._separator}`).join(` ${this._separator} `)
    );
  }

  parseValue(value) {
    if (!value) {
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
    value = value ? value.replace(/ /g, "") : "";

    if (!value && this.required) {
      return false;
    }

    if (!value) {
      return true;
    }

    const inputFormat = this.inputFormat ? this.inputFormat.toUpperCase() : "DD/MM/YYYY";

    if (!moment(value, inputFormat, true).isValid()) {
      return false;
    }

    value = moment(value, inputFormat).format(inputFormat);

    if (this.maxDate && this.minDate) {
      const minDate = moment(this.minDate, "YYYY-MM-DD").format(inputFormat);
      const maxDate = moment(this.maxDate, "YYYY-MM-DD").format(inputFormat);

      return value <= maxDate && value >= minDate;
    }

    if (this.maxDate) {
      const maxDate = moment(this.maxDate, "YYYY-MM-DD").format(inputFormat);
      return value <= maxDate;
    }

    if (this.minDate) {
      const minDate = moment(this.minDate, "YYYY-MM-DD").format(inputFormat);
      return value >= minDate;
    }

    if (this.showFutureError) {
      const todayDate = moment().format(inputFormat);
      return value <= todayDate;
    }

    if (this.customErrorValidator) {
      return this.customErrorValidator(value);
    }

    return true;
  }

  _onEnter(e) {
    this.value = this.parseValue(e.detail.value);
    this._updateTextfieldValue();
    this.validate();

    this.dispatchEvent(new CustomEvent("change"));
  }

  _onPaste(e) {
    let paste = (e.clipboardData || window.clipboardData).getData("text");
    this.value = this.parseValue(paste);
    this._updateTextfieldValue();
    this.validate();

    this.dispatchEvent(new CustomEvent("change"));

    e.preventDefault();
  }

  _onBlur(e) {
    let value = e.target.value;
    this.value = this.parseValue(value);
    this._updateTextfieldValue();
    this.validate();

    this.dispatchEvent(new CustomEvent("change"));
  }
}

window.customElements.define("date-input", DateInput);
