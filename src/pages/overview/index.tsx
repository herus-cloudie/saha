'use client'

import { Card ,Grid} from '@mui/material'

import Link from 'next/link'

import IconifyIcon from 'src/@core/components/icon'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
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
    status : '',
    jwt : ""
  });


  const [mainLoader , setMainLoader] = useState(false);
  const [isMounted, setIsMounted] = useState(false)
  
  const [identStatus, setIdentState] = useState<string>('false');
  const [profileImage, setProfileImage] = useState<any>();
  const [status , setStatus] = useState<'pending' | 'accepted' | 'declined'>();

  useEffect(() => {
    setIsMounted(true)
    const fillJwt = async () => {
        const { jwt  , identStatus , profileImage} = parseCookieString(document.cookie)
        if (jwt) {
            const parsedData = ParseJwt(jwt)
            setCookieData(parsedData)
            setIdentState(identStatus)
            setProfileImage(profileImage)
        }
      setMainLoader(false) 
    }
    fillJwt()
  }, []);
  
  const [isAdditionalProfileComplete, setIsAdditionalProfileComplete] = useState<null | boolean>(null);
  const [isAdditionalWorkComplete, setIsAdditionalWorkComplete] = useState<null | boolean>(null);
  
  useEffect(() => {
    if (isMounted) { 
        async function getStatus(){
            const sendReq = await fetch('https://api.cns365.ir/api/stus.php' , {
              method : 'POST',
              headers: { 'Content-Type': 'application/json'},
              body: JSON.stringify({ nationalCode: cookieData.nationalCode})
            })
            const Data = await sendReq.json();
            setStatus(Data.status)
            console.log(Data)
        }
        getStatus()
        setIsAdditionalProfileComplete(!(!identStatus) && !(!profileImage) && !(!cookieData.address))
        setIsAdditionalWorkComplete(!(!cookieData.workPlace))
      if(!cookieData?.nationalCode) router.push('/nationality')
    }
  }, [isMounted, cookieData  , router])
  
  if (mainLoader) {
    return <Loader />;
  }

  return (
    <div>
      <Card style={{padding : '0 30px 30px'}}>
        <Grid container spacing={6} className='match-height'>
            <Grid item xs={12}>
                <h1>وضعیت پیشرفت</h1>
            </Grid>
            <Grid item xs={12} md={4} style={{cursor : 'pointer'}}>
                <Link style={{textDecoration : 'none !important'}}  href={'/profile'}>
                <Card style={!isAdditionalProfileComplete ? {backgroundColor : '#ffdfa4'} : {backgroundColor : '#00ff072e'}} sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , flexDirection : "column"}}>
                        <Grid style={{display : 'flex' , justifyContent : "space-around" , alignItems : 'center'  }} item xs={12}>
                            <h2>1</h2>
                            <IconifyIcon icon={'mdi:check-circle-outline'} color={isAdditionalProfileComplete ?'green' : 'orange'} fontSize='2.5rem' />
                        </Grid>
                        <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                            <h5>وضعیت : {isAdditionalProfileComplete ? 'تکمیل' : 'نیاز به تکمیل'}</h5>
                        </Grid>
                        <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                            <h3>تکمیل اطلاعات کاربری</h3>
                        </Grid>
                    </Card>
                </Link>
            </Grid>
            <Grid item xs={12} md={4} style={{cursor : 'pointer' , textDecoration : 'none !important'}}>
                <Link style={{textDecoration : 'none !important'}} href={'/work'}>
                    <Card style={{backgroundColor : '#00ff072e'}} sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , flexDirection : "column"}}>
                        <Grid style={{display : 'flex' , justifyContent : "space-around" , alignItems : 'center'  }} item xs={12}>
                            <h2>2</h2>
                            <IconifyIcon icon={'mdi:check-circle-outline'} color='green' fontSize='2.5rem' />  
                        </Grid>
                        <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                            <h5>وضعیت : {isAdditionalWorkComplete ? 'تکمیل' : 'نیاز به تکمیل'}</h5>
                        </Grid>
                        <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                            <h3>تکمیل اطلاعات کاری</h3>
                        </Grid>
                    </Card>
                </Link>
            </Grid>
            <Grid item xs={12} md={4}>
            <Card  style={status == 'accepted' ? {filter : 'none' , backgroundColor : '#00ff072e'}  : {filter : 'none'}} sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , flexDirection : "column" }}>
                    <Grid style={{display : 'flex' , justifyContent : "space-around" , alignItems : 'center'  }} item xs={12}>
                        <h2>3</h2>
                        {status == 'accepted' ? 
                        <IconifyIcon icon={'mdi:check-circle-outline'} color='green' fontSize='2.5rem' /> 
                        : status == 'pending' ? <IconifyIcon icon={'mdi:clock-outline'} fontSize='2.5rem' /> 
                        : <IconifyIcon color='red' icon={'hugeicons:multiplication-sign'} fontSize='2.5rem' /> }
                    </Grid>
                    <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                            <h5>وضعیت : {status == 'accepted' ? 'تایید شده' : status == 'pending' ?  'درحال بررسی' : 'رد شده'}</h5>
                        </Grid>
                    <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                        <h3>تایید صاحب پروانه</h3>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                <Card  style={status == 'accepted' ? {filter : 'none' , backgroundColor : '#00ff072e'}  : {filter : 'blur(1px)'}} sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , flexDirection : "column" }}>
                    <Grid style={{display : 'flex' , justifyContent : "space-around" , alignItems : 'center'  }} item xs={12}>
                        <h2>4</h2>
                        {status == 'accepted' ? <IconifyIcon icon={'mdi:check-circle-outline'} color='green' fontSize='2.5rem' /> : null} 
                    </Grid> 
                    <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                        <h5>وضعیت : {status == 'pending' ? 'درانتظار تایید' : 'تایید شده'}</h5>
                    </Grid>
                    <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                        <h3>بررسی اطلاعات توسط پلیس</h3>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card style={status == 'accepted' ? {filter : 'none' , backgroundColor : '#00ff072e'}  : {filter : 'blur(1px)'}} sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , flexDirection : "column" }}>
                    <Grid style={{display : 'flex' , justifyContent : "space-around" , alignItems : 'center'  }} item xs={12}>
                        <h2>5</h2>
                        {status == 'accepted' ? 
                        <IconifyIcon icon={'mdi:check-circle-outline'} color='green' fontSize='2.5rem' /> 
                        : null}
                    </Grid> 
                    <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                        <h5>وضعیت : {status == 'pending' ? 'درانتظار تایید' : 'افتتاح شده'}</h5>
                    </Grid>
                    <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                        <h3>افتتاح حساب بانکی</h3>
                    </Grid>
                </Card>
            </Grid>
            <Grid item xs={12} md={4}>
                 <Card style={status == 'accepted' ? {filter : 'none' , backgroundColor : '#00ff072e'}  : {filter : 'blur(1px)'}} sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , flexDirection : "column" }}>
                 <Grid style={{display : 'flex' , justifyContent : "space-around" , alignItems : 'center'  }} item xs={12}>
                        <h2>6</h2>
                        {status == 'accepted' ? 
                        <IconifyIcon icon={'mdi:check-circle-outline'} color='green' fontSize='2.5rem' /> 
                        : null}
                    </Grid> 
                    <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                        <h5>وضعیت : {status == 'pending' ? 'درانتظار تایید' : 'صادر شده'}</h5>
                    </Grid>
                    <Grid style={{display : 'flex' , justifyContent : "center" }} item xs={12}>
                        <h3>صدور کارت جامع</h3>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
      </Card>
      
    </div>
  )
}

export default Overview;
