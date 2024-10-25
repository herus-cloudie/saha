import { Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react'
import readXlsxFile from 'read-excel-file'
import IconifyIcon from 'src/@core/components/icon';

const GroupUpload = () => {
    const [open , setOpen] = useState<boolean>(false);
    const sendXlsx = async (State : any) => {
        const sendReq = await fetch('https://api.cns365.ir/api/bulk.php' , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(State)
          })
        const Data = await sendReq.json();

        console.log(Data)
        setOpen(true)
    }
    
  return (
    <>
    <Grid container spacing={6} style={{ marginRight: '0px', marginTop: '10px' }}>
      <Grid style={{marginBottom : '20px' , padding : '10px'}} item xs={12}>
        <h2>بارگذاری جمعی کارکنان</h2>
        <h5 style={{marginLeft : '15px'}}>جهت سهولت کاربری، میتوانید اطلاعات کاکنان خود را از طریق فایل اکسل به صورت یکجا بارگذاری نمایید</h5>
      </Grid>  
      <Grid  style={{marginBottom : '20px' , marginRight : '-10px' , paddingRight : '0px' , padding : '10px' , display : 'flex' , justifyContent : 'space-around' , width : '100%' , alignItems : 'center'}} item xs={12} >
        <Button component='label' variant='contained' color='primary'>
          بارگذاری اکسل شما
          <input
            hidden
            type='file'
            id='input' 
            accept='.xlsx'
            onChange={(e : any) => readXlsxFile(e.target.files[0]).then((rows) => sendXlsx(rows))}
          />
        </Button> 
        <a href='https://api.cns365.ir/uploads/sample.xlsx' >
          <Button component='label' variant='contained' style={{backgroundColor : '#DB8669'}}>
            دانلود نمونه فایل
          </Button>
         </a>
      </Grid>  
    </Grid>
    <Dialog fullWidth maxWidth='xs' open={open} onClose={() => setOpen(false)}>
    <DialogContent
      sx={{
        pb: theme => `${theme.spacing(6)} !important`,
        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
        pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
      }}
    >
      <Box
        sx={{
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
          '& svg': {
            mb: 8,
            color: 'success.main' 
          }
        }}
      >
        <IconifyIcon icon={'mdi:check-circle-outline'}fontSize='5.5rem' />
        <Typography>فایل شما با موفقیت بارگذاری شد</Typography>
      </Box>
    </DialogContent>
    <DialogActions
      sx={{
        justifyContent: 'center',
        px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
        pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
      }}
    >
      <Button variant='contained' sx={{ mr: 2 }} onClick={() => setOpen(false)}>
        بستن
      </Button>
    </DialogActions>
    
    </Dialog>

    </>
    

  )
}

export default GroupUpload
