import { html, css } from "@dreamworld/pwa-helpers/lit.js";
import { DwCompositeDialog } from '@dreamworld/dw-dialog/dw-composite-dialog.js';

// Litepicker element
import 'litepicker/dist/litepicker';
import 'litepicker/dist/plugins/keyboardnav';
import 'litepicker/dist/plugins/mobilefriendly';

import dayjs from 'dayjs/esm/index.js';
import datePickerStyle from './dw-date-picker-style.js';

import '@dreamworld/dw-icon-button';

/**
 * Providing a solution to select date.
 *
 * ## Events
 *  - `value-changed` Fire when user choose any date from calendar.
 *
 * ## Usage Pattern:
 *  - <dw-date-picker value="" @value-changed="">
 *    </dw-date-picker>
 */
class DwDatePicker extends DwCompositeDialog {
  static get styles() {
    return [
      super.styles,
      datePickerStyle,
      css`
        :host {
          --dw-popover-width: 360px;
          --dw-popover-min-width: 360px;
          --dw-popover-border-radius: 18px;
        }

        :host([type="modal"]:not([has-footer]):not([custom-content-padding-applied])) .mdc-dialog .mdc-dialog__content {
          padding: 0px;
        }

        :host([type="modal"]:not([has-footer])) .mdc-dialog.mdc-dialog--scrollable .mdc-dialog__surface {
          padding-bottom: 0px;
        }

        :host([type="modal"]:not([has-header])) .mdc-dialog.mdc-dialog--scrollable .mdc-dialog__surface {
          padding-top: 0px;
        }
        
        .header {
          height: 88px;
          padding: 16px 24px;
          box-sizing: border-box;
          border-bottom: 1px solid rgba(0,0,0,.06);
        }

        .header .day {
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          letter-spacing: 0.15px;
        }

        .header .date {
          font-weight: 400;
          font-size: 24px;
          line-height: 32px;
          letter-spacing: 0.15px;
        }

        .header .date-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        #popover_dialog__surface {
          overflow: hidden;
          border-radius: 18px;
        }

        #datepicker {
          display: flex;
          justify-content: center;
        }

        #dialog-content {
          overflow: hidden;
        }

        .litepicker .container__days .day-item {
          border-radius: 50%;
        }

        .litepicker .container__days .day-item.is-start-date.is-end-date {
          border-radius: 50%;
        }

        :host([mobile-mode]) .litepicker,
        :host([mobile-mode]) .litepicker .container__months,
        :host([mobile-mode]) .litepicker .container__months .month-item {
          width: 100%;
          max-width: 392px;
          box-sizing: border-box;
          padding: 0px;
        }

        :host([mobile-mode]) {
          --litepicker-day-width: calc(100% / 7);
          --litepicker-day-height: calc(100vw / 7);
          --litepicker-day-margin: 0px;
        }

        :host([mobile-mode]) .litepicker .container__days > div,
        :host([mobile-mode]) .litepicker .container__days > a {
          max-width: 56px;
          max-height: 56px;
        }

        :host([mobile-mode]) .litepicker .container__months .month-item-weekdays-row > div {
          max-width: 56px;
          max-height: 48px;
        }

        :host([mobile-mode]) .litepicker .container__tooltip {
          display: none;
        }

        :host([mobile-mode]) #dialog-content {
          overflow-x: hidden;
        }

        dw-icon-button {
          height: 48px;
          width: 48px;
        }
      `
    ]
  }

  constructor(){
    super();
    this._onSelected = this._onSelected.bind(this);
  }

  static get properties() {
    return {
      /**
       * Current input value entered by user
       */
      value: { type: String },

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
       * Input property.
       * Display in mobile mode (full screen).
       */
      mobileMode: { type: Boolean, reflect: true, attribute: 'mobile-mode' },

      tabletMode: { type: Boolean, reflect: true, attribute: 'tablet-mode' },
    }
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

  willUpdate(changedProps){
    super.willUpdate(changedProps);
    if (changedProps.has("inputFormat")) {
      this.separator = this.inputFormat ? this.inputFormat.slice(2, 3): '/';
    }
  }

  get _contentTemplate() {
    return html`
      <div>
        <div class="header">
          <div class="day">${this._getDayText()}</div>
          <div class="date-container">
              <div class="date">${this._getDateText()}</div>
              ${this.tabletMode || this.mobileMode ?  html`
                <dw-icon-button @click=${this._onIconClick} .icon=${'edit'}></dw-icon-button>
              `: ''}
          </div>
        </div>
        <div id="datepicker"></div>
      </div>
    `;
  }

  updated(changedProps) {
    super.updated && super.updated(changedProps);
    if (changedProps.has('value')) {
      this._setPickerDate();
    }
  }

  _onIconClick() {
    this.dispatchEvent(
      new CustomEvent('mode-changed', {
        detail: {
          mode: 'INPUT'
        },
      })
    );


    this.close();
  }

  _getDayText() {
    if(!this.value) {
      return ''
    }

    return dayjs(this.value).format('dddd');
  }

  _getDateText() {
    if(!this.value) {
      return 'Select Date'
    }

    return this.formatDateText(dayjs(this.value, this.valueFormat).format(this.inputFormat));
  }

  formatDateText(value) {
    return value && value.replace(/ /g, "").split(`${this.separator}`).join(` ${this.separator} `);
  }

  /**
   * Creates a new easepicker instance and return it.
   */
  _create() {
    const element = this.renderRoot.querySelector('#datepicker');
    return new Litepicker({
      element: element,
      singleMode: true,
      allowRepick: false,
      numberOfColumns: 1,
      numberOfMonths: 1,
      firstDay: 0,
      inlineMode: true,
      format: this.valueFormat,
      scrollToDate: true,
      plugins: ['keyboardnav', 'mobilefriendly'],
      buttonText: {
        previousMonth: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.705 7.41L14.295 6L8.29504 12L14.295 18L15.705 16.59L11.125 12L15.705 7.41Z" fill="black" fill-opacity="0.6"/></svg>',
        nextMonth: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.70498 6L8.29498 7.41L12.875 12L8.29498 16.59L9.70498 18L15.705 12L9.70498 6Z" fill="black" fill-opacity="0.6"/></svg>',
      },
    });
  }

  _show() {
    if (!this._instance) {
      this._instance = this._create();
    }

    this._instance.on('selected', this._onSelected);
    this._instance.show();
    this._setPickerDate();
  }
  
  _setPickerDate() {
    if(this.value && this._instance) {
      this._instance.setDateRange(this.value);
      this._instance.gotoDate(this.value);
    }
  }

  _hide() {
    if (!this._instance) {
      return;
    }

    this._instance && this._instance.off('selected', this._onSelected);
    this._instance && this._instance.hide();
    this._instance && this._instance.destroy();
    this._instance = undefined;
  }

  /**
   * Invoked when user choose date from calender.
   */
  _onSelected(date) {
    this._trigerValueChanged(date);
    this.close();
  }

  _trigerValueChanged(date) {
    date = date && date.dateInstance ? date.dateInstance : date;
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: {
          value: date ? dayjs(date).startOf('day').format(this.valueFormat) : null
        },
      })
    );
  }

  /**
   * @Override
   */
  _onOpenedChanged(opened) {
    super._onOpenedChanged && super._onOpenedChanged(opened);
    opened ? this._show(): this._hide();
  }
}

window.customElements.define('dw-date-picker', DwDatePicker);