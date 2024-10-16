import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IdentTypeWithJwt } from 'src/context/types'
import parseCookieString from 'src/utils/parseCookieString'

const Profile = () => {
  const [userData , setUserData ] = useState<IdentTypeWithJwt>({
    firstName: '',
    fatherName: '',
    isDead: '',
    lastName: '',
    matched: '',
    alive: '',
    nationalCode: '',
    jwt : ''
  })

  useEffect(() => {
    setUserData(parseCookieString(document.cookie))
  } , [])

  return (
    <div>
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={12}>
          <h1>نمایه</h1>
        </Grid>
        
        <Grid item xs={12} sm={6} xl={2.4}>
         نام : <span>{userData.firstName}</span>
        </Grid>
        <Grid item xs={12} sm={6} xl={2.4}>
         نام خانوادگی : <span>{userData.lastName}</span>
        </Grid>
        <Grid item xs={12} sm={6} xl={2.4}>
        نام پدر : <span>{userData.fatherName}</span>
        </Grid>
        <Grid item xs={12} sm={6} xl={2.4}>
        کدملی : <span>{userData.nationalCode}</span>
        </Grid>

      </Grid>
    </div>
  )
}

export default Profile