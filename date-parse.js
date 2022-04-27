import moment from "moment/src/moment";

/**
 *
 * @param {String} value input date in string in any below format
 *  - dd/mm/yyyy (or mm/dd/yyyy)
 *  - dd-mm-yyyy (or mm-dd-yyyy)
 *  - yyyy-mm-dd
 *  - yyyy/mm/dd
 *  - DD MMM, YYYY
 *  - DD MMM YYYY
 *  - MMM DD, YYYY
 *  - MMM DD YYYY
 * @param {String} format date format
 * @returns {String} parsed date in dd/mm/yyyy (default), mm/dd/yyyy
 */
export const dateParse = (value, format, seperator) => {
  value = value || "";
  let isNumber = isNumeric(value.replace(/ /g, "").replace(/[^a-zA-Z0-9 ]/g, ""));

  if (isNumber) {
    // Prosessing date String, considering input has Seperator (- or / or space)
    if (hasSeperator(value)) {
      let places = seperateDate(value, /[-\/, ]/);

      places = fillEmptyPlaces(places, format);
      return places.slice(0, 3).join(seperator);
    }

    // Prosessing date String, considering input has only number. no seperator (- or / or space)
    else {
      let places = createPlaces(value);

      places = fillEmptyPlaces(places, format);
      return places.slice(0, 3).join(seperator);
    }
  }

  // Processing date String, considering input includes alphabetic like months in MMM format
  else {
    value = value.replace(/, /g, " ");
    let places = seperateDate(value, /[-\/, ]/);

    // Considering date format like DD MMM YYYY
    if (isNumeric(places[0])) {
      places[1] = moment().month(places[1]).format("MM");

      if (format.toUpperCase() === "MM/DD/YYYY") {
        places = reorderMonth(places, 1, 0);
      }

      places = fillEmptyPlaces(places, format);
      return places.slice(0, 3).join(seperator);
    }
    // Considering date format like MMM DD YYYY
    else {
      places[0] = moment().month(places[0]).format("MM");

      if (format.toUpperCase() === "DD/MM/YYYY") {
        places = reorderMonth(places, 0, 1);
      }

      places = fillEmptyPlaces(places, format);

      return places.slice(0, 3).join(seperator);
    }
  }
};

/**
 * checks input string is numeric or not
 * @param {String} string date in string
 * @returns {Boolean}
 */
function isNumeric(string) {
  return !isNaN(string);
}

/**
 * Used to check input date has - or / or space.
 * @param {String} value Date in string
 * @returns {Boolean}
 */
function hasSeperator(value) {
  return value.split(/[-\/, ]/).length > 1;
}

/**
 * Seperator date using regEx
 * @param {Sring} value Date in String
 * @param {String} regEx regEx
 * @returns {Array}
 */
function seperateDate(value, regEx) {
  return value.split(regEx);
}

/**
 * used to set places that are empty or contain only zeros &
 * uses `pad` method to put prefix '0' in value of place[1] and place[2] if there value's length lessthan 2
 *
 * @param {Array} places - represent `dateArray`
 * @param {String} format - represent `_inputFormat` property
 * @return {Array} places - represent `dateArray` with filled places
 */
function fillEmptyPlaces(places, format) {
  let tempPlaces = places;
  let isMonthFirst = format.toUpperCase() === "MM/DD/YYYY";
  let isYearFirst = places[0].length === 4;
  let day = moment().format("DD");
  let month = moment().format("MM");
  let year = moment().format("YYYY");

  // considering first place has year
  if (isYearFirst) {
    if (!parseInt(places[0])) {
      tempPlaces[0] = year;
    }
    if (!parseInt(places[1])) {
      tempPlaces[1] = isMonthFirst ? day : month;
    }
    if (!parseInt(places[2])) {
      tempPlaces[2] = isMonthFirst ? month : day;
    }

    return tempPlaces.reverse();
  }

  if (!parseInt(places[0])) {
    tempPlaces[0] = isMonthFirst ? (tempPlaces[0] < day ? month : month - 1) : day;
  }
  if (!parseInt(places[1])) {
    tempPlaces[1] = isMonthFirst ? day : tempPlaces[0] < day ? month : month - 1;
  }
  if (!parseInt(places[2])) {
    tempPlaces[2] =
      parseInt(tempPlaces[1]) <= month
        ? parseInt(tempPlaces[0]) <= day
          ? year
          : year - 1
        : year - 1;
  }

  tempPlaces[0] = pad(places[0]);
  tempPlaces[1] = pad(places[1]);

  if (tempPlaces[2] < 1000) {
    tempPlaces[2] = 2000 + parseInt(tempPlaces[2]);
  }

  return tempPlaces;
}

/**
 * used to set zero as prefix in value store in  number letiable,
 * otherwise keep number's value as it is & return it
 *
 * @param {String} number
 * @return {String} number
 */
function pad(number) {
  number = number.toString().length < 2 ? "0" + number : number;
  return number;
}

/**
 * used to create places for day, month and year
 *
 * @param {String} value value represent formated text
 * @returns {Array} Array that now have places for day, month and year
 */
function createPlaces(value) {
  let place1, place2, place3;

  place1 = value.slice(0, 2);
  place2 = value.slice(2, 4);
  place3 = value.slice(4, 8);

  return [place1, place2, place3];
}

/**
 *
 * @param {Array} value represent `dateArray`
 * @returns {Array} reorder month
 */
function reorderMonth(value, from, to) {
  if (value.length === 1) {
    value.push("", "");
  }
  value.move(from, to);
  return value;
}

Array.prototype.move = function (from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};
