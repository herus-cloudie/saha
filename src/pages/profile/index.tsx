import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IdentTypeWithJwt } from 'src/context/types'
import parseCookieString from 'src/utils/parseCookieString'
import ParseJwt from 'src/utils/ParseJwt'

const Profile = () => {
  const [userData , setUserData ] = useState<IdentTypeWithJwt>({
    id: '',
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
    identPict : "",
    isDead : 0,
    matched : 1,
    alive : 1,
    role : "user",
    jwt : ''
  })


  useEffect(() => {
    const {jwt} =  parseCookieString(document.cookie)
    setUserData(ParseJwt(jwt))
  }, []);

  return (
    <div>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
          <h1>نمایه</h1>
        </Grid>
        
        <Grid item xs={12} sm={6} xl={2.4}>
         نام : <span>{userData.firstName}</span>
        </Grid>
        <Grid item xs={12} sm={6} xl={2.4}>
         نام خانوادگی : <span>{userData.lastName}</span>
        </Grid>
        <Grid item xs={12} sm={6} xl={2.4}>
        نام پدر : <span>{userData.fatherName}</span>
        </Grid>
        <Grid item xs={12} sm={6} xl={2.4}>
        تاریخ تولد : <span>{userData.birthDate as string}</span>
        </Grid>
        <Grid item xs={12} sm={6} xl={2.4}>
         ملیت : <span>{userData.nationality}</span>
        </Grid>
        <Grid item xs={12} sm={6} xl={2.4}>
         محل کار: <span>{userData.workPlace}</span>
        </Grid>
        <Grid item xs={12} sm={6} xl={2.4}>
        شماره تماس : <span>{userData.phoneNumber}</span>
        </Grid>
        <Grid item xs={12} sm={6} xl={2.4}>
        سمت : <span>{userData.role == 'user' ? 'کارمند' : 'مدیر'}</span>
        </Grid>
        <Grid item xs={12} sm={6} xl={2.4}>
        زیرگروه : <span>{userData.subgroup}</span>
        </Grid>
      </Grid>
    </div>
  )
}

export default Profile