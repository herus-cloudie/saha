// ** React Imports
import { useState, ReactNode, MouseEvent } from 'react'

// ** Next Imports
import Link from 'next/link'
import { signIn } from "next-auth/react"

// ** MUI Components
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useRouter } from 'next/navigation'
import Loader from 'src/@core/components/spinner/loader'
import { loginCredentialSchema } from 'src/constant'
import DatePickerFunc from 'src/components/datePicker'

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

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}));

const defaultValues = {
  nationalCode: '',
  phoneNumber: '',
}

interface FormData {
  phoneNumber: string
  nationalCode: string
}

const LoginPage = () => {
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');

  // ** Hooks
  const router = useRouter()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(loginCredentialSchema)
  })

  const [formData , setFormData] = useState({
      birthDate: new Date(),
      nationalCode: '',
      phoneNumber: '',
  });

  const sendReq = async () => {
    // console.log(toString(new Date(formData.birthDate).toLocaleDateString("fa-IR").))
    const result = await fetch('https://api.zibal.ir/v1/facility/shahkarInquiry/' , {
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Bearer 9361a1e1fbd64b8e87cf98abb6b665d3'
      },
      body: new URLSearchParams({mobile : formData.phoneNumber , nationalCode : formData.nationalCode})
    })
    const Data = await result.json();

    if(Data.result == 1){
      const req2 = await fetch('https://api.zibal.ir/v1/facility/nationalIdentityInquiry/' , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer 9361a1e1fbd64b8e87cf98abb6b665d3'
        },
        body: new URLSearchParams({birthDate : "1385/06/03" , nationalCode : formData.nationalCode})
      })
      const tt = await req2.json();
      console.log(tt)
    }
    // setLoading(false)
    // if(result?.error == 'User does not exist') setError('.اکانتی با این شناسه وجود ندارد')
    // else if(result?.error == 'nationalCode is incorrect') setError('.پسورد اشتباه است')
    // else if(result?.ok) {
    //   setError('')
    //   router.push('/dashboards/main')
    // }
  }

  const ChangeDateHandler = (e : any) => {
    let date = new Date(e);
    setFormData({...formData , birthDate : date})
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
                سها
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
            <form onSubmit={handleSubmit(sendReq)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='nationalCode'
                  control={control}
                  render={({ field: { value, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='کدملی'
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
                  render={({ field: { value, onBlur } }) => (
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
              <DatePickerFunc value={formData.birthDate} ChangeDateHandler={ChangeDateHandler}/> 
             
              {error && <p style={{color : '#ff3d3d' , textAlign : 'center'}}>{error}</p>} 
              {loading ? 
                  <div style={{textAlign : 'center' , display : 'flex' , justifyContent : 'center' , margin : '-35px 0px 35px'}}>
                    <Loader />
                  </div>
                  : <Button  fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                   برو به مرحله بعد
                  </Button>}
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Button onClick={sendReq}>
                  fdsafdsa
                </Button>
              </Box>
            </form>
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

