# @dreamworld/dw-date-input

A LitElement-based web component (`<dw-date-input>`) that provides a text field for date entry with smart auto-formatting, built-in validation (required, min/max date, future date), and an integrated Litepicker calendar popover for desktop and full-screen modal for mobile/tablet.

---

## 1. User Guide

### Installation & Setup

```bash
yarn add @dreamworld/dw-date-input
```

### Basic Usage

```javascript
import '@dreamworld/dw-date-input/dw-date-input.js';
```

```html
<dw-date-input
  label="Start Date"
  placeholder="DD/MM/YYYY"
  required
  value="2024-01-15"
  @change=${(e) => console.log(e.detail.value)}
></dw-date-input>
```

The `value` property is always read/written in `valueFormat` (default `YYYY-MM-DD`). The user types in `inputFormat` (default `DD/MM/YYYY`). The component converts between the two automatically.

---

### API Reference

#### Props — `<dw-date-input>`

| Name | Type | Default | Required | Description |
|---|---|---|---|---|
| `name` | `String` | `""` | No | Name attribute forwarded to the inner input element. |
| `value` | `String` | `""` | No | Current date value in `valueFormat`. Set this to pre-fill the field. |
| `label` | `String` | — | No | Floating label shown above the input. |
| `placeholder` | `String` | `""` | No | Placeholder text shown inside the input. |
| `disabled` | `Boolean` | `false` | No | Disables the input. |
| `readOnly` | `Boolean` | `false` | No | Makes the input read-only. Clicking will not open the calendar picker. |
| `required` | `Boolean` | `false` | No | Marks the input as required. Validation fails when empty. |
| `noLabel` | `Boolean` | `false` | No | Hides the label. |
| `hint` | `String` | `""` | No | Helper text shown below the input. |
| `hintPersistent` | `Boolean` | `false` | No | When `true`, hint text is always visible regardless of focus. |
| `noHintWrap` | `Boolean` | `false` | No | Constrains hint text to a single line. |
| `dense` | `Boolean` | `false` | No | Applies dense (compact) styling. |
| `autoSelect` | `Boolean` | `true` | No | Auto-selects the text content when the input is focused. |
| `inputFormat` | `String` | `"DD/MM/YYYY"` | No | Format the user types in. Accepted values: `DD/MM/YYYY`, `MM/DD/YYYY`, `DD-MM-YYYY`, `MM-DD-YYYY`, etc. Case-insensitive. |
| `valueFormat` | `String` | `"YYYY-MM-DD"` | No | Format used for the `value` property and `change` event. |
| `dateRepresentationFormat` | `String` | `"DD MMM YYYY"` | No | Format used to display the selected date in the calendar picker header. |
| `minDate` | `String` | — | No | Minimum allowed date (inclusive), in `valueFormat`. Dates before this trigger a validation error. |
| `maxDate` | `String` | — | No | Maximum allowed date (inclusive), in `valueFormat`. Dates after this trigger a validation error. |
| `showFutureError` | `Boolean` | `false` | No | When `true`, selecting a future date is a validation error. |
| `showFutureWarning` | `Boolean` | `false` | No | When `true`, selecting a future date shows a warning (suppressed when an error is active). |
| `invalid` | `Boolean` | `false` | No | Reflects the last validation result. Set externally to force an invalid state. |
| `originalValue` | `String` | `""` | No | Reference value used with `highlightChanged` to detect user modifications. |
| `highlightChanged` | `Boolean` | `false` | No | When `true` and `value !== originalValue`, applies a visual highlight. Requires `originalValue` to be set. |
| `error` | `String \| Function \| Object` | — | No | Custom error message or function. Overrides internal validation display. |
| `warning` | `String \| Function \| Object` | — | No | Custom warning message or function. |
| `errorMessages` | `Object` | See below | No | Per-instance override of the default error message strings. |
| `hintInTooltip` | `Boolean` | — | No | When `true`, shows the hint inside a tooltip on the trailing icon instead of inline. |
| `errorInTooltip` | `Boolean` | — | No | When `true`, shows the error inside a tooltip on the trailing icon instead of inline. |
| `warningInTooltip` | `Boolean` | — | No | When `true`, shows the warning inside a tooltip on the trailing icon instead of inline. |
| `hintTooltipActions` | `Array` | — | No | Action buttons to render inside the hint tooltip. |
| `errorTooltipActions` | `Array` | — | No | Action buttons to render inside the error tooltip. |
| `warningTooltipActions` | `Array` | — | No | Action buttons to render inside the warning tooltip. |
| `tipPlacement` | `String` | `"bottom-end"` | No | Tippy.js placement for all tooltips. See Tippy.js `placement` docs. |
| `tipExtraOptions` | `Object` | — | No | Extra options forwarded directly to Tippy.js. |
| `iconTrailing` | `String` | `"date_range"` | No | Material icon name for the trailing icon that opens the calendar. |
| `mobileMode` | `Boolean` | `false` | No | When `true`, the calendar opens as a full-screen modal. Input is pointer-events disabled. |
| `tabletMode` | `Boolean` | `false` | No | When `true`, applies tablet-specific layout. Input is pointer-events disabled. |
| `zIndex` | `Number` | `9999` | No | `z-index` of the calendar popover. |
| `appendTo` | `String \| Element` | `"parent"` | No | DOM element (or `"parent"`) to which the popover is appended. |
| `triggerElement` | `Element` | (auto) | No | Element used as the popover anchor. Defaults to the internal `date-input` element. |

