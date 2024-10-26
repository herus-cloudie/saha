'use client'

import { Autocomplete, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import IconifyIcon from 'src/@core/components/icon'
import Loader from 'src/@core/components/spinner/loader'

import {IdentTypeWithJwt } from 'src/context/types'
import parseCookieString from 'src/utils/parseCookieString'
import ParseJwt from 'src/utils/ParseJwt'

const Work = () => {  
  const router = useRouter();
  const {
    control,
  } = useForm()

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
    province : '',
    city : '',
    senfCode : "",
    position : '',
    jwt : ""
  });

  const [newJob, setNewJob] = useState({
    senfCode : '',
    workPlace : '',
    position : '',
    category: '',
    subgroup: '',
    province: '',
    city : ''
  });
 
  const [loading, setLoading] = useState<boolean>(false);  
  const [error, setError] = useState('');
  const [mainLoader , setMainLoader] = useState(true);
  const [open, setOpen] = useState(false)
  const [workFieldOpen, setWorkFieldOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false);
  const [workPlaceLoading, setWorkPlaceLoading] = useState<boolean>(false);  
  const [alreadyAddedSecondJob, setAlreadyAddedSecondJob] = useState<boolean>(false);  

  const getSecondJob = async () => {
    const sendReq = await fetch('https://api.cns365.ir/api/secondw.php' , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({nationalCode : cookieData.nationalCode})
    })
    const Data = await sendReq.json();
    console.log(Data)
    if(Data.success) {
      setNewJob({...Data.workplaceData[0] , senfCode : Data.workplaceData[0].senf_code })
      setAlreadyAddedSecondJob(true)
    }
    setMainLoader(false) 
  }

  useEffect(() => {
    setIsMounted(true)
    const fillJwt = async () => {
      const { jwt } = parseCookieString(document.cookie)
      if (jwt) {
        const parsedData = ParseJwt(jwt)
        setCookieData(parsedData)
      }
      setMainLoader(false) 
    }
    fillJwt()
  }, []);
  

  useEffect(() => {
    if (isMounted) {
      getSecondJob()
      if(cookieData?.nationalCode){
      } else router.push('/nationality')
    }
  }, [isMounted, cookieData , cookieData , router])
  
  const submitWork = async () => {
    if(!newJob.senfCode) return setError('کد صنفی را وارد کنید')
    if(newJob.senfCode.length != 10) return setError('کد صنفی حداقل و حداکثر 10 رقم میباشد')
    if(!newJob.workPlace) return setError('محل کار خود را وارد کنید')
    if(!newJob.position) return setError('سمت را وارد کنید')
    setLoading(true)
    const result = await fetch('https://api.cns365.ir/api/senf.php' , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"senfCode": newJob.senfCode , nationalCode : cookieData.nationalCode})
    })
    const Data = await result.json();
    if(Data.error) {
      setError('کد صنفی نامعتبر است')
      setLoading(false)
    }else {
      setError('')
      setNewJob({ ...newJob,
        category: Data.category,
        subgroup: Data.subgroup,
        province: Data.province,
        city : Data.city,
      })

      const addJob = await fetch('https://api.cns365.ir/api/workdata.php' , {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...newJob ,
          subgroup : Data.subgroup ,
          province : Data.province ,
          city : Data.city ,
          category : Data.category,
          nationalCode : cookieData.nationalCode,
          position : newJob.position
        })
      })
      const response = await addJob.json();
      router.reload()
      setLoading(false)
      console.log(response)
    }

  }

  const addFirstWorkPlace = async () => {
    
    setWorkPlaceLoading(true)
    const result = await fetch('https://api.cns365.ir/api/api.php' , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...cookieData})
    })
    const Data = await result.json();
    document.cookie = `jwt = ${Data.token}; SameSite=None; Secure; Path=/; Max-Age=${7 * 24 * 60 * 60}`;
    document.cookie = `workPlaceStatus = done; SameSite=None; Secure; Path=/; Max-Age=${7 * 24 * 60 * 60}`;
    setWorkPlaceLoading(false)
    setWorkFieldOpen(false)
  }
  
  if (mainLoader) {
    return <Loader />;
  }

  console.log(cookieData)
  return (
    <div>
      <Card style={{padding : '0 30px 30px'}}>
        <Grid container spacing={6} className='match-height'>
            <Grid item xs={12}>
              <h1>اطلاعات کاری</h1>
            </Grid>
            <Grid item xs={6}>
                  <Card sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , flexDirection : "column"}}>
                    <Grid item xs={12}>
                      <h3>شغل اول</h3>
                    </Grid>
                    <Grid item xs={12} sm={6} xl={12}>
                    شناسه صنفی : <span>{cookieData.senfCode}</span>
                    </Grid>
                    <Grid item xs={12} sm={6} xl={12}>
                    سمت جاری :  <span>{cookieData.position}</span>
                    </Grid>
                    <Grid item xs={12} sm={6} xl={12}>
                    نام واحد صنفی : {cookieData.workPlace ?
                    cookieData.workPlace : <Button onClick={() => setWorkFieldOpen(true)} sx={{mr : 2}} color='warning' size='small' variant='outlined'>تکمیل</Button>  }
                    </Grid>
                    <Grid item xs={12} sm={6} xl={12}>
                    اتحادیه : <span>{cookieData.category}</span>
                    </Grid>
                    <Grid item xs={12} sm={6} xl={12}>
                    رسته : <span>{cookieData.subgroup}</span>
                    </Grid>
                  </Card>
                </Grid>

            
            {
              alreadyAddedSecondJob
               ?   <Grid item xs={6}> 
                 <Card sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , flexDirection : "column"}}>
                <Grid item xs={12}>
                  <h3>شغل دوم (فرعی)</h3>
                </Grid>
                <Grid item xs={12} sm={6} xl={12}>
                شناسه صنفی : <span>{newJob.senfCode}</span>
                </Grid>
                <Grid item xs={12} sm={6} xl={12}>
                سمت جاری :  <span>{newJob.position}</span>
                </Grid>
                <Grid item xs={12} sm={6} xl={12}>
                محل کار : {newJob.workPlace ?
                 newJob.workPlace : <Button onClick={() => setWorkFieldOpen(true)} sx={{mr : 2}} color='warning' size='small' variant='outlined'>تکمیل</Button>  }
                </Grid>
                <Grid item xs={12} sm={6} xl={12}>
                اتحادیه : <span>{newJob.category}</span>
                </Grid>
                <Grid item xs={12} sm={6} xl={12}>
                رسته : <span>{newJob.subgroup}</span>
                </Grid>
              </Card>
              </Grid>
              :<Grid item xs={6}>
                <Card onClick={() => setOpen(true)} sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , flexDirection : "column"}}>
                  <div style={{display : 'flex' , cursor : 'pointer',flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center' , marginTop : '30rem0px'}}>
                    <h2>افزودن شغل</h2>
                    <IconifyIcon width={80} icon={"mdi:tab-add"}></IconifyIcon>
                  </div>
                </Card>
              </Grid>
            }
            
        </Grid>
      </Card>
      <Dialog fullWidth maxWidth='xs' open={workFieldOpen} onClose={() => setWorkFieldOpen(false)}>
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
                  {/* <IconifyIcon icon={"mdi:tab-add"} fontSize='2rem' /> */}
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='workPlace'
                      control={control}
                      render={({ field: { onBlur } }) => (
                        <TextField
                          autoFocus
                          label='نام واحد صنفی'
                          value={cookieData.workPlace}
                          onBlur={onBlur}
                          onChange={(e) => setCookieData({...cookieData , workPlace : e.target.value})}
                          placeholder=''
                        />
                      )}
                    />
                  </FormControl>
                </Box>
              </DialogContent>
              <DialogActions
                sx={{
                  justifyContent: 'center',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
              
                {
                  workPlaceLoading ?           
                  <div style={{textAlign : 'center' , display : 'flex' , justifyContent : 'center' , margin : '-35px 0px 35px'}}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                      <CircularProgress />
                    </Box>
                  </div>
                  : <Button variant='contained' sx={{ mr: 2 }} onClick={addFirstWorkPlace}>
                    ثبت
                  </Button>
                }
                
              </DialogActions>
      </Dialog>
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
                  <IconifyIcon icon={"mdi:tab-add"} fontSize='2rem' />
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='senfCode'
                      control={control}
                      render={({ field: { onBlur } }) => (
                        <TextField
                          autoFocus
                          label='شناسه صنفی'
                          value={newJob.senfCode}
                          onBlur={onBlur}
                          onChange={(e) => setNewJob({...newJob , senfCode : e.target.value})}
                          placeholder=''
                        />
                      )}
                    />
                  </FormControl>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='workPlace'
                      control={control}
                      render={({ field: { onBlur } }) => (
                        <TextField
                          autoFocus
                          label='نام واحد صنفی'
                          value={newJob.workPlace}
                          onBlur={onBlur}
                          onChange={(e) => setNewJob({...newJob , workPlace : e.target.value})}
                          placeholder=''
                        />
                      )}
                    />
                  </FormControl>
                    <Autocomplete
                      options={['مباشر' , 'مدیر' , 'کارمند' , 'کارگر']}
                      getOptionLabel={(option: any) => option}
                      value={newJob.position}
                      style={{marginBottom : "20px" , width : '200px'}}
                      onChange={(e, newValue) => setNewJob({...newJob , position : newValue as any})}
                      renderInput={(params) => <TextField dir='rtl' {...params} label={'سمت'} variant="filled" />}
                    />
                </Box>
              </DialogContent>
              {error && <p style={{color : '#ff3d3d' , textAlign : 'center'}}>{error}</p>} 
              <DialogActions
                sx={{
                  justifyContent: 'center',
                  px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
                  pb: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
                }}
              >
              
                {
                  loading ?           
                  <div style={{textAlign : 'center' , display : 'flex' , justifyContent : 'center' , margin : '-35px 0px 35px'}}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                      <CircularProgress />
                    </Box>
                  </div>
                  : <Button variant='contained' sx={{ mr: 2 }} onClick={submitWork}>
                    ثبت
                  </Button>
                }
                
              </DialogActions>
      </Dialog>
    </div>
  )
}

export default Work;
