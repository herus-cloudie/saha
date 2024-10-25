'use client'

import { Button, Card, Grid } from '@mui/material'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import IconifyIcon from 'src/@core/components/icon'
import Loader from 'src/@core/components/spinner/loader'

import {IdentTypeWithJwt } from 'src/context/types'
import parseCookieString from 'src/utils/parseCookieString'
import ParseJwt from 'src/utils/ParseJwt'

const Work = () => {  
  const router = useRouter();

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
    senfCode : "",
    position : '',
    jwt : ""
  });

  const [userData, setUserData] = useState<IdentTypeWithJwt | null>(null)
  const [mainLoader , setMainLoader] = useState(false);
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fillJwt = async () => {
      const { jwt } = parseCookieString(document.cookie)
      if (jwt) {
        const parsedData = ParseJwt(jwt)
        setUserData(parsedData)
        setCookieData(parsedData)
      }
      setMainLoader(false) 
    }
    fillJwt()
  }, []);
  

  useEffect(() => {
    if (isMounted) {
      if(userData?.nationalCode){
      } else router.push('/nationality')
    }
  }, [isMounted, userData , cookieData , router])

  if (mainLoader) {
    return <Loader />;
  }

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
                محل کار : {cookieData.workPlace ? cookieData.nationalCode : <Button sx={{mr : 2}} color='warning' size='small' variant='outlined'>تکمیل</Button>  }
                </Grid>
                <Grid item xs={12} sm={6} xl={12}>
                اتحادیه : <span>{cookieData.category}</span>
                </Grid>
                <Grid item xs={12} sm={6} xl={12}>
                رسته : <span>{cookieData.subgroup}</span>
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , flexDirection : "column"}}>
                <div style={{display : 'flex' , cursor : 'pointer',flexDirection : 'column' , justifyContent : 'center' , alignItems : 'center' , marginTop : '30rem0px'}}>
                  <h2>افزودن شغل</h2>
                  <IconifyIcon width={80} icon={"mdi:tab-add"}></IconifyIcon>
                </div>
              </Card>
            </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default Work;
