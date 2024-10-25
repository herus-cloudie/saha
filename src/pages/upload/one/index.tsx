import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react'
import IconifyIcon from 'src/@core/components/icon';
import { IdentTypeWithJwt } from 'src/context/types';

// ** MUI Components
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'


import { Autocomplete } from '@mui/material'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginCredentialSchema } from 'src/constant';
import DatePickerFunc from 'src/components/datePicker';
import convertPersianDateToLatin from 'src/utils/dateConverter';

const defaultValues = {
  firstName: '',
  fatherName: '',
  isDead: false,
  lastName: '',
  matched: true,
  alive: true,
  nationalCode: '',
  image : '',
  identPict : '',
  phoneNumber : '',
  workPlace : '',
  nationality : 'ایرانی',
  officiality : 'دارای شناسه اتباع',
  birthDate : new Date(),
  category : 'اصناف',
  role : 'user',
  subgroup : '',
  address : ''
}

const OneUpload = () => {
  const [open , setOpen] = useState<boolean>(false);
  const [loading , setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');

  const [subgroupOptions , setSubgroupOptions] = useState<string[]>(['کشور' , 'استان' , 'شهر' , 'اتحادیه' , 'واحد صنفی']);

  const [userData , setUserData ] = useState<IdentTypeWithJwt>({
    id : 0,
    nationalCode : "",
    firstName : "",
    fatherName : "",
    lastName : "",
    phoneNumber : "",
    birthDate : convertPersianDateToLatin(new Date().toLocaleDateString("fa-IR")),
    officiality : "دارای شناسه اتباع",
    nationality : "ایرانی",
    workPlace : "",
    category : "اصناف",
    subgroup : "",
    image : "",
    postal_code : "",
    address : "",
    identPict : "",
    isDead : 0,
    matched : 1,
    alive : 1,
    role : "user",
    jwt : "",
    senfCode : '',
    position : ''
  });

  const {
    control,
  } = useForm({
    mode: 'onBlur',
    defaultValues,
    resolver: yupResolver(loginCredentialSchema)
  })

  const ChangeDateHandler = (e : any) => {
    const date = new Date(e);
    const stringBirthDate = convertPersianDateToLatin(new Date(date).toLocaleDateString("fa-IR"))
    setUserData({...userData , birthDate : stringBirthDate as string})
  }

  const FirstReq = async () => { 
    if(!userData.firstName || !userData.lastName || !userData.fatherName || !userData.nationalCode || !userData.phoneNumber || !userData.workPlace || !userData.subgroup || !userData.category || !userData.postal_code || !userData.birthDate) return setError('تمامی بخش ها را کامل کنید')
    setLoading(true)
    const sendPostal = await fetch('https://api.zibal.ir/v1/facility/postalCodeInquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer 9361a1e1fbd64b8e87cf98abb6b665d3'
       },
      body: JSON.stringify({"postalCode": userData.postal_code})
    });

    const Data = await sendPostal.json();
    if(Data.result == 6) {
      setError(Data.message)
      setLoading(false)
    }else {
      setError('')
      setUserData({...userData , address : `${Data.data.address.town}, ${Data.data.address.district}, ${Data.data.address.street}, ${Data.data.address.street2}, پلاک ${Data.data.address.number}, طبقه ${Data.data.address.floor}, واحد ${Data.data.address.sideFloor}`})
      FinalReq() 
      setLoading(false);
    }
  }

  const FinalReq = async () => {
    const result = await fetch('https://api.cns365.ir/api/manual.php' , {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {'Content-Type': 'application/json'}
    })
    const Data = await result.json();
    console.log(Data)

    if(Data.token) setOpen(true)
  } 

  return (
    <Card style={{padding : '30px 50px 30px 60px'}}>
    <Grid container spacing={6} style={{ marginRight: '0px', marginTop: '10px' }}>
      <Grid style={{marginBottom : '20px' , padding : '10px'}} item xs={12}>
        <h2>فرم ثبت اطلاعات کارکنان</h2>
        <h5 style={{marginLeft : '15px'}}>با استفاده از فرم زیر میتوانید اطلاعات کارکنان خود را به صورت دستی ثبت نمایید </h5>
      </Grid>  
      <form>
        <Autocomplete
          options={['ایرانی' , 'اتباع']}
          getOptionLabel={(option: any) => option}
          value={userData.nationality}
          style={{marginBottom: '40px'}}
          onChange={(e, newValue : any) => setUserData({...userData , nationality : newValue})}
          renderInput={(params) => <TextField {...params} label={'ملیت'} variant="standard" />}
        />
        {
          userData.nationality == 'ایرانی' ?
            <>                       
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                    name='firstName'
                    control={control}
                    render={({ field: { onBlur } }) => (
                        <TextField
                        autoFocus
                        label='نام'
                        value={userData.firstName}
                        onBlur={onBlur}
                        onChange={(e) => setUserData({...userData , firstName : e.target.value})}
                        placeholder=''
                        />
                    )}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                    name='lastName'
                    control={control}
                    render={({ field: { onBlur } }) => (
                        <TextField
                        autoFocus
                        label='نام خانوادگی'
                        value={userData.lastName}
                        onBlur={onBlur}
                        onChange={(e) => setUserData({...userData , lastName : e.target.value})}
                        placeholder=''
                        />
                    )}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                    name='fatherName'
                    control={control}
                    render={({ field: { onBlur } }) => (
                        <TextField
                        autoFocus
                        label='نام پدر'
                        value={userData.fatherName}
                        onBlur={onBlur}
                        onChange={(e) => setUserData({...userData , fatherName : e.target.value})}
                        placeholder=''
                        />
                    )}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                    name='nationalCode'
                    control={control}
                    render={({ field: { onBlur } }) => (
                        <TextField
                        autoFocus
                        label='کد ملی'
                        value={userData.nationalCode}
                        onBlur={onBlur}
                        onChange={(e) => setUserData({...userData , nationalCode : e.target.value})}
                        placeholder=''
                        />
                    )}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                    name='phoneNumber'
                    control={control}
                    render={({ field: { onBlur } }) => (
                        <TextField
                        autoFocus
                        label='شماره موبایل'
                        value={userData.phoneNumber}
                        onBlur={onBlur}
                        onChange={(e) => setUserData({...userData , phoneNumber : e.target.value})}
                        placeholder=''
                        />
                    )}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                    name='address'
                    control={control}
                    render={({ field: { onBlur } }) => (
                        <TextField
                        autoFocus
                        label='محل کار'
                        value={userData.workPlace}
                        onBlur={onBlur}
                        onChange={(e) => setUserData({...userData , workPlace : e.target.value})}
                        placeholder=''
                        />
                    )}
                    />
                </FormControl>
                <Autocomplete
                  options={['حمل و نقل' , 'اصناف' , 'وزارت کشور']}
                  getOptionLabel={(option: any) => option}
                  value={userData.category}
                  style={{margin : '5px 0 15px' }}
                  onChange={(e, newValue) => {
                    setUserData({...userData , category : newValue as "اصناف" | "حمل و نقل" | "گردشگری"})
                    if(newValue == 'اصناف') setSubgroupOptions(['کشور' , 'استان' , 'شهر' , 'اتحادیه' , 'واحد صنفی'])
                    if(newValue == 'وزارت کشور') setSubgroupOptions([ 'واحد صنفی'])
                    if(newValue == 'حمل و نقل') setSubgroupOptions(['کشور' , 'واحد صنفی'])
                  }}
                  renderInput={(params) => <TextField {...params} label={'دسته بندی'} variant="filled" />}
                />
                <Autocomplete
                  options={subgroupOptions}
                  getOptionLabel={(option: any) => option}
                  value={userData.subgroup}
                  style={{margin : '15px 0' }}
                  onChange={(e, newValue) => setUserData({...userData , subgroup : newValue as string})}
                  renderInput={(params) => <TextField {...params} label={'گروه بندی'} variant="filled" />}
                />

                <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                    name='address'
                    control={control}
                    render={({ field: { onBlur } }) => (
                        <TextField
                        autoFocus
                        label='کد پستی'
                        value={userData.postal_code}
                        onBlur={onBlur}
                        onChange={(e) => setUserData({...userData , postal_code : e.target.value})}
                        placeholder=''
                        />
                    )}
                    />
                </FormControl>  
                <DatePickerFunc value={userData.birthDate} ChangeDateHandler={ChangeDateHandler}/>
            </>
            : null             
        }
        
        {error && <p style={{color : '#ff3d3d' , textAlign : 'center'}}>{error}</p>} 

        {
          loading ? 
            <div style={{textAlign : 'center' , display : 'flex' , justifyContent : 'center' , margin : '-35px 0px 35px'}}>
                        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
            <CircularProgress />
          </Box>
            </div>
            : <Grid style={{marginBottom : '20px' , marginRight : '-10px' , paddingRight : '0px' , padding : '10px' , display : 'flex' , justifyContent : 'space-around' , width : '100%' , alignItems : 'center'}} item xs={12} >
              <Button onClick={FirstReq} component='label' variant='contained' color='success'>
                  ثبت اطلاعات
              </Button>
            </Grid>
        }
      </form>  
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
          <Typography>اطلاعات کارمند شما با موفقیت ذخیره شد</Typography>
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

    </Card>

  )
}

export default OneUpload
