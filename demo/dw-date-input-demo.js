import { LitElement, html, css } from "@dreamworld/pwa-helpers/lit.js";

import "../dw-date-input.js";
import "../dw-date-range-selection.js";
import "../date-input.js";

export class DwDateInputDemo extends LitElement {

  static get properties() {
    return {
      value: { type: String}
    }
  }

  constructor() {
    super();
    this.value = "2022-04-25";
  }

  render() {
    return html`

      <h4>Required</h4>
      <dw-date-input label="Start date" placeholder="Enter date here" required errorMessage="Required" value=${this.value} @change=${this._onValueChange}></dw-date-input>

      <h4>Required</h4>
      <dw-date-input label="Start date" placeholder="Enter date here" showFutureWarning ></dw-date-input>

      <!-- <h4>Required</h4>
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
      </dw-date-range-selection> -->
    `
  }

  _onValueChange(e) {
    console.log(e);
    this.value = e.detail.value;
  }
}

customElements.define("dw-date-input-demo", DwDateInputDemo);