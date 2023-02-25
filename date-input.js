/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { css, html, nothing } from "@dreamworld/pwa-helpers/lit.js";
import { DwInput } from "@dreamworld/dw-input/dw-input";
import moment from "moment/src/moment";
import { dateParse } from "./date-parse";
import DeviceInfo from "@dreamworld/device-info";
import { dateFormat } from "./utils";

const KeyCode = {
  ENTER: 13,
};

export class DateInput extends DwInput {
  static get styles() {
    return [
      ...DwInput.styles,
      css`
        .mdc-text-field__icon:not([tabindex]),
        .mdc-text-field__icon[tabindex="-1"] {
          pointer-events: auto;
        }
      `,
    ];
  }
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
       * Input property.
       * Set `true` to enable warning when user enters future date.
       * Note: Error has high priority so when error message is displayed, this warning will not be displayed
       */
      showFutureWarning: { type: Boolean, reflect: true },

      /**
       * Date separator. Possible value: `/` or  `-`
       */
      _separator: { type: String },

      /**
       * Whether date picker dialog is opened or not
       */
      _datePickerOpened: { type: Boolean },

      /**
       * Whether device has virtual Kayboard or not
       */
      _virtualKeyboard: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.iconTrailing = "date_range";
    this.allowedPattern = "^[a-zA-Z0-9-/,_ ]*$";
    this.clickableIcon = false; // Set true when date picker support added
    this.validator = this._customValidator;
    this.inputFormat = "dd/mm/yyyy";
    this._separator = "/";
    this.showFutureWarning = false;
    this._datePickerOpened = false;
    this._virtualKeyboard = DeviceInfo.info().vkb;

    this.addEventListener("enter", this._onEnter);
    this.addEventListener("paste", this._onPaste);
    this.addEventListener("blur", this._onBlur);
    this.addEventListener("click", this._onClick);
    this.addEventListener("keydown", this._onKeyDownEvent);
  }

  set value(val) {
    let oldValue = this._value;

    if (oldValue === val) {
      return;
    }

    this._value = this.parseValue(val);

    this.requestUpdate("value", oldValue);
  }

  get value() {
    return this._value;
  }

  render() {
    return html`${super.render()}${this._datePickerTemplate}`;
  }

  get _getSuffixTemplate() {
    return html`<dw-icon-button
      class="mdc-text-field__icon"
      icon="${this.iconTrailing}"
      .iconSize=${this.iconSize}
      .buttonSize=${this.iconButtonSize}
      ?disabled="${this.disabled}"
      tabindex="-1"
      @click=${this._onDateIconClick}
    ></dw-icon-button>`;
  }

  get _datePickerTemplate() {
    if (!this._datePickerOpened) {
      return nothing;
    }

    import("./dw-date-picker-dialog.js");
    return html`<dw-date-picker-dialog
      .opened=${true}
      .triggerElement=${this}
      .value=${this._getDialogDateFormat(this.value)}
      .min=${this.minDate}
      .max=${this.maxDate}
      @change=${this._onDateChange}
      @dw-dialog-closed=${this._onDatePickerDialogClosed}
    ></dw-date-picker-dialog>`;
  }

  _getDialogDateFormat(value) {
    return moment(value, this.inputFormat.toUpperCase()).format(dateFormat);
  }

  firstUpdated(changedProps) {
    super.firstUpdated && super.firstUpdated(changedProps);

    if (changedProps.has("inputFormat")) {
      this._separator = this.inputFormat.slice(2, 3);
    }

    if (this.value) {
      this.value = this.parseValue(this.value);
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

    if (this.showFutureWarning) {
      return moment(value).isSameOrBefore(moment());
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

  _onClick(e) {
    if (!this._virtualKeyboard) {
      return;
    }

    this._datePickerOpened = true;
  }

  _onDatePickerDialogClosed(e) {
    this._datePickerOpened = false;
  }

  _onKeyDownEvent(e) {
    if (e.keyCode === KeyCode.ENTER) {
      this._datePickerOpened = !this._datePickerOpened;
    }
  }

  _onDateIconClick(e) {
    this._datePickerOpened = true;
  }

  _onDateChange(e) {
    console.log("_onDateChange", e);
    this.value = this.parseValue(e.detail);
    this._updateTextfieldValue();
    this.validate();
  }
}

window.customElements.define("date-input", DateInput);
