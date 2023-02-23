import "@dreamworld/dw-icon-button";
import { css, html, nothing } from "@dreamworld/pwa-helpers/lit";
import { AppDatePicker } from "app-datepicker";
import { isInCurrentMonth } from "app-datepicker/dist/helpers/is-in-current-month.js";
import { splitString } from "app-datepicker/dist/helpers/split-string.js";
import { toDateString } from "app-datepicker/dist/helpers/to-date-string.js";
import { toFormatters } from "app-datepicker/dist/helpers/to-formatters.js";
import { toResolvedDate } from "app-datepicker/dist/helpers/to-resolved-date.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import moment from "moment/src/moment";
import { calendar } from "nodemod/dist/calendar/calendar.js";
import { getWeekdays } from "nodemod/dist/calendar/helpers/get-weekdays.js";
import { toUTCDate } from "nodemod/dist/calendar/helpers/to-utc-date.js";
import "./dw-month-year-grid.js";
import { dateFormat, NavigationType } from "./utils";

export class DwDatePicker extends AppDatePicker {
  #formatters;
  #today;
  #focusNavButtonWithKey = false;
  #valueAsDate;

  static get styles() {
    return [
      ...AppDatePicker.styles,
      css`
        .month-and-year-selector {
          cursor: pointer;
        }

        dw-month-year-grid {
          height: 336px;
        }
      `,
    ];
  }

  constructor() {
    super();

    const todayDate = toResolvedDate();

    this.#formatters = toFormatters(this.locale);
    this.#today = todayDate;
  }

  render() {
    const {
      _currentDate,
      _max,
      _min,
      chooseMonthLabel,
      chooseYearLabel,
      showWeekNumber,
      startView,
    } = this;
    const formatters = this.#formatters;

    const { longMonthYearFormat } = formatters;
    const selectedYearMonth = longMonthYearFormat(_currentDate);
    const isStartViewYearGrid = startView === "yearGrid";
    const label = isStartViewYearGrid ? chooseMonthLabel : chooseYearLabel;

    return html`
      ${this.#renderHeader(_min, _max, _currentDate, selectedYearMonth)}

      <div
        class="body ${classMap({
          [`start-view--${startView}`]: true,
          "show-week-number": showWeekNumber,
        })}"
        part="body"
      >
        ${(isStartViewYearGrid ? this.#renderMonthYearGrid : this.#renderCalendar)()}
      </div>
    `;
  }

