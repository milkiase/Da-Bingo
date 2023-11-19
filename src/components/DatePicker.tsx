// import { useState } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';

import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

type DateRangePickerComponentProps = {
  value: Value,
  onChange: (dateRange:Value)=> void
}
function DateRangePickerComponent({value, onChange}:DateRangePickerComponentProps) {
  // const [value, onChange] = useState<Value>([new Date(), new Date()]);
  //console.log('date range', value)
  return (
    <div>
      <DateRangePicker onChange={onChange} value={value} />
    </div>
  );
}

export default DateRangePickerComponent;