---

#### Events

| Event | `detail` Shape | Description |
|---|---|---|
| `change` | `{ value: string }` | Fired when the date value changes — on blur, paste, Enter key, or calendar date selection. `value` is in `valueFormat`, or `""` for an invalid/cleared entry. |
| `enter` | `{ value: string }` | Fired when the user presses Enter inside the text field. |
| `date-picker-opened` | — | Fired when the calendar popover/modal opens. |
| `date-picker-closed` | — | Fired when the calendar popover/modal closes. |

---

#### Instance Methods

| Method | Returns | Description |
|---|---|---|
| `focus()` | `Promise<void>` | Focuses the inner text field. Async — awaits `updateComplete`. |
| `validate()` | `Boolean` | Alias for `reportValidity()`. |
| `reportValidity()` | `Boolean` | Triggers validation and updates the invalid state. Returns `true` if valid. |
| `checkValidity()` | `Boolean` | Returns `true` if the current value passes all validation rules without updating the UI. |

---

#### Static Methods

| Method | Parameters | Description |
|---|---|---|
| `DwDateInput.setErrorMessages(messages)` | `messages: Object` | Merges `messages` into the global default error messages. Affects all `<dw-date-input>` instances that do not override `errorMessages`. |

---

#### Validation & Error Messages

Default error messages (can be overridden globally via `setErrorMessages` or per-instance via the `errorMessages` prop):

```javascript
{
  minDate:       "Must be > {minDate}",
  maxDate:       "Must be < {maxDate}",
  minMaxDate:    "Date must be between {minDate} and {maxDate}",
  invalidDate:   "Date is invalid",
  showFutureError: "Future date is not allowed."
}
```

The placeholders `{minDate}` and `{maxDate}` are replaced at runtime with the actual `minDate`/`maxDate` prop values.

The warning produced by `showFutureWarning` is hardcoded to `"Future date is selected"` in `date-input.js` and is not configurable via `errorMessages`.

---

#### CSS Custom Properties

| Property | Default | Description |
|---|---|---|
| `--dw-date-input-padding` | `12px 16px 14px` | Padding of the `<input>` element inside the outlined text field. |
| `--dw-popover-border-radius` | `18px` | Border-radius of the calendar popover surface. |
| `--dw-popover-width` | `360px` | Width of the calendar popover. |
| `--dw-popover-min-width` | `360px` | Minimum width of the calendar popover. |
| `--mdc-theme-primary` | (MDC theme) | Color applied to the trailing calendar icon and active states when the picker is open. |
| `--mdc-theme-surface` | (MDC theme) | Calendar surface background. |
| `--mdc-theme-text-primary-on-surface` | (MDC theme) | Primary text color inside the calendar. |
| `--mdc-theme-text-secondary-on-surface` | (MDC theme) | Secondary text color (day-of-week label in header). |
| `--mdc-theme-divider-color` | (MDC theme) | Color of the divider line below the calendar header. |

