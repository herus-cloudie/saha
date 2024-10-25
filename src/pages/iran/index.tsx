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
import DatePickerFunc from 'src/components/datePicker'
import convertPersianDateToLatin from 'src/utils/dateConverter'
import { IdentTypeWithJwt, IranType } from 'src/context/types'
import { Autocomplete, CircularProgress } from '@mui/material'
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


const Iran = () => {
  
  const [loading, setLoading] = useState<boolean>(false);
  const [mainLoader , setMainLoader] = useState(false)
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
  const [userData, setUserData] = useState<IdentTypeWithJwt | null>(null)
  
  const [formData , setFormData] = useState<IranType>({
    senfCode : '',
    position : 'کارگر',
    nationalCode: '',
    phoneNumber : '',
    nationality : 'ایرانی',
    officiality : 'دارای شناسه اتباع',
    birthDate : new Date()
  });

  useEffect(() => {
    const fillJwt = async () => {
      const { jwt } = parseCookieString(document.cookie)
      if (jwt) {
        const parsedData = ParseJwt(jwt)
        setUserData(parsedData)
      }
      setMainLoader(false) 
    }
    fillJwt()
  }, [])

  if (mainLoader) {
    return <Loader />
  }

  if(userData?.nationalCode){
    if(userData?.workPlace){
      router.push('/profile')
    }else router.push('/second-step')
  }

  const sendReq = async () => {
    if(!formData.senfCode) return setError('کد صنفی را وارد کنید')
    if(formData.senfCode.length != 10) return setError('کد صنفی حداقل و حداکثر 10 رقم میباشد')
    if(!formData.position) return setError('سمت را وارد کنید')
    setLoading(true)
    setError('');

    // first request, senf data
    const result = await fetch('https://api.cns365.ir/api/senf.php' , {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"senfCode": formData.senfCode})
    })
    const Data = await result.json();
    if(!Data.error){
        // second request, send mobile and nationalCode to shahcar endpoint.
      const result1 = await fetch('https://api.zibal.ir/v1/facility/shahkarInquiry/' , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer 9361a1e1fbd64b8e87cf98abb6b665d3'
            },
            body: new URLSearchParams({mobile : formData.phoneNumber , nationalCode : formData.nationalCode})
      })
      const Data1 = await result1.json();
    
      // third request, send birthDate and nationalCode to shahcar endpoint.
      if(Data1.result == 1 && Data1.data.matched){
        const result2 = await fetch('https://api.zibal.ir/v1/facility/nationalIdentityInquiry/' , {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Authorization': 'Bearer 9361a1e1fbd64b8e87cf98abb6b665d3'
          },
          body: new URLSearchParams({birthDate : formData.birthDate as any , nationalCode : formData.nationalCode})
        })
        const Data2 = await result2.json();

        console.log(Data2)

        if(Data2.result == 6) {
          setLoading(false)
          return setError('اطلاعات وارد شده همخوانی ندارند')

        } else {
          const result3 = await fetch('https://api.cns365.ir/api/api.php' , {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({...formData , 
              firstName : Data2.data.firstName,
              lastName : Data2.data.lastName,
              isDead : Data2.data.isDead,
              alive : Data2.data.alive,
              fatherName : Data2.data.fatherName,
              matched : Data2.data.matched,
              nationalCode : Data2.data.nationalCode,
              senfCode : Data.senf_code,
              city : Data.city,
              province : Data.province,
              subgroup : Data.subgroup,
              position : formData.position,
              category : Data.category,
              role : 'user'
            })
          })
          setLoading(false)
          const Data3 = await result3.json();

          if(Data3.message == 'Registration successful' || Data3.message == "Login successful" || Data3.message == 'Profile updated successfully'){
            setError('')
            document.cookie = `jwt = ${Data3.token}; SameSite=None; Secure; Path=/; Max-Age=${7 * 24 * 60 * 60}`;
            router.push('/second-step');
          } else {
            setError('اطلاعات نادرست میباشد')
            return setLoading(false)
          }

        } 
      }else{
        setLoading(false)

        return setError('کدملی با شماره موبایل همخوانی ندارد')
      }
    } else {
      setLoading(false)
      return setError('کد صنفی وارد شده نامعتیر است')
    } 
  }

  const ChangeDateHandler = (e : any) => {
    const date = new Date(e);
    const stringBirthDate = convertPersianDateToLatin(new Date(date).toLocaleDateString("fa-IR"))
    setFormData({...formData , birthDate : stringBirthDate as string})
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
              ? <img alt='image' src='/images/kermanali.png' width={150} style={{marginRight : '10px'}}/>
              : <img  alt='image' src='/images/kermanali.png' width={150} style={{marginRight : '10px' , filter : 'invert(1)'}}/>
            }
            </Box>

            {/* <div style={{display : 'flex' , justifyContent : 'center' , justifyItems : 'center' , marginBottom : '10px'}}>
              <img alt='image' src='/images/step2.png' width={330} className='step'/>
            </div> */}

            <Box sx={{ mb: 6 , mt : 15 }} dir="rtl">
              <span style={{fontSize : '12px'}}>شهروند ایران</span>
              <TypographyStyled variant='h5'>{`تکمیل اطلاعات`}</TypographyStyled>
              <Typography variant='body2'>سامانه هوشمند صدور کارت شناسایی شاغلین واحدین صنفی</Typography>
            </Box>
            <form onSubmit={handleSubmit(sendReq)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='nationalCode'
                  control={control}
                  render={({ field: { onBlur } }) => (
                    <TextField
                      autoFocus
                      label='شناسه صنفی'
                      value={formData.senfCode}
                      onBlur={onBlur}
                      onChange={(e) => setFormData({...formData , senfCode : e.target.value})}
                      placeholder=''
                    />
                  )}
                />
              </FormControl>
              <Autocomplete
                options={['مباشر' , 'مدیر' , 'کارمند' , 'کارگر']}
                getOptionLabel={(option: any) => option}
                value={formData.position}
                style={{marginBottom : "20px"}}
                onChange={(e, newValue) => setFormData({...formData , position : newValue as any})}
                renderInput={(params) => <TextField dir='rtl' {...params} label={'گروه بندی'} variant="filled" />}
              />
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
              <DatePickerFunc value={formData.birthDate} ChangeDateHandler={ChangeDateHandler}/> 
             
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

Iran.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Iran.guestGuard = true

export default Iran

