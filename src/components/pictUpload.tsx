
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

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const PictUpload = () => {
  const [imgFront, setImgFront] = useState<string>('/images/ncard.png')
  const [imgBack, setImgBack] = useState<string>('/images/ncard.png')
  const [frontData , setFrontData] = useState<any>()
  const [backData , setBackData] = useState<any>()

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

  const handleBackImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setBackData(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImgBack(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleInputBackReset = () => {
    setImgBack('/images/ncard.png')
  }
  const handleInputFrontReset = () => {
    setImgFront('/images/ncard.png')
  }

  const sendIdentFunc = async () => {
    const formData = new FormData();
    formData.append('nationalCardFront' , frontData)
    formData.append('nationalCardBack' , backData)
    const apiResponse = await fetch('https://api.zibal.ir/v1/facility/nationalCardOcr', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 9361a1e1fbd64b8e87cf98abb6b665d3',
        },
        body: formData,
      });
    const aaa = await apiResponse.json()
    console.log(aaa)
  }
  
  return (
    <Grid container spacing={6} style={{ marginRight: '0px', marginTop: '10px' }}>
      <Grid item xs={12}>

        <Grid item xs={12}>
            <h3>بارگذاری عکس کارت ملی</h3>
        </Grid>

        <Card> 

            <Grid  item xs={12}>
            <CardHeader title='روی کارت' />
            <form>
                <CardContent sx={{ pt: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ImgStyled src={imgFront} alt='Profile Pic' />
                    <div>
                    <ButtonStyled component='label' variant='contained'>
                        تصویر خود را آپلود کنید
                        <input
                        hidden
                        type='file'
                        accept='image/png, image/jpeg'
                        onChange={handleFrontImageChange}
                        />
                    </ButtonStyled>
                    <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputFrontReset}>
                        بازنشانی عکس
                    </ResetButtonStyled>
                    <Typography sx={{ mt: 5, color: 'text.disabled' }}>حداکثر حجم عکس 5 مگابایت</Typography>
                    </div>
                </Box>
                </CardContent>
                <Divider />
            </form>
            </Grid>

            <Grid item xs={12}>
              <CardHeader title='پشت کارت' />
              <form>
                  <CardContent sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ImgStyled src={imgBack} alt='Profile Pic' />
                      <div>
                      <ButtonStyled component='label' variant='contained'>
                          تصویر خود را آپلود کنید
                          <input
                          hidden
                          type='file'
                          accept='image/png, image/jpeg'
                          onChange={handleBackImageChange}
                          />
                          </ButtonStyled>
                      <ResetButtonStyled color='secondary' variant='outlined' onClick={handleInputBackReset}>
                          بازنشانی عکس
                      </ResetButtonStyled>
                      <Typography sx={{ mt: 5, color: 'text.disabled' }}>حداکثر حجم عکس 5 مگابایت</Typography>
                      </div>
                  </Box>
                  </CardContent>
                  <Divider />
              </form>
            </Grid>

        </Card>

      </Grid>
      <Grid style={{height :'200px' , padding : '10px'}} item xs={12}><div style={{display : 'flex' , justifyContent : 'center' , widows : '100%' }}>
        <Button onClick={sendIdentFunc} style={{width : '300px'}} size='large' color='success' component='label' variant='contained'>
                بررسی
        </Button>
      </div></Grid>
    </Grid>
  )
}

export default PictUpload

