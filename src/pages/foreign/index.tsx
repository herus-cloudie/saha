// ** React Imports
import { useState, ReactNode } from 'react'

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
import { useRouter } from 'next/navigation'
import Loader from 'src/@core/components/spinner/loader'
import { loginCredentialSchema } from 'src/constant'
import DatePickerFunc from 'src/components/datePicker'
import convertPersianDateToLatin from 'src/utils/dateConverter'
import { Autocomplete } from '@mui/material'
import { IdentType, IdentTypeWithJwt } from 'src/context/types'

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
  firstName: '',
  fatherName: '',
  isDead: false,
  lastName: '',
  matched: true,
  alive: true,
  nationalCode: '',
  image : '',
  identPict : '',
  phoneNumber : '',
  workPlace : '',
  nationality : 'ایرانی',
  officiality : 'دارای شناسه اتباع',
  birthDate : new Date(),
  category : 'اصناف',
  role : 'user',
  subgroup : '',
  address : ''
}

const Iran = () => {
  
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
  } = useForm({
    mode: 'onBlur',
    defaultValues,
    resolver: yupResolver(loginCredentialSchema)
  })
  const [subgroupOptions , setSubgroupOptions] = useState<string[]>(['کشور' , 'استان' , 'شهر' , 'اتحادیه' , 'واحد صنفی']);

  const [formData , setFormData] = useState<IdentTypeWithJwt>({
    firstName: '',
    fatherName: '',
    isDead: false,
    lastName: '',
    matched: true,
    alive: true,
    nationalCode: '',
    image : 'https://api.cns365.ir/img/profile.png',
    identPict : 'https://api.cns365.ir/img/profile2.png',
    phoneNumber : '',
    workPlace : '',
    nationality : 'اتباع',
    officiality : 'دارای شناسه اتباع',
    birthDate : new Date(),
    category : 'اصناف',
    role : 'user',
    subgroup : '',
    postal_code : '',
    address : '',
    jwt : ''
  });

  const sendReq = async () => { 
     console.log(formData)
    if(!formData.firstName || !formData.lastName || !formData.fatherName || !formData.nationalCode || !formData.phoneNumber || !formData.workPlace || !formData.subgroup || !formData.address) return setError('تمامی بخش ها را کامل کنید')
    setError('')

    setLoading(true);
    const result = await fetch('https://api.cns365.ir/api/api.php' , {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {'Content-Type': 'application/json'}
    })
    const Data = await result.json();
    if(Data.token) {
      
      router.push('/second-step')
    }
   
    setLoading(false);
  }

  const ChangeDateHandler = (e : any) => {
    const date = new Date(e);
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
                  مها
                </Typography>
                {
                  theme.palette.mode == 'light' 
                  ? <img alt='img' src='/images/logos/blue.png' width={35} style={{marginRight : '10px'}}/>
                  : <img alt='img' src='/images/logos/white.png' width={35} style={{marginRight : '10px'}}/>
                }

              </Box>
              <div style={{display : 'flex' , justifyContent : 'center' , justifyItems : 'center'}}>
                {
                  hidden ? 
                  theme.palette.mode == 'light' 
                  ? <img alt='img' src='/images/1.png' width={330} className='step'/>
                  : <img alt='img' src='/images/1w.png' width={330} className='step'/>
                  : null
                }
              </div>

              <Box sx={{ mt: 25 , mb : 8}} dir="rtl">
                <span style={{fontSize : '12px'}}>اتباع</span>
                <TypographyStyled variant='h5'>{`تکمیل اطلاعات`}</TypographyStyled>
                <Typography variant='body2'>سامانه مدیریت هویت افراد</Typography>
              </Box>
              <form onSubmit={handleSubmit(sendReq)}>
                <Autocomplete
                    options={[ 'دارای شناسه اتباع' , 'بدون شناسه اتباع']}
                    getOptionLabel={(option: any) => option}
                    value={formData.officiality}
                    className='comboAcc'
                    onChange={(e, newValue : any) => setFormData({...formData , officiality : newValue})}
                    renderInput={(params) => <TextField {...params} label={'وضعیت'} variant="standard" />}
                />
                {
                    formData.officiality == 'دارای شناسه اتباع' ?
                    <>                       
                       <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                            name='firstName'
                            control={control}
                            render={({ field: { onBlur } }) => (
                                <TextField
                                autoFocus
                                label='نام'
                                value={formData.firstName}
                                onBlur={onBlur}
                                onChange={(e) => setFormData({...formData , firstName : e.target.value})}
                                placeholder=''
                                />
                            )}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                            name='lastName'
                            control={control}
                            render={({ field: { onBlur } }) => (
                                <TextField
                                autoFocus
                                label='نام خانوادگی'
                                value={formData.lastName}
                                onBlur={onBlur}
                                onChange={(e) => setFormData({...formData , lastName : e.target.value})}
                                placeholder=''
                                />
                            )}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                            name='fatherName'
                            control={control}
                            render={({ field: { onBlur } }) => (
                                <TextField
                                autoFocus
                                label='نام پدر'
                                value={formData.fatherName}
                                onBlur={onBlur}
                                onChange={(e) => setFormData({...formData , fatherName : e.target.value})}
                                placeholder=''
                                />
                            )}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                            name='nationalCode'
                            control={control}
                            render={({ field: { onBlur } }) => (
                                <TextField
                                autoFocus
                                label='شناسه اتباع'
                                value={formData.nationalCode}
                                onBlur={onBlur}
                                onChange={(e) => setFormData({...formData , nationalCode : e.target.value})}
                                placeholder=''
                                />
                            )}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                            name='workPlace'
                            control={control}
                            render={({ field: { onBlur } }) => (
                                <TextField
                                autoFocus
                                label='محل کار'
                                value={formData.workPlace}
                                onBlur={onBlur}
                                onChange={(e) => setFormData({...formData , workPlace : e.target.value})}
                                placeholder=''
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
                                placeholder=''
                                />
                            )}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <Controller
                            name='address'
                            control={control}
                            render={({ field: { onBlur } }) => (
                                <TextField
                                autoFocus
                                label='محل سکونت'
                                value={formData.address}
                                onBlur={onBlur}
                                onChange={(e) => setFormData({...formData , address : e.target.value})}
                                placeholder=''
                                />
                            )}
                            />
                        </FormControl>
                        <Autocomplete
                          style={{marginTop : '10px'}}
                          options={['حمل و نقل' , 'اصناف' , 'وزارت کشور']}
                          getOptionLabel={(option: any) => option}
                          value={formData.category}
                          className='comboAcc'
                          onChange={(e, newValue) => {
                            setFormData({...formData , category : newValue as "اصناف" | "حمل و نقل" | "گردشگری"})
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
                        <DatePickerFunc value={formData.workPlace} ChangeDateHandler={ChangeDateHandler}/>
                    </>
                    : null               
                    // <FormControl fullWidth sx={{ mb: 4 }}>
                    //   <Controller
                    //   name='workPlace'
                    //   control={control}
                    //   render={({ field: { onBlur } }) => (
                    //       <TextField
                    //       autoFocus
                    //       label='محل کار'
                    //       value={formData.workPlace}
                    //       onBlur={onBlur}
                    //       onChange={(e) => setFormData({...formData , workPlace : e.target.value})}
                    //       placeholder=''
                    //       />
                    //   )}
                    //   />
                    // </FormControl>
                }
                
                {error && <p style={{color : '#ff3d3d' , textAlign : 'center'}}>{error}</p>} 

                {
                  loading ? 
                    <div style={{textAlign : 'center' , display : 'flex' , justifyContent : 'center' , margin : '-35px 0px 35px'}}>
                      <Loader />
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

