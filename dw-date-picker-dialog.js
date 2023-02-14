import {DwCompositeDialog} from "@dreamworld/dw-dialog/dw-composite-dialog.js"
import { html } from "@dreamworld/pwa-helpers/lit";

export class DwDatePickerDialog extends DwCompositeDialog {
  constructor() {
    super();
    this.type = "popover";
    this.showTrigger = true;
  }

  get _contentTemplate() {
    return html`Date Picker Dialog`
  }
}

customElements.define('dw-date-picker-dialog', DwDatePickerDialog)