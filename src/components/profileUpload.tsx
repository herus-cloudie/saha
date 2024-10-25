
import { useState, ElementType, ChangeEvent } from 'react'

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Button, { ButtonProps } from '@mui/material/Button'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

import { CircularProgress } from '@mui/material'
import IconifyIcon from 'src/@core/components/icon'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(5),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))


const ProfileUpload = ({dialogFunc , identStatus , areImagesFilled} : {dialogFunc : any ,identStatus : string, areImagesFilled : any}) => {
  const [imgFront, setImgFront] = useState<string>('https://api.cns365.ir/img/profile.png');
  const [frontData , setFrontData] = useState<any>();

  const [loading , setLoading] = useState<boolean>();

  const handleFrontImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFrontData(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImgFront(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const sendIdentFunc = async () => {
    if (!frontData) {
      return areImagesFilled(!frontData,);
    }
  
    const formData = new FormData();
    formData.append('nationalCardFront', frontData);
  
    setLoading(true);
    
    try {
      const sendPictures = await fetch('https://api.zibal.ir/v1/facility/nationalCardOcr', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 9361a1e1fbd64b8e87cf98abb6b665d3',
        },
        body: formData
      });
  
      if (!sendPictures.ok) {
        const errorResponse = await sendPictures.json();
        throw new Error(errorResponse.message || 'خطا در پردازش تصویر کارت ملی');
      }
  
      const responseData = await sendPictures.json();
      dialogFunc(responseData); 
      // router.reload()
    } catch (error) {
      console.error('Error in sendIdentFunc:', error);
      dialogFunc({
        message: 'خطایی در آپلود کارت ملی رخ داده است',
        result: 21,
        data: undefined
      });

    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Grid container spacing={6} style={{ marginTop: '10px'  }}>
      {
        !(identStatus == 'false') ?
        <>
          <Grid item xs={12}>
            <Grid item xs={12}>
                <div style={{display : 'flex' , justifyContent : 'space-between' , alignItems : 'center'}}>
                    <h3>بروزرسانی عکس پروفایل</h3>
                    <h2 style={{padding: '5px 25px', borderRadius: '25px', boxShadow: '0px 0px 8px #c4c4c4' }}>1</h2>
                </div>
            </Grid>

            <Card> 
                <Grid  item xs={12}>
                <CardHeader title='عکس پروفایل شما' />
                <form>
                    <CardContent className='profilePadding'>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <ImgStyled src={imgFront} alt='Profile Pic' />
                            <div>
                            <ButtonStyled component='label' variant='contained'>
                              پروفایل خود را آپلود کنید
                                <input
                                hidden
                                type='file'
                                accept='image/png, image/jpeg'
                                onChange={handleFrontImageChange}
                                />
                            </ButtonStyled>
                            <Typography sx={{ mt: 5, color: 'text.disabled' }}>حداکثر حجم عکس 5 مگابایت</Typography>
                            </div>
                        </Box>
                    </CardContent>
                    <Divider />
                </form>
                </Grid>
            </Card>
        </Grid>
        <Grid style={{marginBottom : '20px' , padding : '10px'}} item xs={12}>
          <div style={{display : 'flex' , justifyContent : 'center' , widows : '100%' }}>
            { 
              loading 
              ? <div style={{ marginTop : '-45px'}}> 
                <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                    <CircularProgress />
                </Box>
              </div>
              : <Button onClick={sendIdentFunc} style={{width : '300px'}} size='large' color='success' component='label' variant='contained'>
                      بروزرسانی
              </Button>
            }
          </div>
        </Grid>  
        </>
        
       : <Grid item xs={12}>
          <Card style={{padding : '20px' , backgroundColor: '#15d10021'}} >
            <Grid item xs={12}>
                  <div style={{display : 'flex' , justifyContent : 'space-between' , alignItems : 'center'}}>
                  <h3>بروزرسانی عکس پروفایل</h3>
                    <h2 style={{padding: '5px 25px', borderRadius: '25px', boxShadow: '0px 0px 8px #c4c4c4'}}>1</h2>
                  </div>
                  <div style={{display : 'flex' , justifyContent : 'space-around' , flexDirection : 'column' , alignItems : 'center'}}>
                    <h3> عکس پروفایل شما ثبت شده است</h3>
                      <Box
                        sx={{
                          display: 'flex',
                          textAlign: 'center',
                          alignItems: 'center',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          '& svg': {
                            mb: 8,
                            color:  'success.main'
                          }
                        }}
                      >
                      <IconifyIcon color='success' icon='mdi:check-circle-outline' fontSize='3.5rem'/>
                    </Box>
                  </div>
              </Grid>
          </Card>
        </Grid>
        }
    </Grid>
  )
}

export default ProfileUpload
