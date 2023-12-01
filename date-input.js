import { DwInput } from "@dreamworld/dw-input/dw-input";
import moment from "moment/src/moment";
import { dateParse } from "./date-parse";

export class DateInput extends DwInput {
  static get properties() {
    return {

      date: { type: String },

      originalDate: { type: String },

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
    };
  }

  constructor() {
    super();
    this.iconTrailing = "date_range";
    this.allowedPattern = "^[a-zA-Z0-9-/,_ ]*$";
    this.clickableIcon = false; // Set true when date picker support added
    this.inputFormat = "DD/MM/YYYY";
    this._separator = "/";
    this.showFutureError = false;
    this.showFutureWarning = false;
    this.addEventListener("enter", this._onEnter);
    this.addEventListener("paste", this._onPaste);
    this.addEventListener("blur", this._onBlur);
  }

  connectedCallback() {
    super.connectedCallback();

    this.originalValue = this.originalDate ? this.parseValue(moment(this.originalDate, 'YYYY-MM-DD').format(this.inputFormat.toUpperCase())) : '';
  }

  firstUpdated(changedProps) {
    super.firstUpdated && super.firstUpdated(changedProps);

    if (changedProps.has("inputFormat")) {
      this._separator = this.inputFormat.slice(2, 3);
    }
  }

  willUpdate(changedProps){
    super.willUpdate(changedProps);
    if(changedProps.has('date')){
      this.value = this.date ? this.parseValue(moment(this.date, 'YYYY-MM-DD').format(this.inputFormat.toUpperCase())) : '';
    }
    if(changedProps.has('originalDate')){
      this.originalValue = this.originalDate ? this.parseValue(moment(this.originalDate, 'YYYY-MM-DD').format(this.inputFormat.toUpperCase())) : '';
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
   * @returns {String} Warning message by state
   */
  _customWarning() {
    if (this.showFutureWarning) {
      const todayDate = moment().format('YYYY-MM-DD');
      if (this.date > todayDate) {
        return "Future date is selected";
      } else {
        return "";
      }
    }

    return "";
  }

  /**
   * Performs date validations like required, minDate, maxDate, invalid
   * @param {String} value - date entered by value
   * @returns {Boolean} returns false if it's invalid
   */
  _customError() {
    let value = this.value ? this.value.replace(/ /g, "") : '';
    const inputFormat = this.inputFormat ? this.inputFormat.toUpperCase() : "DD/MM/YYYY";
    if(!value){
      return '';
    }

    if (!moment(value, inputFormat, true).isValid()) {
      return this.errorMessages["invalidDate"];
    }
    
    value = moment(value, inputFormat).format('YYYY-MM-DD');
    let errorText;
    let minDate = this.minDate && moment(this.minDate).format('YYYY-MM-DD');
    let maxDate = this.maxDate && moment(this.maxDate).format('YYYY-MM-DD');

    if (this.maxDate && this.minDate && (value >= maxDate || value <= minDate)) {
      errorText = this.errorMessages["minMaxDate"];
      errorText = errorText.replace("{maxDate}", this.maxDate);
      errorText = errorText.replace("{minDate}", this.minDate);
      return errorText;
    }

    if (this.maxDate && value >= maxDate) {
      errorText = this.errorMessages["minDate"];
      return errorText.replace("{minDate}", this.maxDate);
    }

    if (this.minDate && value <= minDate) {
      errorText = this.errorMessages["maxDate"];
      return errorText.replace("{maxDate}", this.minDate);
    }

    const todayDate = moment().format('YYYY-MM-DD');
    if (this.showFutureError && value >= todayDate) {
      return this.errorMessages["showFutureError"];
    }

    return super._customError();
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

  get _warning() {
    if (this.invalid) return;

    let warningMsg = "";

    warningMsg = this._customWarning();

    if (warningMsg) {
      return warningMsg;
    }

    return super._warning;
  }
}

window.customElements.define("date-input", DateInput);
