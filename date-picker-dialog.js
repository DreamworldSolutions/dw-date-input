import {DwCompositeDialog} from "@dreamworld/dw-dialog/dw-composite-dialog.js"
import { html } from "@dreamworld/pwa-helpers/lit";

export class DatePickerDialog extends DwCompositeDialog {
  constructor() {
    super();
    this.type = "popover";
    this.showTrigger = true;
    this.popoverPlacement = "bottom-start"
  }

  get _contentTemplate() {
    return html`Content`
  }
}

customElements.define('date-picker-dialog', DatePickerDialog)