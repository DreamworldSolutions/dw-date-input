import { css, html, LitElement } from "@dreamworld/pwa-helpers/lit.js";
import "@dreamworld/dw-surface";
import { repeat } from "lit/directives/repeat.js";
import moment from "moment/src/moment";
import "@lit-labs/virtualizer";

// Styles
import * as TypographyLiterals from "@dreamworld/material-styles/typography-literals.js";

// Utils
import { dateFormat, months, yearsInArray } from "./utils.js";

export class DwMonthYearGrid extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      .container {
        width: 100%;
      }

      .year-label {
        margin-bottom: 8px;
        padding: 16px 24px 8px;
        color: var(--mdc-theme-text-secondary-on-surface, rgba(0, 0, 0, 0.6));
        ${TypographyLiterals.subtitle2};
      }

      .months-container {
        display: grid;
        column-gap: 8px;
        row-gap: 16px;
        grid-template-columns: auto auto auto auto;
        padding-left: 24px;
        padding-right: 24px;
      }

      dw-surface {
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: calc(36px / 2);
        cursor: pointer;
        color: var(--mdc-theme-text-primary-on-surface, rgba(0, 0, 0, 0.87));
        ${TypographyLiterals.body1};
      }

      dw-surface[bg="primary"] {
        color: var(--mdc-theme-text-primary-on-primary, #ffffff);
      }
    `;
  }

  static get properties() {
    return {
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

      /**
       * Contains selected month-year in "yyyy-mm" format
       * You may also pass full date instead, e.g. "2023-02-17"
       * Help to highlight month
       * Default: current date is considered.
       */
      value: { type: String },

      /**
       * Contains selected date's month in "MM" format
       * Computed property from `value`
       */
      _month: { type: Number },

      /**
       * Contains selected date's year in "YYYY" format
       * Computed property from `value`
       */
      _year: { type: Number },

      /**
       * Contains year list from min and max year
       * It's computed property from `min` and `max`
       */
      _years: { type: Array },
    };
  }

  constructor() {
    super();
    this.value = moment().format(dateFormat);
    this.min = "1970";
    this.max = "2100";
    this._years = yearsInArray(this.min, this.max);
  }

  get _virtulizerInstance() {
    return this.renderRoot.querySelector("lit-virtualizer");
  }

  firstUpdated() {
    this.#_scrollToSelectedYear();
  }

  willUpdate(_changedProperties) {
    if (_changedProperties.has("min") || _changedProperties.has("max")) {
      this._years = yearsInArray(this.min, this.max);
    }

    if (_changedProperties.has("value")) {
      this._month = moment(this.value).format("MM");
      this._year = moment(this.value).format("YYYY");
    }
  }

  render() {
    return html`<lit-virtualizer
      .items=${this._years}
      .renderItem=${(year) => html`${this.#_oneYearMonthsLayout(year)}`}
    ></lit-virtualizer>`;
  }

  #_oneYearMonthsLayout(year) {
    return html`
      <div class="container">
        <div class="year-label">${year}</div>
        <div class="months-container">
          ${repeat(months, (month) => {
            return html`<dw-surface
              .bg=${this.#_isMonthSelected(year, month) ? "primary" : ""}
              interactive
              @click=${() => this.#_onMonthClick(year, month.index)}
            >
              ${month.name_short}
            </dw-surface>`;
          })}
        </div>
      </div>
    `;
  }

  #_isMonthSelected(year, month) {
    const yearMonth = year + "-" + month.index;

    if (this.value.includes(yearMonth)) {
      return true;
    }

    return false;
  }

  #_scrollToSelectedYear() {
    const selectedYearIndex = this._years.findIndex((year) => year === this._year);

    setTimeout(() => {
      this._virtulizerInstance.scrollToIndex(selectedYearIndex);
    }, 250);
  }

  #_onMonthClick(year, month) {
    year = Number(year);
    month = Number(month);

    this.value = moment()
      .month(month - 1)
      .year(year)
      .format(dateFormat);

    this.dispatchEvent(new CustomEvent("value-changed", { detail: this.value, bubbles: false }));
  }
}

customElements.define("dw-month-year-grid", DwMonthYearGrid);
