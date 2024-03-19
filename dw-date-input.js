import { html, css, LitElement } from "@dreamworld/pwa-helpers/lit.js";
import { isElementAlreadyRegistered } from "@dreamworld/pwa-helpers/utils.js";
import { DwFormElement } from "@dreamworld/dw-form/dw-form-element";
import dayjs from 'dayjs/esm/index.js';
import customParseFormat from 'dayjs/esm/plugin/customParseFormat';
dayjs.extend(customParseFormat);

import "./date-input";
import './dw-date-picker';
import './dw-date-input-dialog';

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
          --dw-popover-border-radius: 18px;
        }

        :host([mobile-mode]),
        :host([tablet-mode]) {
          user-select: none;
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
      hintInTooltip: { type: Boolean },

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

      // START: Date-picker properties
      /**
       * Date-picker
       * Trigger element for which `popover` dialog is opened.
       */
      triggerElement: { type: Object },

      /**
       * Date-picker
       * Element in which content will be appened. Default is parent element of trigger element.
       */
      appendTo: { type: Object },

      /**
       * Date-picker
       * Input property.
       * Element z-index, default value is 9999.
       */
      zIndex: { type: Number },

      /**
       * Date-picker
       * Input property.
       * Display in mobile mode (full screen).
       */
      mobileMode: { type: Boolean, reflect: true, attribute: 'mobile-mode' },

      /**
       * Date-picker
       * Input property.
       * Display in tablet mode.
       */
      tabletMode: { type: Boolean, reflect: true, attribute: 'tablet-mode' },
      // END: Date-picker properties
    };
  }

  /**
   * Getter of `inputFormat` property.
   */
  get inputFormat() {
    return this._inputFormat && this._inputFormat.toUpperCase() || this._inputFormat;
  }

  /**
   * Setter of `inputFormat` property.
   */
  set inputFormat(value) {
    let oldValue = this._inputFormat;
    if (value === oldValue) {
      return;
    }
    this._inputFormat = value;
    this.requestUpdate("inputFormat", oldValue);
  }

  /**
   * Getter of `valueFormat` property.
   */
  get valueFormat() {
    return this._valueFormat && this._valueFormat.toUpperCase() || this._valueFormat;
  }

  /**
   * Setter of `valueFormat` property.
   */
  set valueFormat(value) {
    let oldValue = this._valueFormat;
    if (value === oldValue) {
      return;
    }
    this._valueFormat = value;
    this.requestUpdate("valueFormat", oldValue);
  }

  /**
   * Sets static errorMessages. Its used at application level.
   * @param {Object} errorMessages
   */
  static setErrorMessages(errorMessages) {
    this.errorMessages = { ...this.errorMessages, ...errorMessages };
  }

  get _errorMessages() {
    const errorMessages = this.errorMessages || {};
    return { ...DwDateInput.errorMessages, ...errorMessages };
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
    this.inputFormat = "DD/MM/YYYY";
    this.valueFormat = "YYYY-MM-DD";
    this.highlightChanged = false;
    this.errorMessages = defaultErrorMessages;
    this.showFutureError = false;
    this.showFutureWarning = false;
    this.appendTo = 'parent';
    this.zIndex = 9999;
    this.mobileMode = false;
    this.tabletMode = false;
    this._onClick = this._onClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this._onClick);
  }

  render() {
    return html`
      ${this.dateInputTemplate}
      ${this.datePickerTemplate}
      ${this.dateInputDialogTemplate}
    `;
  }

  get dateInputTemplate() {
    return html`
      <div class="date-input">
        <date-input
          id="dateInput"
          .iconTrailing=${'date_range'}
          .clickableIcon=${true}
          .inputFormat="${this.inputFormat}"
          .valueFormat=${this.valueFormat}
          .label="${this.label}"
          ?disabled="${this.disabled}"
          .invalid=${this.invalid}
          ?noLabel="${this.noLabel}"
          ?required="${this.required}"
          ?readOnly="${this.readOnly || this.mobileMode || this.tabletMode}"
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
          .warning=${this._warning}
          .error=${this._error}
          .hintInTooltip="${this.hintInTooltip}"
          .errorInTooltip="${this.errorInTooltip}"
          .warningInTooltip="${this.warningInTooltip}"
          .hintTooltipActions="${this.hintTooltipActions}"
          .errorTooltipActions="${this.errorTooltipActions}"
          .warningTooltipActions="${this.warningTooltipActions}"
          .tipPlacement="${this.tipPlacement}"
          .errorMessages="${this._errorMessages}"
          @change=${this._onChange}
        ></date-input>
      </div>
    `;
  }

  get dateInputDialogTemplate() {
    return html`
      <dw-date-input-dialog
        date-picker="false"
        .type=${"modal"}
        .placement=${'center'}
        .inputFormat="${this.inputFormat}"
        .valueFormat=${this.valueFormat}
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
        .value="${this.value}"
        .originalDate="${this.originalValue}"
        .name="${this.name}"
        .hint="${this.hint}"
        .minDate="${this.minDate}"
        .maxDate="${this.maxDate}"
        .showFutureWarning=${this.showFutureWarning}
        .showFutureError=${this.showFutureError}
        .warning=${this._warning}
        .error=${this._error}
        .hintInTooltip="${this.hintInTooltip}"
        .errorInTooltip="${this.errorInTooltip}"
        .warningInTooltip="${this.warningInTooltip}"
        .hintTooltipActions="${this.hintTooltipActions}"
        .errorTooltipActions="${this.errorTooltipActions}"
        .warningTooltipActions="${this.warningTooltipActions}"
        .tipPlacement="${this.tipPlacement}"
        .errorMessages="${this._errorMessages}"
        @dw-dialog-closed=${(e) => this._triggerDateInputDialogOpenedChanged(false)}
        @dw-dialog-opened=${(e) => this._triggerDateInputDialogOpenedChanged(true)}
        @mode-changed=${this._onDateInputDialogModeChanged}
        @change=${this._onChange}
      >
      </dw-date-input-dialog>
    `;
  }

  get datePickerTemplate() {
    return html`
      <dw-date-picker
        date-picker="false"
        .type=${this.mobileMode ? "modal" : "popover"}
        .popoverAnimation=${"expand"}
        .placement=${'bottom'}
        .mobileMode=${this.mobileMode}
        .tabletMode=${this.tabletMode}
        .showTrigger=${true}
        .appendTo=${this.appendTo}
        .zIndex=${this.zIndex}
        .value=${this.value}
        .inputFormat=${this.inputFormat}
        .valueFormat=${this.valueFormat}
        .triggerElement=${this.triggerElement}
        .excludeOutsideClickFor=${'date-input'}
        @dw-dialog-closed=${(e) => this._triggerDatePickerOpenedChanged(false)}
        @dw-dialog-opened=${(e) => this._triggerDatePickerOpenedChanged(true)}
        @mode-changed=${this._onDatePickerModeChanged}
        @change=${this._onDatePickerDateChange}
      >
      </dw-date-picker>
    `;
  }

  _onClick(e) {
    const paths = e.composedPath && e.composedPath() || e.path || [];
    let openDatePickerDialog = true;
    if(paths && paths.length) {
      paths.forEach((el) => {
        if(openDatePickerDialog) {
          const datePicker = el && el.getAttribute && el.getAttribute('date-picker') || '';
          if(datePicker === 'false') {
            openDatePickerDialog = false;
          }
        }
      });
    }
    if(openDatePickerDialog && this.datePicker && !this.datePicker.opened) {
      this.renderRoot.querySelector("#dateInput")?.showTrailingIconRipple();
      this._openDatePicker();
    }
  }

  firstUpdated(changeProps) {
    super.firstUpdated && super.firstUpdated(changeProps);
    if (!this.triggerElement) {
      this.triggerElement = this.renderRoot.querySelector("#dateInput");
    }
  }

  get datePicker() {
    return this.renderRoot.querySelector("dw-date-picker");
  }

  get dateInputDialog() {
    return this.renderRoot.querySelector("dw-date-input-dialog");
  }

  _triggerDateInputDialogOpenedChanged(opened) {
    this.dispatchEvent(
      new CustomEvent("date-input-dialog-opened-changed", {
        detail: {
          opened,
        },
      })
    );
  }

  _triggerDatePickerOpenedChanged(opened) {
    this.dispatchEvent(
      new CustomEvent("date-picker-opened-changed", {
        detail: {
          opened,
        },
      })
    );
  }

  _onDatePickerModeChanged(e) {
    if (this.dateInputDialog) {
      this.dateInputDialog.opened = true;
    }
  }

  _onDateInputDialogModeChanged(e) {
    if (this.datePicker) {
      this.datePicker.opened = true;
    }
  }

  _onDatePickerValueChanged(e) {
    const value = e?.detail?.value || "";
    if(value) {
      this.value = value;
      this.validate();
      this.dispatchEvent(new CustomEvent("change", { detail: { value } }));
    }
  }

  _openDatePicker() {
    if (this.datePicker) {
      this.datePicker.opened = true;
    }
  }

  /**
   * This getter is written because it is used when someone extends this component, and it has some custom validations.
   * They can override this getter method and add custom validations and call super.
   *
   * NOTE:
   * Q. Why can't extended components use the "error" property? Why is this method needed?
   * Ans. If the extended components use the "error" property, then at integration time, the integrator can't set an error,
   * and if it does, that component's deflection validation will not work.
   */
  get _error() {
    return this.error;
  }

  /**
   * This getter is written because it is used when someone extends this component, and it has some custom warnings.
   * They can override this getter method and add custom warnings and call super.
   *
   * NOTE:
   * Q. Why can't extended components use the "warning" property? Why is this method needed?
   * Ans. If the extended components use the "warning" property, then at integration time, the integrator can't set an warning,
   * and if it does, that component's deflection validation will not work.
   */
  get _warning() {
    return this.warning;
  }

  async focus() {
    await this.updateComplete;
    const el = this.renderRoot.querySelector("date-input");
    el && el.focus();
  }

  _onDatePickerDateChange(e) {
    const value = e?.detail?.value || "";
    if(value) {
      this.value = value;
      this.validate();
      this.dispatchEvent(new CustomEvent("change", { detail: { value } }));
    }
  }

  _onChange(e) {
    if(e && e.target) {
      const dateInputed = dayjs(e.target.value, this.inputFormat);
      const date = dateInputed.isValid() ? dateInputed.format(this.valueFormat): "";
      const lastValue = this.value;
      this.value = date || this.value;
      this.validate();
      this.dispatchEvent(new CustomEvent("change", { detail: { value: date } }));
    }
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

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this._onClick);
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