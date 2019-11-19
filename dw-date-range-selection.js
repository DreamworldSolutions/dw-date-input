/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, css } from 'lit-element';
import moment from 'moment'; 
  
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

  render() {
    return html`
      <slot></slot>
    `;
  }

  constructor() { 
    super();
    this._onFromDateChanged = this.__onFromDateChanged.bind(this);

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

    this.fromDateEl.addEventListener('value-changed', this._onFromDateChanged);
  }

  disconnectedCallback() { 
    this.fromDateEl.removeEventListener('value-changed', this._onFromDateChanged);
  }

  __onFromDateChanged(e) {
    this.toDateEl.minDate = e.target.value || e.target.minDate;

    let fromDate = this.fromDateEl.value;
    let toDate = this.toDateEl.value;

    // Resets 'toDate' if it's less than 'fromDate'. 
    if (moment(toDate).isBefore(fromDate)) { 
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