
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"

export default function DatePickerFunc({ChangeDateHandler , value} : {ChangeDateHandler : any , value : any}) {
  return (
    <div dir="rtl">
      <h4 style={{marginBottom : '10px'}}>تاریخ تولد</h4>
      <div style={{ direction: "rtl" , width : '100%' , display : 'flex' , justifyContent : 'center' , marginBottom : '25px' }}>
        <DatePicker
          className="mb-5"
          onChange={ChangeDateHandler}
          calendar={persian}
          value={value}
          locale={persian_fa}
          calendarPosition="bottom-right"
        />
      </div>
    </div>
    )
}
