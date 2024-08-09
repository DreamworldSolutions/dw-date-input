import { html, css, nothing } from '@dreamworld/pwa-helpers/lit.js';
import { classMap } from 'lit/directives/class-map.js';
import { DwInput } from "@dreamworld/dw-input/dw-input";
import { dateParse } from "./date-parse";
import dayjs from 'dayjs/esm/index.js';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/esm/plugin/isSameOrAfter'
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

export class DateInput extends DwInput {
  static get styles() {
    return [
      super.styles,
      css`
        :host([readonly]) .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon,
        :host([readonly]) .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {
          visibility: hidden;
        }

        :host([mobile-mode]) input,
        :host([tablet-mode]) input {
          pointer-events: none;
        }

        .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-text-field__icon,
        .mdc-text-field--with-trailing-icon.mdc-text-field--outlined .mdc-text-field__icon {
          right: 4px;
          top: 8px;
          height: 40px;
        }

        .mdc-text-field--with-leading-icon.mdc-text-field--dense .mdc-text-field__icon, 
        .mdc-text-field--with-trailing-icon.mdc-text-field--dense .mdc-text-field__icon {
          transform: scale(1);
          right: 4px;
          top: 4px;
          height: 40px;
        }

        .mdc-text-field--outlined .mdc-text-field__input {
          padding: var(--dw-date-input-padding, 12px 16px 14px);
        }

        .mdc-text-field__icon:not([tabindex]),
        .mdc-text-field__icon[tabindex='-1'] {
          pointer-events: auto;
        }
      `
    ]
  }
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
       * Uppercase of `inputFormat`
       */
      _inputFormat: { type: String },

      /**
       * date value format
       * default `yyyy-mm-dd`.
       */
      valueFormat: { type: String },

      /**
       * Uppercase of `valueFormat`
       */
      _valueFormat: { type: String },

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
       * Display in mobile mode.
       */
      mobileMode: { type: Boolean, reflect: true, attribute: 'mobile-mode' },

