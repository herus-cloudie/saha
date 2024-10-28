'use client'

import { useState, ReactNode, useEffect } from 'react'

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'


// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'

import {loginCredentialSchema } from 'src/constant'
import {Card, CircularProgress, FormControl } from '@mui/material'
import parseCookieString from 'src/utils/parseCookieString'
import ParseJwt from 'src/utils/ParseJwt'
import { useRouter } from 'next/router'
import Loader from 'src/@core/components/spinner/loader'

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const LoginIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))


const SecondStep = () => {

  const {
    control,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(loginCredentialSchema)
  })

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true)
  }, [])


  const router = useRouter()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings;
  const [cookieData , setCookieData] = useState({
    alive: 1,
    birthDate: '',
    fatherName: "",
    firstName: "",
    id: '',
    isDead: 0,
    lastName: "",
    matched: 1,
    nationalCode: "",
    nationality: "",
    officiality: 'دارای شناسه اتباع',
    phoneNumber: "",
    role: "",
    position : '',
    senfCode : '',
    city : '',
    province : '',
    subgroup : '',
    category : '',
  });
  const [OTP , setOTP] = useState<any>();

  const [mainLoader , setMainLoader] = useState(false);
  const [loading , setLoading] = useState(false);
  const [isOTPVerified , setIsOTPVerified] = useState(false);
  const [error , setError] = useState<string>('');

  useEffect(() => {
    if (isMounted) {
      console.log(cookieData)
      if(cookieData?.nationalCode){
        async function sendOTP() {
          const sendReq = await fetch('https://api.cns365.ir/api/send_otp.php' , {
          method : 'POST',
          body : JSON.stringify({phone_number: cookieData.phoneNumber}),
          headers: {'Content-Type': 'application/json'},
        })
        const result = await sendReq.json();
        console.log(result)
        }
        sendOTP()
      } else router.push('/nationality')
    }
  }, [isMounted, cookieData , router])

  useEffect(() => {
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
  
  if (mainLoader) {
    return <Loader />
  }

  const compareOTP = async () => {
    setLoading(true)
    const sendReq = await fetch('https://api.cns365.ir/api/verify_otp.php' , {
      method : 'POST',
      body : JSON.stringify({ phone_number: cookieData.phoneNumber, otp_code: OTP}),
      headers: {'Content-Type': 'application/json'},
    })
    const result = await sendReq.json();
    if(result.success) {
      setIsOTPVerified(true)
      setLoading(false)
      setError('')
    }
    setError('کد وارد شده نامعتیر است')
    setLoading(false)
    console.log(result)
  }

  return ( 
    <div dir="ltr">
      <Box className='content-right'>
    {!hidden ? (
      <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
        <LoginIllustrationWrapper>
          <LoginIllustration
            alt='/images/step2.png'
            src={`/images/step3.png`}
            width={500}
          />
        </LoginIllustrationWrapper>
        <FooterIllustrationsV2 />
      </Box>
    ) : null}
    <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
      <Box
        sx={{
          p: 7,
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.paper'
        }}
      >
        <BoxWrapper>
          <Box
            sx={{
              top: 30,
              left: 40,
              display: 'flex',
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            
            {
              theme.palette.mode == 'light' 
              ? <img alt='image' src='/images/kop.png' width={150} style={{marginRight : '10px'}}/>
              : <img  alt='image' src='/images/kop.png' width={150} style={{marginRight : '10px' , filter : 'invert(1)'}}/>
            }
            
          </Box>
          <div style={{display : 'flex' , justifyContent : 'center' , justifyItems : 'center'}}>
          {
            hidden 
            ?  <img alt='img' src='/images/step3.png' width={330} className='step'/>
            : null
          }
          </div>
          <div dir='rtl'>
            {
              isOTPVerified ? 
              <>
                <Box sx={{ mb: 6 }} dir="rtl">
                  <TypographyStyled variant='h5'>تایید اطلاعات هویتی</TypographyStyled>
                  <Typography variant='body2' style={{display : 'flex' , alignItems : 'center'}}>
                      <div style={{marginLeft : '10px'}}>
                        آقای <span>{cookieData.lastName} اطلاعات زیر را تایید میکنید؟</span>
                      </div>
                  </Typography>
                </Box>
                <Card style={{padding : '5px 20px'}} >
                  <p>نام : <span>{cookieData.firstName}</span></p>
                  <p>نام خانوادگی : <span>{cookieData.lastName}</span></p>
                  <p>کدملی : <span>{cookieData.nationalCode}</span></p>
                  <p>نام پدر : <span>{cookieData.fatherName}</span></p>
                  <p>اتحادیه :<span> {cookieData.category}</span></p>
                  <p>رسته : <span>{cookieData.subgroup}</span></p>
                  <p>سمت : <span>{cookieData.position}</span></p>
                  <p>کدصنفی : <span>{cookieData.senfCode}</span></p>
                </Card>
                <div style={{display : 'flex' , justifyContent : 'center'}}>
                  <Button onClick={() => router.push('/overview')} color='primary' size='large' variant='contained' style={{ marginTop : '20px'}}>تایید</Button>
                </div>
              </>
              : <Card style={{padding : '20px' , marginTop : '20px'}}>
                  <Box sx={{ mb: 6 }} dir="rtl">
                    <TypographyStyled variant='h6'>کد ارسال شده به گوشی خود را وارد کنید</TypographyStyled>
                     <Typography variant='body2' style={{display : 'flex' , alignItems : 'center'}}>
                    </Typography>
                  </Box>
                  <FormControl fullWidth sx={{ mb: 4 }}>
                    <Controller
                      name='nationalCode'
                      control={control}
                      render={({ field: { onBlur } }) => (
                        <TextField
                          autoFocus
                          label='کد تایید'
                          value={OTP}
                          onBlur={onBlur}
                          onChange={(e) => setOTP(e.target.value)}
                          placeholder='شش زقم'
                        />
                      )}
                    />
                  </FormControl>
                  {error && <p style={{color : '#ff3d3d' , textAlign : 'center'}}>{error}</p>} 
                  {
                    loading ?            
                    <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                      <CircularProgress />
                    </Box>
                    : <div style={{display : 'flex' , justifyContent : 'center'}}>
                        <Button onClick={compareOTP} color='primary' size='large' variant='contained' style={{ marginTop : '20px'}}>تایید</Button>
                      </div>
                  
                  }
              </Card>

            }
          </div>
        </BoxWrapper>
      </Box>
    </RightWrapper>
      </Box>
    </div>
    
  )
}

SecondStep.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

SecondStep.guestGuard = true

export default SecondStep


