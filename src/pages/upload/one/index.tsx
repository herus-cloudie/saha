import { Button, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react'
import readXlsxFile from 'read-excel-file'
import IconifyIcon from 'src/@core/components/icon';

const OneUpload = () => {
    const [state , setState] = useState<object[]>();
    const [open , setOpen] = useState<boolean>(false);
    const sendForm = async (state : any) => {
        const sendReq = await fetch('https://api.cns365.ir/api/bulk.php' , {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(state)
          })
        const Data = await sendReq.json();
        setState(Data.processed_records)
        setOpen(true)
        console.log(state)
    }
  return (
    <>
    <Grid container spacing={6} style={{ marginRight: '0px', marginTop: '10px' }}>
      <Grid style={{marginBottom : '20px' , padding : '10px'}} item xs={12}>
        <h2>فرم ثبت کارکنان</h2>
        <h5 style={{marginLeft : '15px'}}>با استفاده از فرم زیر میتوانید اطلاعات کارکنان خود را به صورت دستی ثبت نمایید </h5>
      </Grid>  
      <Grid  style={{marginBottom : '20px' , marginRight : '-10px' , paddingRight : '0px' , padding : '10px' , display : 'flex' , justifyContent : 'space-around' , width : '100%' , alignItems : 'center'}} item xs={12} >
        <Button component='label' variant='contained' color='success'>
            ثبت اطلاعات
        </Button>
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

export default OneUpload