  #updateStartView = () => {
    this.startView = this.startView === "yearGrid" ? "calendar" : "yearGrid";
  };

  #renderHeader(_min, _max, _currentDate, selectedYearMonth) {
    if (this.startView === "yearGrid") {
      return nothing;
    }

    return html`<div class="header" part="header">
      ${this.#renderNavigationButton(NavigationType.Previous, isInCurrentMonth(_min, _currentDate))}
      <div class="month-and-year-selector" @click=${this.#updateStartView}>
        <p class="selected-year-month">${selectedYearMonth}</p>
      </div>
      ${this.#renderNavigationButton(NavigationType.Next, isInCurrentMonth(_max, _currentDate))}
    </div>`;
  }

  #renderNavigationButton = (navigationType, shouldSkipRender = true) => {
    const isPreviousNavigationType = navigationType === "previous";
    const label = isPreviousNavigationType ? this.previousMonthLabel : this.nextMonthLabel;

    return shouldSkipRender
      ? html`<div data-navigation=${navigationType}></div>`
      : html`
          <dw-icon-button
            .ariaLabel=${label}
            @click=${this.#navigateMonth}
            data-navigation=${navigationType}
            title=${ifDefined(label)}
            .icon=${isPreviousNavigationType ? "keyboard_arrow_left" : "keyboard_arrow_right"}
          ></dw-icon-button>
        `;
  };

  #renderMonthYearGrid = () => {
    let { _max, _min, _selectedDate, selectedYearLabel, toyearLabel } = this;
    _max = moment(_max).format("YYYY");
    _min = moment(_min).format("YYYY");
    _selectedDate = moment(_selectedDate).format(dateFormat);

    return html`
      <dw-month-year-grid
        .min=${_min}
        .max=${_max}
        .value=${_selectedDate}
        @value-changed=${this.#updateMonthYear}
      ></dw-month-year-grid>
    `;

    return html`
      <app-year-grid
        class="year-grid"
        .data=${{
          date: _selectedDate,
          formatters: this.#formatters,
          max: _max,
          min: _min,
          selectedYearLabel,
          toyearLabel,
        }}
        @year-updated=${this.#updateYear}
        exportparts="year-grid,year,toyear"
      ></app-year-grid>
    `;
  };

  #renderCalendar = () => {
    const {
      _currentDate,
      _max,
      _min,
      _selectedDate,
      disabledDates,
      disabledDays,
      firstDayOfWeek,
      locale,
      selectedDateLabel,
      shortWeekLabel,
      showWeekNumber,
      todayLabel,
      weekLabel,
      weekNumberTemplate,
      weekNumberType,
    } = this;
    const currentDate = _currentDate;
    const formatters = this.#formatters;
    const max = _max;
    const min = _min;
    const selectedDate = _selectedDate;
    const { dayFormat, fullDateFormat, longWeekdayFormat, narrowWeekdayFormat } = this.#formatters;

    const weekdays = getWeekdays({
      firstDayOfWeek,
      longWeekdayFormat,
      narrowWeekdayFormat,
      shortWeekLabel,
      showWeekNumber,
      weekLabel,
    });
    const {
      calendar: calendarMonth,
      disabledDatesSet,
      disabledDaysSet,
    } = calendar({
      date: currentDate,
      dayFormat,
      disabledDates: splitString(disabledDates, toResolvedDate),
      disabledDays: splitString(disabledDays, Number),
      firstDayOfWeek,
      fullDateFormat,
      locale,
      max,
      min,
      showWeekNumber,
      weekNumberTemplate,
      weekNumberType,
    });

    return html`
      <app-month-calendar
        .data=${{
          calendar: calendarMonth,
          currentDate,
          date: selectedDate,
          disabledDatesSet,
          disabledDaysSet,
          formatters,
          max,
          min,
          selectedDateLabel,
          showWeekNumber,
          todayDate: this.#today,
          todayLabel,
          weekdays,
        }}
        @date-updated=${this.#updateSelectedDate}
        class="calendar"
        exportparts="table,caption,weekdays,weekday,weekday-value,week-number,calendar-day,today,calendar"
      ></app-month-calendar>
    `;
  };

  #navigateMonth = (ev) => {
    const currentDate = this._currentDate;
    const isPreviousNavigation = ev.currentTarget.getAttribute("data-navigation") === "previous";

    const newCurrentDate = toUTCDate(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth() + (isPreviousNavigation ? -1 : 1),
      1
    );

    this._currentDate = newCurrentDate;

    /**
     * `.detail=1` means mouse click in `@click` for all browsers except IE11.
     */
    this.#focusNavButtonWithKey = ev.detail === 0;
  };

  #updateMonthYear({ detail }) {
    this._currentDate = new Date(detail);
    this.startView = "calendar";
  }

  #updateYear = ({ detail: { year } }) => {
    this._currentDate = new Date(this._currentDate.setUTCFullYear(year));
    this.startView = "calendar";
  };

  #updateSelectedDate = ({ detail: { value } }) => {
    const selectedDate = new Date(value);

    this._selectedDate = selectedDate;
    this._currentDate = new Date(selectedDate);

    /**
     * Always update `value` just like other native element such as `input`.
     */
    this.value = toDateString(selectedDate);
  };
}

customElements.define("dw-date-picker", DwDatePicker);
