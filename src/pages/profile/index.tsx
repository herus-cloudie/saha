'use client'

import { Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import Loader from 'src/@core/components/spinner/loader'

import PictUpload from 'src/components/pictUpload'
import ProfileUpload from 'src/components/profileUpload'
import {IdentTypeWithJwt } from 'src/context/types'
import parseCookieString from 'src/utils/parseCookieString'
import ParseJwt from 'src/utils/ParseJwt'

interface OCRDataType{
  message : string,
  result : number,
  data ?: {
    front : {
      firstName: string,
      lastName: string,
      fatherName: string,
      nationalCode: string,
      birthDate: string,
      city: string,
      province: string,
      facePhoto: string},
    back : object
  }
}

const Profile = () => {  
  const {
    control,
  } = useForm({
    mode: 'onBlur'
  })

  const router = useRouter()

  const [cookieData , setCookieData ] = useState<IdentTypeWithJwt>({
    id : 0,
    nationalCode : "",
    firstName : "",
    fatherName : "",
    lastName : "",
    phoneNumber : "",
    birthDate : "",
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

  const [open , setOpen ] = useState<boolean>(false);
  const [postalError , setPostalError ] = useState<''>('');
  const [postalCode , setPostalCode] = useState<string | number>();
  const [loading , setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<IdentTypeWithJwt | null>(null)
  const [mainLoader , setMainLoader] = useState(false);
  const [isMounted, setIsMounted] = useState(false)
  const [identStatus, setIdentState] = useState<string>('false')
  const [OCRData , setOCRData] = useState<OCRDataType>({
    message : '',
    result : 1,
    data : {
      front : {
        firstName: '',
        lastName: '',
        fatherName: '',
        nationalCode: '',
        birthDate: '',
        city: '',
        province: '',
        facePhoto: ''
      },
      back : {}
    },
  });

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fillJwt = async () => {
      const { jwt , identStatus } = parseCookieString(document.cookie)
      if (jwt) {
        const parsedData = ParseJwt(jwt)
        setUserData(parsedData)
        setCookieData(parsedData)
        setIdentState(identStatus)
      }
      setMainLoader(false) 
    }
    fillJwt()
  }, []);
  

  useEffect(() => {
    if (isMounted) {
      // if(userData?.nationalCode){
      //   // if(!userData?.workPlace){
      //   //   router.push('/second-step')
      //   // } else return;
      // } else router.push('/nationality')
    }
  }, [isMounted, userData , cookieData , router])

  if (mainLoader) {
    return <Loader />
  }


  const dialogFunc = async (data: OCRDataType) => {
    try {
      setOCRData(data);
  
      if (data.result === 1) {
        if (cookieData.nationalCode !== data.data?.front.nationalCode) {
          return setOCRData({
            ...OCRData,
            message: 'عدم همخوانی اطلاعات کارت ملی آپلود شده با اطلاعات حساب کاربری',
            result: 21
          });
        }
  
        const updateImgInJwt = await fetch('https://api.cns365.ir/api/api.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image: `data:image/png;base64,${data.data?.front?.facePhoto}`,
            nationalCode: cookieData.nationalCode,
            category : cookieData.category,
            subgroup : cookieData.subgroup,
            workPlace : cookieData.workPlace,
          })
        });
  
        const updatedResponse = await updateImgInJwt.json();

        if (!updateImgInJwt.ok) {
          throw new Error(updatedResponse.message || 'خطا در به روزرسانی تصویر');
        }

        setCookieData({...cookieData , jwt : updatedResponse.token})
        document.cookie = `jwt = ${updatedResponse.token}; SameSite=None; Secure; Path=/; SameSite=None; Secure; Max-Age=${7 * 24 * 60 * 60}`;
        document.cookie = `identStatus = true; SameSite=None; Secure; Path=/; SameSite=None; Secure; Max-Age=${7 * 24 * 60 * 60}`;
      
      } else {
        setOCRData({ ...OCRData, message: data.message, result: 21 });
      }
    } catch (postalError) {
      setOCRData({
        message: 'خطایی رخ داده است. دوباره تلاش کنید',
        result: 21
      });
    } finally {
      setOpen(true); 
    }
  };

  const areImagesFilled = (front : any, back : any) => {
    if(!front || !back) {
      setOpen(true);
      setOCRData({...OCRData , message : 'لطفا پشت و روی عکس خود را بارگذاری کنید' , result : 21})
    } 
  }


  const sendPostalCode = async () => {
    setLoading(true)
    const sendPostal = await fetch('https://api.zibal.ir/v1/facility/postalCodeInquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
        'Authorization': 'Bearer 9361a1e1fbd64b8e87cf98abb6b665d3'
       },
      body: JSON.stringify({"postalCode": postalCode})
    });

    const Data = await sendPostal.json();
    
    if(Data.result == 6){
      setPostalError(Data.message)
      setLoading(false);
      return 
    } 
    setCookieData({...cookieData , address : `${Data.data.address.town}, ${Data.data.address.district}, ${Data.data.address.street}, ${Data.data.address.street2}, پلاک ${Data.data.address.number}, طبقه ${Data.data.address.floor}, واحد ${Data.data.address.sideFloor}`})

    const updateAddress = await fetch('https://api.cns365.ir/api/api.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        address : `${Data.data.address.town}, ${Data.data.address.district}, ${Data.data.address.street}, ${Data.data.address.street2}, پلاک ${Data.data.address.number}, طبقه ${Data.data.address.floor}, واحد ${Data.data.address.sideFloor}`,
        category : cookieData.category,
        subgroup : cookieData.subgroup,
        workPlace : cookieData.workPlace,
        postal_code : postalCode,
        nationalCode : cookieData.nationalCode
      })
    });
    
    const updatedResponse = await updateAddress.json();
    setLoading(false)
    document.cookie = `jwt = ${updatedResponse.token}; SameSite=None; Secure; Path=/; SameSite=None; Secure; Max-Age=${7 * 24 * 60 * 60}`;
      
  }

  return (
    <div>
      <Card style={{padding : '0 30px 30px'}}>
        <Grid container spacing={6} className='match-height'>
            <Grid item xs={12}>
              <h1>اطلاعات شخصی</h1>
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
            نام : <span>{cookieData.firstName}</span>
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
            نام خانوادگی : <span>{cookieData.lastName}</span>
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
            نام پدر : <span>{cookieData.fatherName}</span>
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
            کد ملی : <span>{cookieData.nationalCode}</span>
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
            تاریخ تولد : <span>{cookieData.birthDate as string}</span>
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
            شماره تماس : <span>{cookieData.phoneNumber}</span>
            </Grid>
            <Grid item xs={12} xl={6}>
              <ProfileUpload identStatus={identStatus} areImagesFilled={areImagesFilled} dialogFunc={dialogFunc}/>
            </Grid>
            <Grid item xs={12} xl={6}>
              <PictUpload identStatus={identStatus} areImagesFilled={areImagesFilled} dialogFunc={dialogFunc}/>
            </Grid>
            {
              !cookieData.address ? 
              <>
                <Grid item xs={12}>
                  <div style={{display : 'flex' , justifyContent : 'space-between' , alignItems : 'center'}}>
                    <h3>کد پستی</h3>
                    <h2 style={{padding: '5px 25px', borderRadius: '25px', boxShadow: '0px 0px 8px #c4c4c4'}}>3</h2>
                  </div>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                      <Controller
                        name='nationalCode'
                        control={control}
                        render={({ field: { onBlur } }) => (
                          <TextField
                            autoFocus
                            label='کد پستی'
                            value={postalCode}
                            onBlur={onBlur}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder='10 رقم'
                          />
                        )}
                      />
                  </FormControl>
                </Grid>
                <div style={{display : 'flex' , justifyContent : "center" , width : '100%' , paddingRight: '1.5rem' , flexDirection : 'column' , alignItems : 'center'}}>
                  { postalError && <h4 style={{color : 'red'}}>{postalError}</h4>}
                  {loading ?         
                    <Box display="flex" justifyContent="center" alignItems="center" >
                      <CircularProgress/>
                    </Box>
                    : 
                    <Button onClick={sendPostalCode} style={{width : '300px'}} size='large' color='success' component='label' variant='contained'>
                        صحت سنجی کدپستی
                    </Button> 
                    }
                </div> 
              </> : 
              <Grid item xs={12}>
                    <Card style={{padding : '20px' , backgroundColor: '#15d10021'}}>
                      <Grid item xs={12}>
                            <div style={{display : 'flex' , justifyContent : 'space-between' , alignItems : 'center'}}>
                              <h3>کد پستی و  آدرس سکونت</h3>
                              <h2 style={{padding: '5px 25px', borderRadius: '25px', boxShadow: '0px 0px 8px #c4c4c4'}}>3</h2>
                              
                            </div>
                            <div style={{display : 'flex' , justifyContent : 'space-around' , flexDirection : 'column' , alignItems : 'center'}}>
                                <h3>کد پستی : {cookieData.postal_code}</h3>
                                <h3>آدرس: {cookieData.address}</h3>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    textAlign: 'center',
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    '& svg': {
                                      mb: 8,
                                      color:  'success.main'
                                    }
                                  }}
                                >
                                <Icon color='success' icon='mdi:check-circle-outline' fontSize='3.5rem'/>
                              </Box>
                            </div>
                        </Grid>
                    </Card>
              </Grid>
            }
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
                      color: OCRData.result == 1  ? 'success.main' : 'postalError.main'
                    }
                  }}
                >
                  <Icon icon={OCRData.result == 1 ? 'mdi:check-circle-outline' : 'mdi:close-circle-outline' }fontSize='5.5rem' />
                  <Typography>{OCRData.message}</Typography>
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
        </Grid>
      </Card>
    </div>
  )
}

export default Profile
