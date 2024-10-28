// ** React Imports
import { useState, ReactNode, useEffect } from 'react'

// ** MUI Components
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'


// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useRouter } from 'next/router'
import { Autocomplete } from '@mui/material'
import { IdentTypeWithJwt } from 'src/context/types'
import parseCookieString from 'src/utils/parseCookieString'
import ParseJwt from 'src/utils/ParseJwt'
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

const LoginPage = () => {
  
  const router = useRouter()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const { skin } = settings;

  const [nationality, setNationality] = useState<'ایران' | 'اتباع'>('ایران')
  const [userData, setUserData] = useState<IdentTypeWithJwt | null>(null)
  const [loading, setLoading] = useState(true);
  const [signMethod, showSignMethod] = useState(false);

  useEffect(() => {
    const fillJwt = async () => {
      const { jwt } = parseCookieString(document.cookie)
      if (jwt) {
        const parsedData = ParseJwt(jwt)
        setUserData(parsedData)
      }
      setLoading(false) 
    }
    fillJwt()
  }, [])

  const sendReq = () => {
    if (nationality === 'ایران') {
      router.push('/iran')
    } else {
      router.push('/foreign')
    }
  }
  const sendReq2 = () => {
    if (nationality === 'ایران') {
      router.push('/iran2')
    } else {
      router.push('/foreign')
    }
  }

  if (loading) {
    return <Loader />
  }

  if(userData?.nationalCode){
    if(userData?.senfCode){
      router.push('/overview')
    }else router.push('/second-step')
  }

  return (
    <div dir="ltr">
      <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <LoginIllustrationWrapper>
            <LoginIllustration
              alt='login-illustration'
              src={`/images/step1.png`}
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
            ?  <img alt='img' src='/images/step2.png' width={330} className='step'/>
            : null
          }
            </div>

            <Box sx={{ mb: 6 }} dir="rtl">
              <TypographyStyled variant='h5'>{`به اتاق اصناف ایران خوش آمدید`}</TypographyStyled>
              <Typography variant='body2'>سامانه هوشمند صدور کارت شناسایی شاغلین واحدین صنفی</Typography>
            </Box>
            {
              signMethod ? 
              <>
              
                <div>
                  <h3 style={{textAlign : 'end' , marginTop : '50px'}}>روش ورود به سامانه را انتخاب کنید</h3>
                  <div style={{display: 'flex' , justifyContent : 'space-around'}}>
                    <Button onClick={sendReq} size='large' variant='contained'>
                      ثبت نام
                    </Button>
                    <Button onClick={sendReq2} size='large' variant='contained'>
                      ورود
                    </Button>
                  </div>
                </div>
              </>

              :
              <>
                <Autocomplete
                    options={['ایران' , 'اتباع']}
                    getOptionLabel={(option: any) => option}
                    value={nationality}
                    className='comboAcc'
                    onChange={(e, newValue : any) => setNationality(newValue)}
                    renderInput={(params) => <TextField {...params} label={'ملیت'} variant="standard" />}
                />
                <Button onClick={() => showSignMethod(true)} fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                    تکمیل اطلاعات
                </Button>
              </>
            }
            

              
          </BoxWrapper>
        </Box>
      </RightWrapper>
      </Box>
    </div>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage

