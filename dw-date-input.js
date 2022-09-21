import { html, css } from "lit-element";
import { LitElement } from "@dreamworld/pwa-helpers/lit-element.js";
import { isElementAlreadyRegistered } from "@dreamworld/pwa-helpers/utils.js";
import { DwFormElement } from "@dreamworld/dw-form/dw-form-element";
import moment from "moment/src/moment";
import "./date-input";

const errorMessagesByStateMap = {
  REQUIRED: "Required",
  MIN_DATE: "Date must be > {minDate}",
  MAX_DATE: "Date must be < {maxDate}",
  MIN_MAX_DATE: "Date must be between {minDate} and {maxDate}",
  INVALID_DATE: "Date is invalid",
  SHOW_FUTURE_WARNING: "Future date is not allowed.",
};

export class DwDateInput extends DwFormElement(LitElement) {
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          outline: none;
          position: relative;
        }

        :host[hidden] {
          display: none;
        }
      `,
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
       * it should be `dd/mm/yyyy`(default) or `mm/dd/yyyy`
       */
      inputFormat: { type: String },

      /**
       * date value format
       * default `yyyy-mm-dd`.
       */
      valueFormat: { type: String },

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

      /**
       * Input property.
       * `true` if when to show hint text in oneline. Default hint text is shown in dropdown width area in multiline.
       */
      noHintWrap: { type: Boolean, reflect: true },

      /**
       * Output property
       * Possible value: REQUIRED, NOT_A_DATE, RANGE
       * Set to `true` when user entered value can not be parsed to a Date.
       */
      error: { type: String, reflect: true },

      /**
       * Input property.
       * Set `true` to enable warning when user enters future date.
       * Note: Error has high priority so when error message is displayed, this warning will not be displayed
       */
      showFutureWarning: { type: Boolean, reflect: true },
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
        ?noHintWrap="${this.noHintWrap}"
        .value="${this.value}"
        .name="${this.name}"
        .hint="${this.hint}"
        .minDate="${this.minDate}"
        .maxDate="${this.maxDate}"
        .showFutureWarning="${this.showFutureWarning}"
        .errorMessage=${this._getErrorMessage(this.value, this.errorMessagesByState)}
        @change=${this._onChange}
      ></date-input>
    `;
  }

  constructor() {
    super();
    this.disabled = false;
    this.noLabel = false;
    this.required = false;
    this.readOnly = false;
    this.placeholder = "";
    this.value = "";
    this.originalValue = "";
    this.dense = false;
    this.name = "";
    this.hint = "";
    this.hintPersistent = false;
    this.invalid = false;
    this.autoSelect = false;
    this.inputFormat = "dd/mm/yyyy";
    this.valueFormat = "yyyy-mm-dd";
    this.highlightChanged = false;
    this.errorMessagesByState = errorMessagesByStateMap;
    this.showFutureWarning = false;
  }

  set errorMessagesByState(value) {
    let oldValue = this._errorMessagesByState;

    this._errorMessagesByState = { ...errorMessagesByStateMap, ...value };
    this.requestUpdate("errorMessagesByState", oldValue);
  }

  get errorMessagesByState() {
    return this._errorMessagesByState;
  }

  /**
   * @param {String} value - Current entered date
   * @param {Object} errorMessage - ErrorMessage map by possible error state
   * @returns {String} Error message by state
   */
  _getErrorMessage(value, errorMessage) {
    if (!value) {
      return errorMessage["REQUIRED"];
    }

    let errorText;
    value = value.replace(/ /g, "");

    if (!moment(value, this.valueFormat.toUpperCase(), true).isValid()) {
      return errorMessage["INVALID_DATE"];
    }

    if (this.showFutureWarning) {
      errorText = errorMessage["SHOW_FUTURE_WARNING"];
      return errorText;
    }

    if (this.minDate && this.maxDate) {
      errorText = errorMessage["MIN_MAX_DATE"];
      errorText = errorText.replace("{maxDate}", this.maxDate);
      errorText = errorText.replace("{minDate}", this.minDate);
      return errorText;
    }

    if (this.minDate) {
      errorText = errorMessage["MIN_DATE"];
      return errorText.replace("{minDate}", this.minDate);
    }

    if (this.maxDate) {
      errorText = errorMessage["MAX_DATE"];
      return errorText.replace("{maxDate}", this.maxDate);
    }
  }

  /**
   * Sets selected date as input's value
   */
  _onSelectedDateChanged(e) {
    if (!e.detail.value) {
      return;
    }

    let selectedDate = moment(e.detail.value, "YYYY-MM-DD").format(this.inputFormat.toUpperCase());
    this.value = selectedDate;

    setTimeout(() => {
      this.layout();
    });
  }

  _getSelectedDate(value) {
    if (value) {
      value = value.replace(/ /g, "");
      return moment(value, this.inputFormat.toUpperCase()).format("YYYY-MM-DD");
    }
  }

  _onChange(e) {
    let dateInputed = e.target.value;
    dateInputed = moment(dateInputed, this.inputFormat.toUpperCase());
    let date = "";
    if (dateInputed.isValid()) {
      dateInputed = dateInputed.toDate();
      date = moment(dateInputed).format(this.valueFormat.toUpperCase());
    }

    this.dispatchEvent(new CustomEvent("change", { detail: { value: date } }));
  }
}

if (isElementAlreadyRegistered("dw-date-input")) {
  console.warn("lit: 'dw-date-input' is already registered, so registration skipped.");
} else {
  window.customElements.define("dw-date-input", DwDateInput);
}
