'use client'

import { Button, Card, Grid,  } from '@mui/material'

import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Loader from 'src/@core/components/spinner/loader'

import {IdentTypeWithJwt } from 'src/context/types'
import parseCookieString from 'src/utils/parseCookieString'
import ParseJwt from 'src/utils/ParseJwt'

interface WorksType {
  senf_code: string,
  position: string,
  workplace: string,
  category: string,
  subgroup: string,
  city: string,
  province: string

}
const Overview = () => {  
  const router = useRouter();
  
  const [allAdditional, setAllAdditional] = useState<WorksType[]>([]);
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

  const getSecondJob = async () => {
    try {
      const response = await fetch('https://api.cns365.ir/api/secondw.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalCode: cookieData.nationalCode })
      });
      const data = await response.json();

      if (data.success) {
        setAllAdditional(data.workplaces);
      }
    } catch (err) {
      console.error("Error fetching second job:", err);
    } finally {
      setMainLoader(false);
    }
  };
  const [mainLoader , setMainLoader] = useState(true);
  const [isMounted, setIsMounted] = useState(false)
  const [QRUrl, setQRUrl] = useState();
  const [mainWorkIndex, setMainWorkIndex] = useState(0);
  const [profileUrl, setProfileUrl] = useState();

  useEffect(() => {
    setIsMounted(true)
    const fillJwt = async () => {
      const { jwt , mainWork, profileImage} = parseCookieString(document.cookie)
      console.log(profileImage)
      if (jwt) {
        const parsedData = ParseJwt(jwt);
        mainWork ? setMainWorkIndex(mainWork) : setMainWorkIndex(0); 
        
        setCookieData(parsedData);
        setProfileUrl(profileImage);
      }
      setMainLoader(false) 
    }
    fillJwt()
  }, []);
  

  useEffect(() => {
    if (isMounted) {
      getSecondJob()
      if(!cookieData?.nationalCode) router.push('/nationality')
      
      async function getQr(){
        const sendReq = await fetch('https://api.cns365.ir/api/qr.php' , {
          method : 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ nationalCode: cookieData.nationalCode})
        })
        const Data = await sendReq.json();
        if(Data.qrCodeUrl){
          setQRUrl(Data.qrCodeUrl)
        }
      }
      getQr()
    }
  }, [isMounted, cookieData , router])
  

  if (mainLoader) {
    return <Loader />;
  }

  const allJobs = [{senf_code : cookieData.senfCode , position : cookieData.position, subgroup : cookieData.subgroup,
  workplace : cookieData.workPlace , category : cookieData.category , city : cookieData.city , province : cookieData.province }
   , ...allAdditional];
   console.log(allJobs[+mainWorkIndex])

  const selectedData = allJobs[+mainWorkIndex]
  console.log(selectedData)

  return (
    <div>
      {
        profileUrl != undefined ?  
      <Card style={{padding : '0 30px 30px'}}>
        <Grid container spacing={6} className='match-height'>
            <Grid item xs={12}>
              <h1>صدور کارت</h1>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{padding : '0 20px 10px 20px' , display : 'flex' , gap : '10px' , justifyContent : 'space-between'}}>
                <Grid container spacing={6}>
                  <Grid item xs={12} lg={6}>
                      <Grid item xs={12}>
                        <h3 style={{marginBottom : '-100px'}}>جلوی کارت</h3>
                      </Grid>
                      <img className='profileee' src={profileUrl} width={70}/>
                      <Grid className='codeee' item xs={12} sm={6} xl={12}>
                      <span>{cookieData.nationalCode}</span>
                      </Grid>
                      <Grid className='nameee' item xs={12} sm={6} xl={12}>
                      <span>{cookieData.firstName}</span>
                      </Grid>
                      <Grid className='lastnameee' item xs={12} sm={6} xl={12}>
                        
                      <span>{cookieData.lastName}</span>
                      </Grid>
                      <div className='cartbg' >
                        <img width={400} style={{border : '1px solid #d6d6d6', borderRadius : "10px"}} src='/images/IMG-20241027-WA0007.jpg'/>
                      </div>
                      <Grid className='senfff' item xs={12} sm={6} xl={12}>
                      <span>{selectedData?.senf_code}</span>
                      </Grid>
                      <Grid className='positionnn' item xs={12} sm={6} xl={12}>
                      <span>{selectedData?.position} واحد صنفی</span>
                      </Grid>
                      <Grid className='cityyy' item xs={12} sm={6} xl={12}>
                      <span>{selectedData?.city}</span>
                      </Grid>
                      <Grid className='timeee' item xs={12} sm={6} xl={12}>
                      <span>{new Date().toLocaleDateString("fa-IR")}</span>
                      </Grid>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                      <Grid item xs={12}>
                      <h3 style={{marginBottom : '-100px'}}>پشت کارت</h3>
                      </Grid>
                      <div className='cartbg' style={{marginTop : '120px'}}>
                        <img style={{position : 'relative' , bottom : '25px' , left : '-380px' }} width={60} src={QRUrl}/>
                        <img style={{marginTop : "50px" , borderRadius : "10px"}} width={400} src='/images/IMG-20241027-WA0009.jpg'/>
                      </div>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
        </Grid>
      </Card>
      : <Card style={{padding : '0 30px 30px'}}>
      <Grid container spacing={6} className='match-height'>
          <Grid item xs={12}>
            <h1>صدور کارت</h1>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{padding : '100px' , display : 'flex' , gap : '10px' , justifyContent : 'space-between'}}>
              <Grid style={{display : 'flex' , justifyContent : 'center' , alignItems : 'center' , flexDirection : 'column'}} container spacing={6}>
                <h3>لطفا برای صدور کارت ابتدا عکس پروفایل خود را بارگذاری کنید</h3>
                <Button onClick={() => router.push('/profile')} variant='contained' size='large'>برو به اطلاعات کاربری</Button>
              </Grid>
            </Card>
          </Grid>
      </Grid>
    </Card>
      }

    </div>
  )
}

export default Overview;
