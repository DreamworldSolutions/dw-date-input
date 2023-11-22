import { html, css, LitElement } from "@dreamworld/pwa-helpers/lit.js";
import { isElementAlreadyRegistered } from "@dreamworld/pwa-helpers/utils.js";
import { DwFormElement } from "@dreamworld/dw-form/dw-form-element";
import moment from "moment/src/moment";
import "./date-input";

const defaultErrorMessages = {
  minDate: "Date must be > {minDate}",
  maxDate: "Date must be < {maxDate}",
  minMaxDate: "Date must be between {minDate} and {maxDate}",
  invalidDate: "Date is invalid",
  showFutureError: "Future date is not allowed.",
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
      errorMessages: { type: Object },

      /**
       * Set to true to make input field readonly.
       */
      readOnly: { type: Boolean },

      /**
       * True if the last call to `reportValidity` is invalid.
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
       * Input property
       * It could be either `String` or `Function`.
       */
      error: { type: Object },

      /**
       * Input property.
       * Set `true` to show error message when user selects future date.
       */
      showFutureError: { type: Boolean, reflect: true },

      /**
       * Input property.
       * Set `true` to enable warning when user enters future date.
       * Note: Error has high priority so when error message is displayed, this warning will not be displayed
       */
      showFutureWarning: { type: Boolean, reflect: true },

      /**
       * Input property.
       * Text to show the warning message.
       * It could be either `String` or `Function`.
       */
      warning: { type: Object },

      /**
       * Whether to show hint in tooltip
       * tip trigger on hover of info, warning, and error icon button at trail.
       */
      hintInTooltip: {type: Boolean},

      /**
       * Whether to show error in tooltip
       * tip trigger on hover of info, warning, and error icon button at trail.
       */
      errorInTooltip: { type: Boolean },

      /**
       * Whether to show warning in tooltip
       * tip trigger on hover of info, warning, and error icon button at trail.
       */
      warningInTooltip: { type: Boolean },

      /**
       * Tooltip actions for hint text
       */
      hintTooltipActions: { type: Array },

      /**
       * Tooltip actions for error text
       */
      errorTooltipActions: { type: Array },

      /**
       * Tooltip actions for warning text
       */
      warningTooltipActions: { type: Array },

      /**
       * Tooltip placement
       * for more see tippyJs doc: https://atomiks.github.io/tippyjs/v6/all-props/#placement
       */
      tipPlacement: { type: String },
    };
  }

  /**
   * Sets static errorMessages. Its used at application level.
   * @param {Object} errorMessages 
   */
  static setErrorMessages(errorMessages) {
    this.errorMessages = {...this.errorMessages, ...errorMessages};
  }

  get _errorMessages() {
    const errorMessages = this.errorMessages || {};
    return {...DwDateInput.errorMessages, ...errorMessages }
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
    this.errorMessages = defaultErrorMessages;
    this.showFutureError = false;
    this.showFutureWarning = false;
  }

  render() {
    return html`
      <date-input
        id="dateInput"
        .inputFormat="${this.inputFormat}"
        .label="${this.label}"
        ?disabled="${this.disabled}"
        .invalid=${this.invalid}
        ?noLabel="${this.noLabel}"
        ?required="${this.required}"
        ?readOnly="${this.readOnly}"
        ?autoSelect="${this.autoSelect}"
        ?dense="${this.dense}"
        ?hintPersistent="${this.hintPersistent}"
        .placeholder="${this.placeholder}"
        ?highlightChanged="${this.highlightChanged}"
        ?noHintWrap="${this.noHintWrap}"
        .date="${this.value}"
        .originalDate="${this.originalValue}"
        .name="${this.name}"
        .hint="${this.hint}"
        .minDate="${this.minDate}"
        .maxDate="${this.maxDate}"
        .showFutureWarning=${this.showFutureWarning}
        .showFutureError=${this.showFutureError}
        .warning=${this.warning}
        .error=${this.error}
        .hintInTooltip="${this.hintInTooltip}"
        .errorInTooltip="${this._errorInTooltip}"
        .warningInTooltip="${this.warningInTooltip}"
        .hintTooltipActions="${this.hintTooltipActions}"
        .errorTooltipActions="${this.errorTooltipActions}"
        .warningTooltipActions="${this.warningTooltipActions}"
        .tipPlacement="${this.tipPlacement}"
        .errorMessages="${this._errorMessages}"
        @change=${this._onChange}
        @blur=${this._onBlur}
      ></date-input>
    `;
  }

  async focus() {
    await this.updateComplete;
    const el = this.renderRoot.querySelector("date-input");
    el && el.focus();
  }

  _onChange(e) {
    let dateInputed = e.target.value;
    const inputFormat = this.inputFormat.toUpperCase();
    dateInputed = moment(dateInputed, inputFormat);
    let date = "";
    if (dateInputed.isValid()) {
      dateInputed = dateInputed.toDate();
      date = moment(dateInputed, inputFormat).format(
        this.valueFormat.toUpperCase()
      );
    }

    this.dispatchEvent(new CustomEvent("change", { detail: { value: date } }));
  }

  _onBlur(e) {
    let value = e.target.value;
    const inputFormat = this.inputFormat.toUpperCase();
    value = value ? moment(value, inputFormat).format("YYYY-MM-DD") : ``;
    this.value = value;
  }

  /**
   * Performs validatio of input
   * Returns true if validation is passedisValid
   */
  checkValidity() {
    return this.renderRoot.querySelector("#dateInput")?.checkValidity();
  }

  /* Call this to perform validation of the date input */
  // TODO: remove this when `dw-form` elements are updated as per new specs.
  validate() {
    return this.reportValidity();
  }

  reportValidity() {
    return this.renderRoot.querySelector("#dateInput")?.validate();
  }
}

if (isElementAlreadyRegistered("dw-date-input")) {
  console.warn(
    "lit: 'dw-date-input' is already registered, so registration skipped."
  );
} else {
  window.customElements.define("dw-date-input", DwDateInput);
}

DwDateInput.errorMessages = defaultErrorMessages;