import { html } from '@polymer/polymer/lib/utils/html-tag.js';

const datePickerOverlayTheme = html`

  <dom-module id="vaadin-date-picker-overlay-style" theme-for="vaadin-date-picker-overlay">
    <template>
      <style>
        :host{
          --material-primary-color: var(--mdc-theme-primary, #6200ee);
          --material-primary-text-color: var(--mdc-theme-primary, #6200ee);
        }
      </style>
    </template>
  </dom-module>

`;

document.head.appendChild(datePickerOverlayTheme.content);