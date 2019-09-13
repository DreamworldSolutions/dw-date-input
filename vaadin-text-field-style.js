/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { html } from '@polymer/polymer/lib/utils/html-tag.js';
const textFieldTheme = html`<dom-module id="vaadin-text-field-style" theme-for="vaadin-text-field">
<template>
  <style>
    :host {
      width: 100%;
      height: 100%;
      padding-top: 0 !important;
      margin-bottom: 0 !important;
    } 
    
    [part="input-field"] {
      display: none !important;
    }
  </style>
</template>
</dom-module>`;

document.head.appendChild(textFieldTheme.content);
