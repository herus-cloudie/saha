import { Button } from '@mui/material';
import React, { useState } from 'react'
import readXlsxFile from 'read-excel-file'

const GroupUpload = () => {
    const [state , setState] = useState<object[]>();
    const sendXlsx = async (state : any) => {
        const sendReq = await fetch('https://api.cns365.ir/api/bulk.php' , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(state)
          })
        const Data = await sendReq.json();
        setState(Data.processed_records)

        console.log(state)
    }
  return (
    <Button component='label' variant='contained'>
    فایل اکسل خود را وارد کنید
      <input
      hidden
      type='file'
      id='input' 
      accept='.xlsx'
      onChange={(e : any) => readXlsxFile(e.target.files[0]).then((rows) => sendXlsx(rows))}
    />
    </Button>
  )
}

export default GroupUpload