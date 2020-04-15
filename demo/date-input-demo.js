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
import { ThemeStyle } from '@dreamworld/material-styles/theme';
import '@material/mwc-switch';
import '@material/mwc-formfield';
import '../dw-date-input';
import '../dw-date-range-selection';


class DateInputDemo extends LitElement {
  static get styles() {
    return [
      ThemeStyle,,
      css`
        :host{
          display: inline-block;
          width: 100%;
          padding: 24px;
        }

        :host([dark-theme]){
          --dw-input-fill-color: #333;
          --dw-input-filled-bottom-border-color: rgba(255,255,255, 0.42);
        }

        h4{
          color: var(--mdc-theme-text-primary);
        }

        mwc-formfield{
          display: block;
          padding-bottom: 24px;
          --mdc-theme-text-primary-on-background: var(--mdc-theme-text-primary);
        }

        .date-range{
          display: flex;
          flex-direction: row;
          align-items: flex-start;
        }

        .date-range dw-date-input{
          margin-right: 16px;
        }

      `
    ];
  }

  render() {
    
    return html`

      <mwc-formfield label="Enable dark theme">
        <mwc-switch @change="${(e) => {
          if (e.target.checked) { 
            this.setAttribute('dark-theme', e.detail);
            return;
          }
      
          this.removeAttribute('dark-theme');
          }}">
        </mwc-switch>
      </mwc-formfield>

      <h4>Required</h4>
      <dw-date-input label="Start date" placeholder="Enter date here" required errorMessage="Required"></dw-date-input>

      <h4>Min date</h4>
      <dw-date-input label="Start date" minDate="12/12/2018" hint="Min date is 12/12/2018"></dw-date-input>

      <h4>Max date</h4>
      <dw-date-input label="Start date" hintPersistent maxDate="12/12/2018" hint="Max date is 12/12/2018"></dw-date-input>

      <h4>Max/Min date</h4>
      <dw-date-input label="Start date" minDate="12/12/2018" maxDate="12/12/2020" hint="Enter date between 12/12/2018 and 12/12/2020"></dw-date-input>
    
      <h4>Prefilled value</h4>
      <dw-date-input label="Start date" inputFormat="dd-mm-yyyy" value="23 - 12 - 2016"></dw-date-input>

      <h4>mm-dd-yyyy input format</h4>
      <dw-date-input inputFormat="mm-dd-yyyy" label="Start date" required errorMessage="Required"></dw-date-input>

      <h4>dd-mm-yyyy input format</h4>
      <dw-date-input label="Start date" inputFormat="dd-mm-yyyy"></dw-date-input>

      <h4>dd/mm/yyyy input format</h4>
      <dw-date-input label="Start date" inputFormat="dd/mm/yyyy"></dw-date-input>

      <h4>Readonly</h4>
      <dw-date-input label="Start date" readOnly value="11/11/2018"></dw-date-input>

      <h4>Disabled</h4>
      <dw-date-input label="Start date" disabled value="12/12/2019"></dw-date-input>

      <h4>Date range selection</h4>
      <dw-date-range-selection>
        <div class="date-range">
          <dw-date-input id="from" label="Start date"></dw-date-input>
          <dw-date-input id="to" label="End date"></dw-date-input>
        </div>
      </dw-date-range-selection>
      
    `;
  }

  
}

window.customElements.define('date-input-demo', DateInputDemo);