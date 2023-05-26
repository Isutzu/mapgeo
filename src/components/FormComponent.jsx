import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FormComponent = () => {
  const [textValue, setTextValue] = useState('');
  const [dateValue, setDateValue] = useState(null);

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleDateChange = (date) => {
    setDateValue(date);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the form values
    console.log('Text:', textValue);
    console.log('Date:', dateValue);
    // Reset form
    setTextValue('');
    setDateValue(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="text-input">Text Input:</label>
        <input
          type="text"
          id="text-input"
          value={textValue}
          onChange={handleTextChange}
          required
        />
      </div>
      <div>
        <label htmlFor="date-picker">Date Picker:</label>
        <DatePicker
          id="date-picker"
          selected={dateValue}
          onChange={handleDateChange}
          dateFormat="MM/dd/yyyy"
          required
        />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default FormComponent;
