import { LitElement, html, css, nothing } from "@dreamworld/pwa-helpers/lit.js";

import "../dw-date-input.js";
import "../dw-date-range-selection.js";
import "../date-input.js";
import "../dw-date-picker.js";
import "../dw-month-year-grid.js";

import { ThemeStyle } from "@dreamworld/material-styles/theme.js";

export class DwDateInputDemo extends LitElement {
  static get styles() {
    return [
      ThemeStyle,
      css`
        dw-month-year-grid {
          max-height: 500px;
        }
      `,
    ];
  }

  static get properties() {
    return {
      value: { type: String },
      _open: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.value = "2022-04-25";
  }

  render() {
    return html`
      <h4>Required</h4>
      <dw-date-input
        label="Start date"
        placeholder="Enter date here"
        required
        errorMessage="Required"
        value=${this.value}
        @change=${this._onValueChange}
      ></dw-date-input>

      <h4>Required</h4>
      <dw-date-input
        label="Start date"
        placeholder="Enter date here"
        showFutureWarning
      ></dw-date-input>

      <br />
      <button id="openDialog" @click=${this._onOpenDialog}>Open Dialog</button>
      ${this._renderDialog()}
      <!-- <dw-date-picker @date-updated=${(e) =>
        console.log("date-updated", e)}></dw-date-picker> -->
      <!-- <dw-month-year-grid @value-changed=${this._onMonthSelect}></dw-month-year-grid> -->

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
    `;
  }

  get _getTriggerElement() {
    return this.renderRoot.querySelector("#openDialog");
  }

  _renderDialog() {
    if (!this._open) {
      return nothing;
    }

    import("../dw-date-picker-dialog.js");
    return html`<dw-date-picker-dialog
      .value=${this.value}
      .triggerElement=${this._getTriggerElement}
      @dw-dialog-closed=${this._onDialogClose}
      @change=${this._onDateChange}
    ></dw-date-picker-dialog>`;
  }

  _onOpenDialog() {
    this._open = true;
  }

  _onDialogClose() {
    this._open = false;
  }

  _onValueChange(e) {
    console.log("_onValueChange", e);
    this.value = e.detail.value;
  }

  _onDateChange(e) {
    console.log("_onDateChange", e);
    this.value = e.detail;
  }

  _onMonthSelect(e) {
    console.log(e);
  }
}

customElements.define("dw-date-input-demo", DwDateInputDemo);
