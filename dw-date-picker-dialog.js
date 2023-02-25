import { css, html, nothing } from "@dreamworld/pwa-helpers/lit";
import { DwCompositeDialog } from "@dreamworld/dw-dialog/dw-composite-dialog.js";
import "./dw-date-picker.js";
import DeviceInfo from "@dreamworld/device-info";
import moment from "moment/src/moment";
import "@dreamworld/dw-input";
import "@material/mwc-button";

// Styles
import * as TypographyLiterals from "@dreamworld/material-styles/typography-literals";
import { dateParse } from "./date-parse.js";

export class DwDatePickerDialog extends DwCompositeDialog {
  static get styles() {
    return [
      ...DwCompositeDialog.styles,
      css`
        :host {
          --dw-dialog-content-padding: 4px 0 4px 0;
          --dw-dialog-header-padding: 0;
        }

        :host([type="popover"]) #popover_dialog__surface {
          width: auto;
        }

        .heading-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 16px;
        }

        :host(:not([_editMode])[type="modal"]) .mdc-dialog .mdc-dialog__title,
        :host(:not([_editMode])[type="popover"]) header {
          border-bottom: solid 1px var(--mdc-theme-divider-color, rgba(0, 0, 0, 0.12)) !important;
          box-sizing: border-box;
        }

        :host([type="modal"]) .mdc-dialog__title::before {
          display: none;
        }

        :host([type="popover"]) header {
          padding: 0;
        }

        .year-label {
          color: var(--mdc-theme-text-primary-on-surface, rgba(0, 0, 0, 0.87));
          ${TypographyLiterals.subtitle1};
        }

        .date-label {
          color: var(--mdc-theme-text-secondary-on-surface, rgba(0, 0, 0, 0.6));
          ${TypographyLiterals.headline5};
        }

        .date-view {
          padding: 16px 24px;
        }

        .date-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        dw-input {
          flex: 1;
          padding-bottom: 24px;
        }

        .button-container {
          padding-left: 16px;
          padding-right: 16px;
          padding-top: 8px;
        }

        .input-container {
          display: flex;
          padding-top: 8px;
          padding-left: 16px;
          padding-right: 4px;
        }
      `,
    ];
  }

  static get properties() {
    return {
      /**
       * Currently selected date
       */
      value: { type: String },

      /**
       * Minimum year supported
       * Supported formats
       *  - "yyyy"
       *  - "yyyy-mm"
       *  - "yyyy-mm-dd"
       * Default Value: "1970"
       */
      min: { type: String },

      /**
       * Maximum supported
       * Supported formats
       *  - "yyyy"
       *  - "yyyy-mm"
       *  - "yyyy-mm-dd"
       * Default Value: "2100"
       */
      max: { type: String },

      inputFormat: { type: String },

      separator: { type: String },

      /**
       * true when device layout is small (value from device-info)
       */
      _mobileMode: { type: Boolean },

      /**
       * Used to show input field to select date
       * select date from plain input field (same as current date input field)
       */
      _editMode: { type: Boolean, reflect: true },

      _inputValue: { type: String },
    };
  }

  constructor() {
    super();
    this.type = "popover";
    this.opened = true;
    this.showTrigger = true;
    this.heading = "Select date";
    this._inputValue = "";

    this._mobileMode = DeviceInfo.info().layout === "small";
  }

  connectedCallback() {
    super.connectedCallback();

    this._determineType();
  }

  firstUpdated() {
    super.firstUpdated();
    this._inputValue = dateParse(this.value, this.inputFormat, this.separator);
  }

  updated(_changedProperties) {
    super.updated(_changedProperties);

    if (_changedProperties.has("_editMode") && this._editMode) {
      const el = this.renderRoot.querySelector("#customDateInput");
      el.focus();
    }
  }

  _determineType() {
    if (this._mobileMode) {
      this.type = "modal";
      this.placement = "bottom";
      return;
    }
  }

  get _headerTemplate() {
    return html` ${this._renderHeadingLabel} ${this._renderDateView} `;
  }

  get _contentTemplate() {
    if (this._mobileMode && this._editMode) {
      return html` <div class="edit-mode">
        <div class="input-container">
          <dw-input
            type="number"
            id="customDateInput"
            .value=${this._inputValue}
            @blur=${this._onInputBlur}
          ></dw-input>
          <dw-icon-button icon="date_range" @click=${this._toggleEditMode}> </dw-icon-button>
        </div>
        <div class="button-container">
          <mwc-button label="set" fullwidth raised @click=${this._onDateSet}></mwc-button>
        </div>
      </div>`;
    }

    return html`${this._renderDatePicker}`;
  }

  get _renderHeadingLabel() {
    if (!this._mobileMode) {
      return nothing;
    }
    return html`<div class="heading-title">
      ${this.heading} <dw-icon-button icon="close" buttonSize="56" dismiss></dw-icon-button>
    </div>`;
  }

  get _inputElement() {
    return this.renderRoot.querySelector("dw-input");
  }

  get _renderDateView() {
    if (this._mobileMode && this._editMode) {
      return nothing;
    }
    return html`
      <div class="date-container">
        <div class="date-view">
          <div class="year-label">${this._getSelectedYear}</div>
          <div class="date-label">${this._getSelectedDate}</div>
        </div>
        ${!this._mobileMode
          ? nothing
          : html`<dw-icon-button icon="edit" @click=${this._toggleEditMode}> </dw-icon-button>`}
      </div>
    `;
  }

  _toggleEditMode() {
    this._editMode = !this._editMode;
  }

  get _renderDatePicker() {
    return html`<dw-date-picker
      .value=${this.value}
      .min=${this.min}
      .max=${this.max}
      @date-updated=${this._onDateSelect}
    ></dw-date-picker>`;
  }

  get _getSelectedYear() {
    return moment(this.value).format("YYYY");
  }

  get _getSelectedDate() {
    return moment(this.value).format("ddd, MMM DD");
  }

  _onInputBlur() {
    if (this._inputElement && this._inputElement.value) {
      this._inputValue = dateParse(this._inputElement.value, this.inputFormat, this.separator);
    }
  }

  _onDateSelect(e) {
    this.value = e.detail.value;

    if (!e.detail.isKeypress) {
      this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
      this.close();
      return;
    }
  }

  _onDateSet(e) {
    this.value = dateParse(this._inputElement.value, this.inputFormat, this.separator);
    this.dispatchEvent(new CustomEvent("change", { detail: this.value }));
    this.close();
  }
}

customElements.define("dw-date-picker-dialog", DwDatePickerDialog);