      /**
       * Display in tablet mode.
       */
      tabletMode: { type: Boolean, reflect: true, attribute: 'tablet-mode' },
    };
  }

  constructor() {
    super();
    this.clickableIcon = true;
    this.iconButtonSize = 40;
    this.iconSize = 20;
    this._inputFormat = "DD/MM/YYYY";
    this._valueFormat = "YYYY-MM-DD";
    this.separator = "/";
    this.showFutureError = false;
    this.showFutureWarning = false;
    this.autoSelect = true;
    this._onBlur = this._onBlur.bind(this);
    this.addEventListener("enter", this._onEnter);
    this.addEventListener("paste", this._onPaste);
    this.addEventListener("blur", this._onBlur);
  }

  connectedCallback() {
    super.connectedCallback && super.connectedCallback();
    this.originalValue = this.originalDate ? this.parseValue(dayjs(this.originalDate, this._valueFormat).format(this._inputFormat)) : '';
    this.updateComplete.then(() => {
      this._updateDateTextfieldValue();
    });
  }

  willUpdate(changedProps){
    super.willUpdate(changedProps);
    if (changedProps.has("inputFormat")) {
      this._inputFormat = this.inputFormat ? this.inputFormat.toUpperCase() : 'DD/MM/YYYY';
      this.separator = this._inputFormat.slice(2, 3);
    }

    if (changedProps.has("valueFormat")) {
      this._valueFormat = this.valueFormat ? this.valueFormat.toUpperCase() :  'YYYY-MM-DD';
    }

    if(changedProps.has('date')){
      this.value = this.date ? this.parseValue(dayjs(this.date, this._valueFormat).format(this._inputFormat)) : '';
    }

    if(changedProps.has('originalDate')){
      this.originalValue = this.originalDate ? this.parseValue(dayjs(this.originalDate, this._valueFormat).format(this._inputFormat)) : '';
    }
  }
   
  get _getSuffixIconTrailingTemplate() {
    const tooltipClass = {
      hint: this.hint && this.hintInTooltip && !this._warning && !this.invalid,
      warning: this._warning && this.warningInTooltip && !this.invalid,
      error: this.invalid && this.errorInTooltip,
    };
    const shouldOpenTooltipOnHover = !this._vkb && !(this.hint && this.hintInTooltip);
    const offset = this._extraOptions?.offset ? this._extraOptions.offset : [0,8];

    return html`<dw-icon-button
        id="trailingIcon"
        class="mdc-text-field__icon ${classMap(tooltipClass)}"
        icon="${this.iconTrailing}"
        .iconSize=${this.iconSize}
        .buttonSize=${this.iconButtonSize}
        ?disabled="${this.disabled}"
        tabindex="${this.clickableIcon ? -1 : ''}"
        .symbol=${this.symbol}
      ></dw-icon-button>
      ${(this.error && this.errorInTooltip) || (this.warning && this.warningInTooltip) || (this.hint && this.hintInTooltip)
        ? html`
            <dw-tooltip
              for="trailingIcon"
              trigger=${this._vkb ? 'mouseenter click' : 'mouseenter'}
              .offset=${offset}
              .forEl=${shouldOpenTooltipOnHover ? this : ``}
              .extraOptions=${this._extraOptions}
              .placement="${this.tipPlacement}"
              .content=${this._trailingIconTooltipContent}
            >
            </dw-tooltip>
          `
        : nothing}`;
  }

  updated(changedProps) {
    super.updated && super.updated(changedProps);
    if (changedProps.has('date')) {
      this._updateDateTextfieldValue();
    }
  }

  /**
   * Updates text-field's value based on the current value of `value` property.
   * It applies formatting.
   */
  _updateTextfieldValue() {
    this._updateDateTextfieldValue();
  }

  /**
   * Updates text-field's value based on the current value of `value` property.
   * It applies formatting.
   */
  _updateDateTextfieldValue() {
    if (!this._textFieldInstance) {
      return;
    }

    let text = this.formatDateText(this.value);
    this._textFieldInstance.value = text || '';
  }

  formatDateText() {
    return this.value && this.value.replace(/ /g, "").split(`${this.separator}`).join(` ${this.separator} `);
  }

  parseDateValue(value) {
    if (!value) {
      return "";
    }
    return dateParse(value, this._inputFormat);
  }

  /**
   * @returns {String} Warning message by state
   */
  _customWarning() {
    if(!this.date) {
      return "";
    }
    if (this.showFutureWarning) {
      if (!dayjs().isSameOrAfter(this.date, 'day')) {
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
    if(!value){
      return '';
    }

    if (!dayjs(value, this._inputFormat, true).isValid()) {
      return this._errorMessages["invalidDate"];
    }
    
    value = dayjs(value, this._inputFormat).format(this._valueFormat);
    let errorText;
    let minDate = this.minDate && dayjs(this.minDate).format(this._valueFormat);
    let maxDate = this.maxDate && dayjs(this.maxDate).format(this._valueFormat);

    if (this.maxDate && this.minDate && (value > maxDate || value < minDate)) {
      errorText = this._errorMessages["minMaxDate"];
      errorText = errorText.replace("{maxDate}", this.maxDate);
      errorText = errorText.replace("{minDate}", this.minDate);
      return errorText;
    }

    if (this.maxDate && value > maxDate) {
      errorText = this.errorMessages && this.errorMessages["maxDate"] || '';
      return errorText.replace("{maxDate}", this.maxDate);
    }

    if (this.minDate && value < minDate) {
      errorText = this.errorMessages && this.errorMessages["minDate"] || '';
      return errorText.replace("{minDate}", this.minDate);
    }

    const todayDate = dayjs().format(this._valueFormat);
    if (this.showFutureError && value > todayDate) {
      return this._errorMessages["showFutureError"];
    }

    return super._customError();
  }

  _onInput(e) {
    if(this.error && this.errorInTooltip) {
      const tipElement = this.renderRoot.querySelector('dw-tooltip');
      tipElement && tipElement.hide();
    }

    if (!this._textFieldInstance) {
      console.warn('dw-input: Somehow "_onInput" method is triggered after "disconnectedCallback"');
      return;
    }
    
    const value = this.parseValue(this._textFieldInstance.value, true);
    this.___dateInputValue = value;
  }

  _onEnter(e) {
    const inputValue = this._getCurrentInputValue() || e?.detail?.value;
    const value = this.parseDateValue(inputValue);
    this.value = value || inputValue;
    this.validate();
    this._updateDateTextfieldValue();
    this.dispatchEvent(new CustomEvent("change"));
  }

  _onPaste(e) {
    e.preventDefault && e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    const inputValue = paste || this._getCurrentInputValue();
    const value = this.parseDateValue(inputValue);
    this.value = value || paste;
    this.validate();
    this._updateDateTextfieldValue();
    this.dispatchEvent(new CustomEvent("change"));
  }

  _onBlur(e) {
    const inputValue = e?.target?.value || e?.detail?.value || this._getCurrentInputValue() || this.___dateInputValue;
    const value = this.parseDateValue(inputValue);
    this.value = value || inputValue;
    this.validate();
    this._updateDateTextfieldValue();
    this.dispatchEvent(new CustomEvent("change"));
  }

  _getCurrentInputValue() {
    return this._textFieldInstance?.value || this._textFieldInstance?.input?.value || '';
  }

  showTrailingIconRipple() {
    const icon = this?.renderRoot?.querySelector('#trailingIcon');
    if(icon) {
      icon?.__onStart();
      setTimeout(() => {
        icon?.__fadeOut();
      }, 250)
    }
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
