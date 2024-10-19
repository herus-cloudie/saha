import { Button, Card, CircularProgress, Divider, Grid, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import { IdentTypeWithJwt } from 'src/context/types'
import parseCookieString from 'src/utils/parseCookieString'
import ParseJwt from 'src/utils/ParseJwt'

interface UserProfile {
  id: number;
  national_code: string;
  first_name: string;
  father_name: string;
  last_name: string;
  birth_date: string;
  phone_number: string;
  officiality: string;
  is_dead: number;
  matched: number;
  alive: number;
  role: string;
  password: string | null;
  jwt_token: string | null;
  work_place: string;
  nationality: string;
  category: string | null;
  subgroup: string | null;
  image: string | null;
  ident_pict: string | null;
  created_at: string;
  status: string;
  address: string;
  postal_code: string;
}

const Accepted = () => {  
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

  const [acceptedList , setAcceptedList] = useState<UserProfile[]>([])

  useEffect(() => {
    const getAcceptedUsers = async () => {
      setLoading(true)
      const sendPostal = await fetch('https://api.cns365.ir/api/acceptlist.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({role: 'shop' , national_code: userData.nationalCode})
      });
      const Data = await sendPostal.json();
      setAcceptedList(Data.users);
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
      {
        loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        ) : (
          <Card sx={{ padding: '30px' }}>
            <Typography variant="h4" gutterBottom>
              کارکنان تایید شده توسط شما
            </Typography>
            <Grid container spacing={3}>
              {acceptedList.map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Card sx={{ padding: '20px' , margin : ' 10px', backgroundColor: '#f9f9f9' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>نام:</strong> {item.first_name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>نام خانوادگی:</strong> {item.last_name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>نام پدر:</strong> {item.father_name}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>کد ملی:</strong> {item.national_code}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>تاریخ تولد:</strong> {item.birth_date}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>ملیت:</strong> {item.nationality}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>محل کار:</strong> {item.work_place}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>شماره تماس:</strong> {item.phone_number}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>سمت:</strong> {item.role === 'user' ? 'کارمند' : 'مدیر'}</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body1"><strong>زیرگروه:</strong> {item.subgroup || 'ندارد'}</Typography>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Card>
        )
      }
    </div>
  )
}

export default Accepted;
