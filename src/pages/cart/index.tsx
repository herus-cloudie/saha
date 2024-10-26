'use client'

import { Button, Card, Grid,  } from '@mui/material'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import Loader from 'src/@core/components/spinner/loader'

import {IdentTypeWithJwt } from 'src/context/types'
import parseCookieString from 'src/utils/parseCookieString'
import ParseJwt from 'src/utils/ParseJwt'

const Overview = () => {  
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
    province : '',
    city : '',
    senfCode : "",
    position : '',
    jwt : ""
  });


  const [mainLoader , setMainLoader] = useState(false);
  const [isMounted, setIsMounted] = useState(false)

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
      if(cookieData?.nationalCode){
      } else router.push('/nationality')
    }
  }, [isMounted, cookieData , router])
  

  if (mainLoader) {
    return <Loader />;
  }

  return (
    <div>
      <Card style={{padding : '0 30px 30px'}}>
        <Grid container spacing={6} className='match-height'>
            <Grid item xs={12}>
              <h1>صدور کارت</h1>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , justifyContent : 'space-between'}}>
                
                <Grid item xs={12} lg={6}>
                    <Grid item xs={12}>
                      <h3>جلوی کارت</h3>
                    </Grid>
                    <Grid className='codeee' item xs={12} sm={6} xl={12}>
                     <span>{cookieData.nationalCode}</span>
                    </Grid>
                    <Grid className='nameee' item xs={12} sm={6} xl={12}>
                     <span>{cookieData.firstName}</span>
                    </Grid>
                    <Grid className='lastnameee' item xs={12} sm={6} xl={12}>
                     <span>{cookieData.lastName}</span>
                    </Grid>
                    <div className='cartbg'>
                      <img width={400} src='/images/1403.08.05 asnaf cart - Copy.png'/>
                    </div>
                    <Grid className='senfff' item xs={12} sm={6} xl={12}>
                     <span>{cookieData.senfCode}</span>
                    </Grid>
                    <Grid className='positionnn' item xs={12} sm={6} xl={12}>
                     <span>{cookieData.position}</span>
                    </Grid>
                    <Grid className='provinceee' item xs={12} sm={6} xl={12}>
                    <span>{cookieData.province}</span>
                    </Grid>
                    <Grid className='cityyy' item xs={12} sm={6} xl={12}>
                     <span>{cookieData.city}</span>
                    </Grid>
                    {/* <Grid item xs={12} sm={6} xl={12}>
                    <span>{cookieData.subgroup}</span>
                    </Grid> */}
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Grid item xs={12}>
                    <h3>پشت کارت</h3>
                    </Grid>
                    <div className='cartbg'>
                      <img style={{marginTop : "50px"}} width={400} src='/images/1403.08.05 asnaf cart.png'/>
                    </div>
                </Grid>
              </Card>
            </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default Overview;