---

### Advanced Usage

#### Pre-filled value with change highlight

```javascript
html`
<dw-date-input
  label="Start Date"
  .value=${"2024-06-01"}
  .originalValue=${"2024-06-01"}
  highlightChanged
  @change=${(e) => console.log('New value:', e.detail.value)}
></dw-date-input>
`
```

When the user changes the date, the field is visually highlighted. Restoring to `originalValue` removes the highlight.

---

#### Min/Max date constraint

```html
<dw-date-input
  label="Booking Date"
  min-date="2024-01-01"
  max-date="2024-12-31"
></dw-date-input>
```

Or in JavaScript (property binding):

```javascript
el.minDate = '2024-01-01';
el.maxDate = '2024-12-31';
```

---

#### Blocking future dates

```html
<!-- Error if future date is entered -->
<dw-date-input show-future-error></dw-date-input>

<!-- Warning (non-blocking) if future date is entered -->
<dw-date-input show-future-warning></dw-date-input>
```

---

#### Tooltip mode for hint/error/warning

```javascript
html`
<dw-date-input
  label="Date"
  hint="Enter date in DD/MM/YYYY"
  hintInTooltip
  .warning=${"Selected date is in the past"}
  warningInTooltip
></dw-date-input>
`
```

---

#### Global error message customization

```javascript
import { DwDateInput } from '@dreamworld/dw-date-input/dw-date-input.js';

DwDateInput.setErrorMessages({
  invalidDate: 'Please enter a valid date.',
  minDate: 'Date must be on or after {minDate}.',
});
```

---

#### Custom `inputFormat`

```html
<!-- US format -->
<dw-date-input input-format="MM/DD/YYYY" label="Date"></dw-date-input>

<!-- ISO input -->
<dw-date-input input-format="YYYY-MM-DD" label="Date"></dw-date-input>
```

---

#### Mobile / Tablet mode

```html
<!-- Full-screen calendar modal on mobile -->
<dw-date-input mobile-mode label="Date"></dw-date-input>

<!-- Tablet layout -->
<dw-date-input tablet-mode label="Date"></dw-date-input>
```

In these modes, the `<input>` element is pointer-events disabled; date entry is only possible through the calendar or dialog.

---

#### Arrow-key date increment

When the text field is focused and contains a valid date, pressing **Arrow Up** increments the date by 1 day and **Arrow Down** decrements by 1 day. If the field is empty, Arrow Up/Down sets the value to today's date.

---

### `dateParse(value, format)` Utility

```javascript
import { dateParse } from '@dreamworld/dw-date-input/date-parse.js';

const result = dateParse('25 Jan 2024', 'DD/MM/YYYY');
// Returns: "25/01/2024"
```

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `value` | `String` | Raw user input in any supported format (see below). |
| `format` | `String` | Target dayjs-compatible format string the result should be returned in. |

**Returns:** `String` — the parsed date in `format`, or `null` if the input cannot be parsed.

**Supported input formats:**

| Category | Examples |
|---|---|
| Slash-separated | `DD/MM/YYYY`, `MM/DD/YYYY`, `D/M/YYYY` |
| Dash-separated | `DD-MM-YYYY`, `MM-DD-YYYY` |
| ISO | `YYYY-MM-DD`, `YYYY/MM/DD` |
| Spaced separators | `DD / MM / YYYY`, `MM / DD / YYYY`, `YYYY - MM - DD` |
| Month name (abbrev.) | `DD MMM YYYY`, `DD MMM, YYYY`, `MMM DD YYYY`, `MMM DD, YYYY` |
| Month name (full) | `MMMM D, YYYY`, `MMMM DD, YYYY` |
| Numeric only | `1212` → auto-parsed as day+month using `inputFormat` |
| Year-omitted | `25 Jan`, `01/15` → current year is auto-filled |

