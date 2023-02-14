import {DwCompositeDialog} from "@dreamworld/dw-dialog/dw-composite-dialog.js"
import { html } from "@dreamworld/pwa-helpers/lit";

export class DatePickerDialog extends DwCompositeDialog {
  constructor() {
    super();
    this.type = "popover";
    this.showTrigger = true;
  }

  get _contentTemplate() {
    return html`Date Picker Dialog`
  }
}

customElements.define('date-picker-dialog', DatePickerDialog)