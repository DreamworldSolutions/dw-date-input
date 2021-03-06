
# dw-date-input

- A date input element made with [dw-input](https://github.com/DreamworldSolutions/dw-input) use to take date input from the user.

## Installation

``` html
npm install --save @dreamworld/dw-date-input
```

## Usage

``` html
  import '@dreamworld/dw-date-input/dw-date-input';
```

## [Demo](https://dreamworldsolutions.github.io/dw-date-input/demo/index.html)

## Events

Triggers `value-changed` event on value change.

## Features

Supports all the features of `dw-input` like `disabled`, `readOnly`, `hint` etc. Additional features are as below:

- Takes user input in below formates
  - mm/dd/yyy (Default)
  - dd/mm/yyyy
  - dd-mm-yyyy
  - mm-dd-yyyy
    
- Autofills remaining places and formates date
  - e.g. If user enters `1212`, value will be `12/12/2019`
  
- Performs validation and show error message accordingly
  - also performs validation for minDate and maxDate

### Examples

#### Set `inputFormat` property to set input format
``` html
  <dw-date-input label="Date" inputFormat="dd-mm-yyyy" placeholder="Enter date"></dw-date-input>
```

#### Use `value` property to show pre-filled value
``` html
  <dw-date-input label="Date" value="02/12/2019"></dw-date-input>
```

#### Use `minDate` and `maxDate` property for min and max date validation
``` html
  <dw-date-input label="Date" minDate="02/12/2019" maxDate="02/12/2020"></dw-date-input>
```