**Behavior notes:**
- Month names are case-insensitive.
- For numeric-only input, day/month order follows the provided `format`.
- If day and month values exceed valid ranges, the parser swaps them automatically.
- Two-digit years (`24`) are expanded to `2024`.

---

### `currentYearFormat` Constant

```javascript
import { currentYearFormat } from '@dreamworld/dw-date-input/constants.js';
```

Maps a full-year date format to its corresponding current-year (year-omitted) format.

| Full format | Year-omitted format |
|---|---|
| `DD-MM-YYYY` | `DD-MM` |
| `DD/MM/YYYY` | `DD/MM` |
| `MM/DD/YYYY` | `MM/DD` |
| `MM-DD-YYYY` | `MM-DD` |
| `YYYY/MM/DD` | `MM/DD` |
| `YYYY-MM-DD` | `MM-DD` |
| `DD MMM YYYY` | `DD MMM` |
| `MMM DD, YYYY` | `MMM DD` |

---

## 2. Developer Guide / Architecture

### Component Hierarchy

```
DwDateInput  <dw-date-input>          extends DwFormElement(LitElement)
├── DateInput  <date-input>            extends DwInput  (internal text field)
│   ├── dw-icon-button                 (trailing calendar icon)
│   └── dw-tooltip                    (conditional hint/error/warning tooltip)
├── DwDatePicker  <dw-date-picker>     extends DwCompositeDialog  (lazy — rendered only when _pickerOpened)
│   ├── Litepicker instance            (inline calendar, keyboardnav + mobilefriendly plugins)
│   ├── DwDateInput                    (edit mode input inside picker header)
│   └── dw-button (Cancel / Apply)    (edit mode actions)
└── DwDateInputDialog <dw-date-input-dialog>  extends DwCompositeDialog  (modal for mobile/tablet)
    ├── DateInput  <date-input>
    └── dw-button (Cancel / Apply)
```

### Module Responsibilities

| File | Exported Name | Role |
|---|---|---|
| `dw-date-input.js` | `DwDateInput` | Orchestrator. Owns `value` state, format normalization, validation delegation, picker lifecycle. |
| `date-input.js` | `DateInput` | Low-level text field. Handles raw input, `dateParse` on blur/paste/Enter, arrow-key date change, format display, and validation error/warning computation. |
| `dw-date-picker.js` | `DwDatePicker` | Litepicker-based calendar dialog (popover on desktop, modal on mobile). Manages picker instance lifecycle. |
| `dw-date-input-dialog.js` | `DwDateInputDialog` | Modal dialog wrapping a `DateInput` for explicit Apply/Cancel flow. Emits `mode-changed` when switching to the calendar. |
| `date-parse.js` | `dateParse` | Pure utility. Parses freeform date strings into a specified dayjs format. |
| `constants.js` | `currentYearFormat` | Static map from full formats to year-omitted equivalents. |

### Design Patterns

**Mixin — `DwFormElement`**
`DwDateInput` applies the `DwFormElement` mixin from `@dreamworld/dw-form`, integrating it into form validation workflows (`checkValidity`, `reportValidity`).

**Composition via Lit templates**
`DwDateInput.render()` conditionally composes three sub-templates: `dateInputTemplate` (always rendered), `datePickerTemplate` (rendered only when `_pickerOpened === true`), and `dateInputDialogTemplate`. This lazy-renders the heavy Litepicker calendar.

**Strategy pattern — `_error` / `_warning` getters**
`DwDateInput` exposes `_error` and `_warning` as overridable getters. Subclasses can extend `DwDateInput`, override these getters to inject additional validation logic, and call `super` to preserve the base behaviour. This avoids conflicts with the public `error`/`warning` props that integrators use.

**Format normalization**
All format strings (`inputFormat`, `valueFormat`, `dateRepresentationFormat`) are uppercased internally (`_inputFormat`, `_valueFormat`, `_dateRepresentationFormat`) in `willUpdate`. This means props are accepted case-insensitively (`dd/mm/yyyy` and `DD/MM/YYYY` are both valid).

### Development Server

```bash
yarn start
# Launches @web/dev-server with demo/index.html
```
