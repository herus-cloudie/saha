import { Button, Card, Dialog, DialogActions, DialogContent, FormControl, Grid, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {  IdentTypeWithJwt } from 'src/context/types'
import parseCookieString from 'src/utils/parseCookieString'
import ParseJwt from 'src/utils/ParseJwt'



const Waiting = () => {  
  const [loading , setLoading] = useState<boolean>(false);
  const [userData , setUserData ] = useState<IdentTypeWithJwt>({
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
    jwt : ""
  });

  useEffect(() => {

    const getAcceptedUsers = async () => {
      setLoading(true)
      const sendPostal = await fetch('https://api.cns365.ir/api/correct.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({role: 'shop' , national_code: userData.nationalCode})
      });
      const Data = await sendPostal.json();
      console.log(Data)
      setLoading(false)
    }

    if(userData.nationalCode) getAcceptedUsers();
  }, [userData.nationalCode])



  useEffect(() => {
    const {jwt} =  parseCookieString(document.cookie)
    setUserData(ParseJwt(jwt))
  }, [userData.jwt]);
  
  return (
    <div>
      <Card style={{padding : '0 30px 30px'}}>
        <Grid container spacing={6} className='match-height'>
            <Grid item xs={12}>
              <h1>کارکنان در انتظار تایید </h1>
            </Grid>
            <Grid item xs={12} sm={6} xl={2.4}>
            نام : <span>{userData.firstName}</span>
            </Grid>
        </Grid>
      </Card>
    </div>
  )
}

export default Waiting