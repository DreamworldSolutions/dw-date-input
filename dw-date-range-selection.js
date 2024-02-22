import { html, css, LitElement } from '@dreamworld/pwa-helpers/lit.js';
import dayjs from 'dayjs/esm/index.js';
import isSameOrBefore from 'dayjs/esm/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

/**
 * Behaviors:
 * - Selects date elements from light dom using id: `from` and `to`.
 * - When from date is changed:
 *   - sets minDate of 'toDate'.
 *   - Resets 'toDate' if it's less than 'minDate'.
 */
export class DwDateRangeSelection extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host[hidden] {
          display: none;
        }
      `
    ];
  }

  constructor(){
    super();

    this.resetDateIfInvalid = true;
    this._onFromDateChanged = this.__onFromDateChanged.bind(this);
  }

  static get properties() {
    return {

      /**
       * Input property.
       * Default value is false.
       * When true, reset 'to date' if it's lower than 'from date'.
       */
      resetDateIfInvalid: {  type: Boolean }
    }
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  firstUpdated() { 
    this.fromDateEl = this.querySelector('#from');
    this.toDateEl = this.querySelector('#to');

    if (!this.fromDateEl) { 
      console.warn('Provide from date with id=from');
      return;
    }

    if (!this.toDateEl) { 
      console.warn('Provide to date with id=to');
      return;
    }

    this._onFromDateChanged();
    this.fromDateEl.addEventListener('value-changed', this._onFromDateChanged);
  }

  disconnectedCallback() { 
    this.fromDateEl.removeEventListener('value-changed', this._onFromDateChanged);
  }

  __onFromDateChanged() {
    this.toDateEl.minDate = this.fromDateEl.value || this.fromDateEl.minDate;

    let fromDate = this.fromDateEl.value;
    let toDate = this.toDateEl.value;

    // Resets 'toDate' if it's less than 'fromDate'. 
    if (dayjs(toDate).isSameOrBefore(fromDate) && this.resetDateIfInvalid) { 
      this.toDateEl.value = '';
    }

    // Validate `toDate` if it's invalid on `fromDate` change
    if (this.toDateEl.value && this.toDateEl.invalid) { 
      // setting 0 delay so that element can have correct minDate while validating input
      setTimeout(() => {
        this.toDateEl.validate();
      }, 0);
    }
  }

}

window.customElements.define('dw-date-range-selection', DwDateRangeSelection);
