// ** React Imports
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

import { defaultBase64, loginCredentialSchema } from 'src/constant'
import { Autocomplete, Card, CircularProgress, FormControl } from '@mui/material'
import parseCookieString from 'src/utils/parseCookieString'
import ParseJwt from 'src/utils/ParseJwt'
import { useRouter } from 'next/router'

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

const defaultValues = {
  workPlace : ''
}

const SecondStep = () => {
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [isDataValid , setIsDataValid] = useState(false);
  const router = useRouter()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings;
  
  const [subgroupOptions , setSubgroupOptions] = useState<string[]>(['کشور' , 'استان' , 'شهر' , 'اتحادیه' , 'واحد صنفی']);
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
    role: ""
  });

  const [formData , setFormData] = useState({
    category : 'اصناف',
    subgroup : '',
    image : defaultBase64,
    identPict : '',
    workPlace : '',
  });

  useEffect(() => {
    const {jwt} =  parseCookieString(document.cookie)
    setCookieData(ParseJwt(jwt))
  }, []);

  const {
    handleSubmit,
    control
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(loginCredentialSchema)
  })

  const sendReq = async () => {
    if(!formData.category  || !formData.subgroup || !formData.workPlace) return setError('لطفا تمامی ورودی ها را پر کنید' )
    setLoading(true);
    const result = await fetch('https://api.cns365.ir/api/api.php' , {
      method: 'POST',
      body: JSON.stringify({...formData , nationalCode : cookieData.nationalCode}),
      headers: {'Content-Type': 'application/json'}
    })
    const Data = await result.json();
    
    if(Data.token){
      
        setLoading(false);
        document.cookie = `jwt = ${Data.token}; SameSite=None; Secure; Path=/; SameSite=None; Secure; Max-Age=${7 * 24 * 60 * 60}`;
        router.push('/profile')
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
              ? <img alt='img' src='/images/2.png' width={330} className='step'/>
              : <img alt='img' src='/images/2w.png' width={330} className='step'/>
              : null
            }
            </div>
            {isDataValid ?
             <>
              <Box sx={{ mb: 6 }} dir="rtl">
                <TypographyStyled variant='h5'>سامانه مدیریت هویت افراد</TypographyStyled>
                <Typography variant='body2'>لطفا با کمال صداقت موارد زیر را انتخاب کنید</Typography>
              </Box>    
                <form onSubmit={handleSubmit(sendReq)}>
                <Autocomplete
                  options={['حمل و نقل' , 'اصناف' , 'وزارت کشور']}
                  getOptionLabel={(option: any) => option}
                  value={formData.category}
                  className='comboAcc'
                  onChange={(e, newValue) => {
                    setFormData({...formData , category : newValue as string})
                    if(newValue == 'اصناف') setSubgroupOptions(['کشور' , 'استان' , 'شهر' , 'اتحادیه' , 'واحد صنفی'])
                    if(newValue == 'وزارت کشور') setSubgroupOptions([ 'واحد صنفی'])
                    if(newValue == 'حمل و نقل') setSubgroupOptions(['کشور' , 'واحد صنفی'])
                  }}
                  renderInput={(params) => <TextField {...params} label={'دسته بندی'} variant="standard" />}
                />
                <Autocomplete
                  options={subgroupOptions}
                  getOptionLabel={(option: any) => option}
                  value={formData.subgroup}
                  className='comboAcc'
                  onChange={(e, newValue) => setFormData({...formData , subgroup : newValue as string})}
                  renderInput={(params) => <TextField {...params} label={'گروه بندی'} variant="standard" />}
                />
              <FormControl fullWidth sx={{ mb: 10 }}>
                <Controller
                  control={control}
                  name='workPlace'
                  render={({ field: { onBlur } }) => (
                    <TextField
                      autoFocus
                      label='محل کار'
                      value={formData.workPlace}
                      onBlur={onBlur}
                      onChange={(e) => setFormData({...formData , workPlace : e.target.value})}
                      placeholder='‌میدان آزادی، کوچه ...' 
                      dir='rtl'
                    />
                  )}
                />
              </FormControl>
                  {error && <p style={{color : '#ff3d3d' , textAlign : 'center'}}>{error}</p>} 
                  {loading ? 
                      <div style={{textAlign : 'center' , display : 'flex' , justifyContent : 'center' , margin : '-35px 0px 35px'}}>
                        <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                          <CircularProgress/>
                        </Box>
                      </div>
                      : <Button onClick={sendReq} fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                      برو به مرحله بعد
                      </Button>
                  }
                </form>
              </>
              : <div dir='rtl'>
                  <Box sx={{ mb: 6 }} dir="rtl">
                    <TypographyStyled variant='h5'>تایید اطلاعات هویتی</TypographyStyled>
                    <Typography variant='body2'>
                        آقای <span>{cookieData.lastName} اطلاعات زیر را تایید میکنید؟</span>
                      <Button style={{marginRight : '10px !important'}} variant='outlined' color='error' size='small'>مغایرت</Button>
                    </Typography>
                  </Box>
                  <Card style={{padding : '5px 20px'}} >
                    <p>نام : <span>{cookieData.firstName}</span></p>
                    <p>نام خانوادگی : <span>{cookieData.lastName}</span></p>
                    <p>کدملی : <span>{cookieData.nationalCode}</span></p>
                    <p>نام پدر : <span>{cookieData.fatherName}</span></p>
                  </Card>
                  <div style={{display : 'flex' , justifyContent : 'center'}}>
                     <Button onClick={() => setIsDataValid(true)} color='primary' size='large' variant='contained' style={{ marginTop : '20px'}}>تایید</Button>
                  </div>
                </div>
            }

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


