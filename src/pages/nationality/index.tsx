// ** React Imports
import { useState, ReactNode } from 'react'

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
import { useRouter } from 'next/navigation'
import { Autocomplete } from '@mui/material'

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

  const { skin } = settings

  const [nationality , setNationality] = useState<'ایران' | 'اتباع'>('ایران');

  const sendReq = () => {
    if(nationality == 'ایران') return router.push('/iran')
    else router.push('/foreign') 
  }

  return (
    <div dir="ltr">
      <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
          <LoginIllustrationWrapper>
            <LoginIllustration
              alt='login-illustration'
              src={`/images/1.png`}
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
              
              <Typography variant='h6' sx={{ ml: 2, lineHeight: 1, fontWeight: 700, fontSize: '1.5rem !important' }}>
                مها
              </Typography>
              {
                theme.palette.mode == 'light' 
                ? <img alt='fadls' src='/images/logos/blue.png' width={35} style={{marginRight : '10px'}}/>
                : <img alt='fadls' src='/images/logos/white.png' width={35} style={{marginRight : '10px'}}/>
              }

            </Box>
            <div style={{display : 'flex' , justifyContent : 'center' , justifyItems : 'center'}}>
            {
              hidden ? 
              theme.palette.mode == 'light' 
              ? <img alt='fadls' src='/images/1.png' width={330} className='step'/>
              : <img alt='fadls' src='/images/1w.png' width={330} className='step'/>
              : null
            }
            </div>

            <Box sx={{ mb: 6 }} dir="rtl">
              <TypographyStyled variant='h5'>{`به مها خوش آمدید 👋🏻`}</TypographyStyled>
              <Typography variant='body2'>سامانه مدیریت هویت افراد</Typography>
            </Box>
            <Autocomplete
                options={['ایران' , 'اتباع']}
                getOptionLabel={(option: any) => option}
                value={nationality}
                className='comboAcc'
                onChange={(e, newValue : any) => setNationality(newValue)}
                renderInput={(params) => <TextField {...params} label={'ملیت'} variant="standard" />}
            />
            <Button onClick={sendReq} fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                تکمیل اطلاعات
            </Button>
              
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

