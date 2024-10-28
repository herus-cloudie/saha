import { Button, Card, CircularProgress, Grid, Typography } from '@mui/material'
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
    senfCode : '',
    status : '',
    jwt : "",
    position : '',
    province : ''
  });

  const [acceptedList , setAcceptedList] = useState<UserProfile[]>([])
  const [isListEmpty , setIsListEmpty] = useState<boolean>(true)
  
  useEffect(() => {
    const getAcceptedUsers = async () => {
      setLoading(true)
      const sendPostal = await fetch('https://api.cns365.ir/api/acceptlist.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({role: 'shop' , national_code: userData.nationalCode})
      });
      const Data = await sendPostal.json();
      if(Data.pending_users){
          setAcceptedList(Data.pending_users);
          setLoading(false)
      }
      setIsListEmpty(false)
      setLoading(false)
    }

    if(userData.nationalCode) getAcceptedUsers();
  }, [userData.nationalCode])

  useEffect(() => {
    const {jwt} =  parseCookieString(document.cookie)
    setUserData(ParseJwt(jwt))
  }, [userData.jwt]);
  
  const handleAccept = async (targetNationalCode : string) => {
    const getAcceptedReq = await fetch('https://api.cns365.ir/api/updatestatus.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        role: 'shop' ,
        national_code: userData.nationalCode ,
        target_national_code: targetNationalCode,
        status: 'accepted'
      })
    });
    const Data = await getAcceptedReq.json();
    console.log(Data)
    const newData = acceptedList.filter(item => item.national_code != targetNationalCode)
    setAcceptedList(newData)
  }

  const handleDecline = async (targetNationalCode : string) => {
    const getDeclinedReq = await fetch('https://api.cns365.ir/api/updatestatus.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        role: 'shop' ,
        national_code: userData.nationalCode ,
        target_national_code: targetNationalCode,
        status: 'declined'
      })
    });

    const Data = await getDeclinedReq.json();

    console.log(Data)
    
    const newData = acceptedList.filter(item => item.national_code != targetNationalCode)
    setAcceptedList(newData)
  }
  
  return (
    <div>
      {
        loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100px">
            <CircularProgress />
          </Box>
        ) : (
          <Card sx={{ padding: '30px' }}>
            <Typography variant="h4" marginBottom={'30px'} gutterBottom>
             کارکنان در انتظار تایید
            </Typography>
            <Grid container spacing={7}>
              {
              !isListEmpty
               ? acceptedList.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ padding: '20px' }}>
                    <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <img src={item?.image as string} width={60} style={{borderRadius : '100px'}} />
                      </Grid>
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
                        <Typography variant="body1"><strong>تاریخ تولد:</strong> {item.birth_date}</Typography>
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

                      <Grid item xs={12} sm={12} mt={2}>
                        <Box display="flex" justifyContent="start" gap={'30px'}>
                          <Button variant="contained" color="success" onClick={() => handleAccept(item.national_code)}>
                            تایید
                          </Button>
                          <Button variant="contained" color="error" onClick={() => handleDecline(item.national_code)}>
                            رد
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Card>
                </Grid>
              ))
              : 
              <div style={{display : 'flex' , justifyContent : 'center'}}>
                <h2 style={{textAlign: 'center',marginRight: '40px'}}>هنوز کارمندی جهت تایید، فرمی ارسال نکرده است</h2>
              </div>
              }
            </Grid>
          </Card>
        )
      } 
    </div>
  )
}

export default Accepted;
