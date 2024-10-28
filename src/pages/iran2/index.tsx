// ** React Imports
import { useState, ReactNode, useEffect } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useRouter } from 'next/router' 

import { loginCredentialSchema } from 'src/constant'
import { CircularProgress } from '@mui/material'
import ParseJwt from 'src/utils/ParseJwt'
import parseCookieString from 'src/utils/parseCookieString'

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


const Iran2 = () => {
  
  const [loading, setLoading] = useState<boolean>(false);  
  const [error, setError] = useState('');


  const router = useRouter()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const { skin } = settings

  const {
    handleSubmit,
    control,
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(loginCredentialSchema)
  })

  const [formData , setFormData] = useState({
    nationalCode: '',
    phoneNumber : '',
  });
  useEffect(() => {
    const fillJwt = async () => {
      const {mainWork} = parseCookieString(document.cookie)
      console.log(mainWork)
      if (!mainWork) {
        document.cookie = `mainWork = ${0}; SameSite=None; Secure; Path=/; Max-Age=${7 * 24 * 60 * 60}`;
      }
    }
    fillJwt()
  }, []);

  const sendReq = async () => {
    if(!formData.nationalCode || !formData.phoneNumber) return setError('لطفا تمامی موارد را پر کنید')
    setError('')
    setLoading(true)
    const sendLoginReq = await fetch('https://api.cns365.ir/api/login.php' , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        nationalCode : formData.nationalCode,
      })
    })
    const Data = await sendLoginReq.json();
    console.log(Data , Data.token)
    if(Data.success) {

      const JWTInObject = ParseJwt(Data.token);
      console.log(!JWTInObject.image)
      if(JWTInObject.phoneNumber == formData.phoneNumber){
        document.cookie = `jwt = ${Data.token}; SameSite=None; Secure; Path=/; Max-Age=${7 * 24 * 60 * 60}`;
        !JWTInObject.image ? document.cookie = "profileImage= ; expires=Thu, 18 Dec 2013 12:00:00 UTC; path=/"
        :  document.cookie = `profileImage = ${JWTInObject.image}; SameSite=None; Secure; Path=/; Max-Age=${7 * 24 * 60 * 60}`;

        router.push('/second-step')
      }
      else {
        setLoading(false) 
        setError(' شماره تماس شما نادرست میباشد')
      }
     
    }else{
      setError('حسابی با این کد ملی وجود ندارد') 
      setLoading(false)
    }
  }

  return (
    <div dir="ltr">
      <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <LoginIllustrationWrapper>
            <LoginIllustration
              alt='login-illustration'
              src={'/images/step2.png'}
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

            <Box sx={{ mb: 6 , mt : 15}} dir="rtl">
              <div>
                <span style={{fontSize : '12px'}}>شهروند ایران</span>
                <TypographyStyled variant='h5'>{`ورود به حساب اتاق اصناف`}</TypographyStyled>
                <Typography variant='body2'>سامانه هوشمند صدور کارت شناسایی شاغلین واحدین صنفی</Typography>
              </div>
            </Box>
            <form onSubmit={handleSubmit(sendReq)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='nationalCode'
                  control={control}
                  render={({ field: { onBlur } }) => (
                    <TextField
                      autoFocus
                      label='کد ملی'
                      value={formData.nationalCode}
                      onBlur={onBlur}
                      onChange={(e) => setFormData({...formData , nationalCode : e.target.value})}
                      placeholder='022*******'
                    />
                  )}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='phoneNumber'
                  control={control}
                  render={({ field: { onBlur } }) => (
                    <TextField
                      autoFocus
                      label='شماره موبایل'
                      value={formData.phoneNumber}
                      onBlur={onBlur}
                      onChange={(e) => setFormData({...formData , phoneNumber : e.target.value})}
                      placeholder='09*********'
                    />
                  )}
                />
              </FormControl>
             
              {error && <p style={{color : '#ff3d3d' , textAlign : 'center'}}>{error}</p>} 
              {loading ? 
                  <div style={{textAlign : 'center' , display : 'flex' , justifyContent : 'center' , margin : '-35px 0px 35px'}}>
                    <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                      <CircularProgress />
                    </Box>
                  </div>
                  : <Button onClick={sendReq} fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                   برو به مرحله بعد
                  </Button>
              }
            </form>
          </BoxWrapper>
          
        </Box>
      </RightWrapper>
      </Box>
    </div>
  )
}

Iran2.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Iran2.guestGuard = true

export default Iran2

