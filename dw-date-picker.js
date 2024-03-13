import { html, css } from "@dreamworld/pwa-helpers/lit.js";
import { DwCompositeDialog } from '@dreamworld/dw-dialog/dw-composite-dialog.js';
import { easepick, RangePlugin } from '@easepick/bundle';

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
      css`
        :host([type="modal"]:not([has-footer]):not([custom-content-padding-applied])) .mdc-dialog .mdc-dialog__content {
          padding: 0px;
        }
      `
    ]
  }

  constructor(){
    super();
    this._onSelected = this._onSelected.bind(this);
  }

  get _contentTemplate() {
    return html`
      <div>
        <div id="datepicker"></div>
      </div>
    `;
  }

  /**
   * Creates a new easepicker instance and return it.
   */
  _create() {
    const element = this.renderRoot.querySelector('#datepicker');
    return new easepick.create({
      element: element,
      inline: true,
      firstDay: 0,
      autoApply: true,
      css: [
        'https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css',
        'https://cdn.jsdelivr.net/npm/@easepick/range-plugin@1.2.1/dist/index.css',
        '../dw-date-picker.css'
      ]
    });
  }

  _show() {
    if (!this._instance) {
      this._instance = this._create();
    }

    this._instance.on('selected', (e) => {
      console.log("selected: ", e);
    });
    this._instance.on('preselect', (e) => {
      console.log("preselect: ", e);
    });
    this._instance.on('clear', (e) => {
      console.log("clear: ", e);
    });
    this._instance.show();
    this._instance.gotoDate(this.startTime);
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
  _onSelected(startDate, endDate) {
    console.log(startDate, endDate);
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
