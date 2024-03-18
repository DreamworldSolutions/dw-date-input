import { html, css } from "@dreamworld/pwa-helpers/lit.js";
import { DwCompositeDialog } from '@dreamworld/dw-dialog/dw-composite-dialog.js';

// Litepicker element
import 'litepicker/dist/litepicker';
import 'litepicker/dist/plugins/keyboardnav';
import 'litepicker/dist/plugins/mobilefriendly';

import dayjs from 'dayjs/esm/index.js';

import '@dreamworld/dw-icon-button';
import './date-input';

/**
 * Providing a solution to select date.
 *
 * ## Events
 *  - `value-changed` Fire when user choose any date from calendar.
 *
 * ## Usage Pattern:
 *  - <dw-date-input-dialog value="" @value-changed="">
 *    </dw-date-input-dialog>
 */
class DwDateInputDialog extends DwCompositeDialog {
  static get styles() {
    return [
      super.styles,
      css`
        :host([type="modal"]:not([has-footer]):not([custom-content-padding-applied])) .mdc-dialog .mdc-dialog__content {
          padding: 0px;
        }

        :host([type="modal"]) .mdc-dialog .mdc-dialog__surface {
          min-width: 328px;
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

        dw-icon-button {
          height: 48px;
          width: 48px;
        }
      `
    ]
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
      valueFormat: { type: String }
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
            <dw-icon-button @click=${this._onIconClick} .icon=${'date_range'}></dw-icon-button>
          </div>
        </div>
        <date-input></date-input>
      </div>
    `;
  }

  _onIconClick() {
    this.dispatchEvent(
      new CustomEvent('mode-changed', {
        detail: {
          mode: 'PICKER'
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

  _trigerValueChanged(date) {
    this.dispatchEvent(
      new CustomEvent('value-changed', {
        detail: {
          value: date
        },
      })
    );
  }
}

window.customElements.define('dw-date-input-dialog', DwDateInputDialog);
