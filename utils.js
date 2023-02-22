export const months = [
  { index: "01", name: "January", name_short: "Jan" },
  { index: "02", name: "February", name_short: "Feb" },
  { index: "03", name: "March", name_short: "Mar" },
  { index: "04", name: "April", name_short: "Apr" },
  { index: "05", name: "May", name_short: "May" },
  { index: "06", name: "June", name_short: "Jun" },
  { index: "07", name: "July", name_short: "Jul" },
  { index: "08", name: "August", name_short: "Aug" },
  { index: "09", name: "September", name_short: "Sep" },
  { index: "10", name: "October", name_short: "Oct" },
  { index: "11", name: "November", name_short: "Nov" },
  { index: "12", name: "December", name_short: "Dec" },
];

export const dateFormat = "YYYY-MM-DD";

export const yearsInArray = (minYear, maxYear) => {
  if (minYear > maxYear) {
    return [];
  }

  const years = [];
  for (let year = minYear; year <= maxYear; year++) {
    years.push(year.toString());
  }

  return years;
};
