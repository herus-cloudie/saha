// ** React Imports
import { useState, ReactNode, MouseEvent, useEffect } from 'react'

// ** Next Imports
import Link from 'next/link'
import { signIn } from "next-auth/react"
import readXlsxFile from 'read-excel-file'
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
import ParseJwt from 'src/utils/ParseJwt'
// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { useRouter } from 'next/navigation'
import Loader from 'src/@core/components/spinner/loader'
import { loginCredentialSchema } from 'src/constant'
import DatePickerFunc from 'src/components/datePicker'
import { Autocomplete, Card } from '@mui/material'

interface IdentiType {
  firstName: String,
  fatherName: String,
  isDead: String,
  lastName: String,
  matched: String,
  alive: String,
  nationalCode: String
}
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
  nationalCode: '',
  phoneNumber: '',
}

const secondStep = () => {
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [isDataValid , setIsDataValid] = useState(false);
  // ** Hooks
  const router = useRouter()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings;

  function parseCookieString(cookieString : any) {
    return cookieString.split(';').reduce((acc : any, cookie: any) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
  }

  const [subgroupOptions , setSubgroupOptions] = useState<string[]>(['کشور' , 'استان' , 'شهر' , 'اتحادیه' , 'واحد صنفی']);
  const [additionalData , setAdditionalData] = useState<IdentiType>({
    firstName: '',
    fatherName: '',
    isDead: '',
    lastName: '',
    matched: '',
    alive: '',
    nationalCode: ''
  });
  const [state , setState] = useState({
    category : 'اصناف',
    role : 'کارمند',
    subgroup : ''
  }) 

 

  useEffect(() => {
    setAdditionalData(parseCookieString(document.cookie))
  }, []);

  
  
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(loginCredentialSchema)
  })

 
  const sendReq = async () => {
    if(!state.category || !state.role || !state.subgroup) return setError('لطفا تمامی گزینه ها را انتخاب کنید')
    setLoading(true);
    const result = await fetch('https://api.cns365.ir/backend/api/addUser.php' , {
      method: 'POST',
      body: JSON.stringify({...additionalData as any , ...state}),
      headers: {'Content-Type': 'application/json'}
    })
    const Data = await result.json();
    setLoading(false);
    document.cookie = `jwt = ${Data.jwt}; SameSite=None; Secure; Path=/`
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
              ? <img alt='fadls' src='/images/2.png' width={330} className='step'/>
              : <img alt='fadls' src='/images/2w.png' width={330} className='step'/>
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
                  value={state.category}
                  className='comboAcc'
                  onChange={(e, newValue) => {
                    console.log('fdsa')
                    setState({...state , category : newValue as string})
                    if(newValue == 'اصناف') setSubgroupOptions(['کشور' , 'استان' , 'شهر' , 'اتحادیه' , 'واحد صنفی'])
                    if(newValue == 'وزارت کشور') setSubgroupOptions([ 'واحد صنفی'])
                    if(newValue == 'حمل و نقل') setSubgroupOptions(['کشور' , 'واحد صنفی'])
                  }}
                  renderInput={(params) => <TextField {...params} label={'دسته بندی'} variant="standard" />}
                />
                <Autocomplete
                  options={subgroupOptions}
                  getOptionLabel={(option: any) => option}
                  value={state.subgroup}
                  className='comboAcc'
                  onChange={(e, newValue) => setState({...state , subgroup : newValue as string})}
                  renderInput={(params) => <TextField {...params} label={'گروه بندی'} variant="standard" />}
                />
                <Autocomplete
                  options={['کارمند' , 'مدیر']}
                  getOptionLabel={(option: any) => option}
                  value={state.role}
                  className='comboAcc'
                  onChange={(e, newValue) => setState({...state , role : newValue as string})}
                  renderInput={(params) => <TextField {...params} label={'سمت'} variant="standard" />}
                />
                
                  {error && <p style={{color : '#ff3d3d' , textAlign : 'center'}}>{error}</p>} 
                  {loading ? 
                      <div style={{textAlign : 'center' , display : 'flex' , justifyContent : 'center' , margin : '-35px 0px 35px'}}>
                        <Loader />
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
                        آقای <span>{additionalData.lastName} اطلاعات زیر را تایید میکنید؟</span>
                      <Button style={{marginRight : '10px !important'}} variant='outlined' color='error' size='small'>مغایرت</Button>
                    </Typography>
                  </Box>
                  <Card style={{padding : '5px 20px'}} >
                    <p>نام : <span>{additionalData.firstName}</span></p>
                    <p>نام خانوادگی : <span>{additionalData.lastName}</span></p>
                    <p>کدملی : <span>{additionalData.nationalCode}</span></p>
                    <p>نام پدر : <span>{additionalData.fatherName}</span></p>
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

secondStep.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

secondStep.guestGuard = true

export default secondStep



{/* <input type='file' id='input' onChange={(e : any) => readXlsxFile(e.target.files[0]).then((rows) => {
  console.log(rows)
})}/> */}