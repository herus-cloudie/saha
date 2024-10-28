'use client';

import { Autocomplete, Button, Card, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, Grid, TextField, } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import IconifyIcon from 'src/@core/components/icon';
import Loader from 'src/@core/components/spinner/loader';

import parseCookieString from 'src/utils/parseCookieString';
import ParseJwt from 'src/utils/ParseJwt';

interface WorksType {
  senf_code: string,
  position: string,
  workplace: string,
  category: string,
  subgroup: string,
  city: string,
  province: string

}
const Work = () => {
  const router = useRouter();
  const { control } = useForm();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [cookieData, setCookieData] = useState({
    id: 0,
    nationalCode: "",
    firstName: "",
    fatherName: "",
    lastName: "",
    phoneNumber: "",
    birthDate: "",
    officiality: "دارای شناسه اتباع",
    nationality: "ایرانی",
    workPlace: "",
    category: "اصناف",
    subgroup: "",
    image: "",
    postal_code: "",
    address: "",
    identPict: "",
    isDead: 0,
    matched: 1,
    alive: 1,
    role: "user",
    province: '',
    city: '',
    senfCode: "",
    position: '',
    jwt: ""
  });

  const [newJob, setNewJob] = useState({
    senfCode: '',
    workPlace: '',
    position: '',
    category: '',
    subgroup: '',
    province: '',
    city: ''
  });

  const [allAdditional, setAllAdditional] = useState<WorksType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState('');
  const [mainLoader, setMainLoader] = useState(true);
  const [open, setOpen] = useState(false)
  const [selectBoxOpen, setSelectBoxOpen] = useState<boolean>(false);
  const [maxJob, setMaxJob] = useState<boolean>(false);
  const [mainWorkIndex, setMainWorkIndex] = useState();
  
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);
  

  const allJobs = [ {senf_code : cookieData.senfCode , position : cookieData.position, subgroup : cookieData.subgroup,
    workplace : cookieData.workPlace , category : cookieData.category , city : cookieData.city , province : cookieData.province } , ...allAdditional ,]

  const indexOfJob = allJobs.map((item , index) => index + 1)
  const getSecondJob = async () => {
    try {
      const response = await fetch('https://api.cns365.ir/api/secondw.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nationalCode: cookieData.nationalCode })
      });
      const data = await response.json();

      if (data.success) {
        setAllAdditional(data.workplaces);
        setMaxJob(data.workplaces.length >= 4);
      }
    } catch (err) {
      console.error("Error fetching second job:", err);
    } finally {
      setMainLoader(false);
    }
  };

  useEffect(() => {
    const fillJwt = async () => {
      const { jwt , mainWork} = parseCookieString(document.cookie);
      if (jwt) {
        const parsedData = ParseJwt(jwt);
        setCookieData(parsedData);
        setMainWorkIndex(mainWork)
      }
      setMainLoader(false);
     
    };
    fillJwt();
  }, [mainWorkIndex]);

  const submitWork = async () => {
    if (!newJob.senfCode || newJob.senfCode.length !== 10) {
      return setError('کد صنفی حداقل و حداکثر 10 رقم میباشد');
    }
    if (!newJob.position) {
      return setError('محل کار و سمت را وارد کنید');
    }
    setLoading(true);
    try {
      const response = await fetch('https://api.cns365.ir/api/senf.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senfCode: newJob.senfCode, nationalCode: cookieData.nationalCode })
      });
      const data = await response.json();
      if (data.error) {
        setError('کد صنفی نامعتبر است');
      } else {
        setNewJob({
          ...newJob,
          category: data.category,
          subgroup: data.subgroup,
          province: data.province,
          workPlace: data.workplace,
          city: data.city
        });
        await fetch('https://api.cns365.ir/api/workdata.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newJob, ...data, nationalCode: cookieData.nationalCode })
        });
        setError('');
        router.reload()
      }
    } catch (err) {
      console.error("Error submitting work:", err);
      setError("خطا در ثبت اطلاعات");
    } finally {

      setLoading(false);
    }
  };
  console.log({a : cookieData , allAdditional})
  const submitMainJob = async () => {
    const response = await fetch('https://api.cns365.ir/api/prime.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senfCode: allJobs[selectedJobIndex - 1].senf_code, nationalCode: cookieData.nationalCode })
    });
    const data = await response.json();
    console.log(data , allJobs[selectedJobIndex - 1])
    document.cookie = `mainWork = ${selectedJobIndex - 1}; SameSite=None; Secure; Path=/; Max-Age=${7 * 24 * 60 * 60}`;
    setSelectBoxOpen(false)
    router.reload()
  }

  useEffect(() => {
    if (isMounted) { 
      getSecondJob();
    }
  }, [isMounted , cookieData , router])

  if (mainLoader) {
    return <Loader />;
  }

  return (
    <div>
      <Card style={{ padding: '0 30px 30px' }}>
        <Grid container spacing={6}>
          <Grid style={{display : 'flex' , justifyContent : 'space-between' , alignItems : 'center'}} item xs={12}>
            <h1>اطلاعات کاری</h1>
            {
              mainWorkIndex == '1' || mainWorkIndex == '2' || mainWorkIndex == '3' || mainWorkIndex == '4' || mainWorkIndex == '5' ? 
              <p>شماره شغل اصلی {+mainWorkIndex + 1}</p>
               : <Button onClick={() => setSelectBoxOpen(true)} style={{height : '50px'}} variant='contained'>انتخاب شغل اصلی</Button>
            }
          </Grid>
          {allJobs.map((item, index) => {
            const selectedJob = index == mainWorkIndex;
          
            // console.log(item.category)
              return (
              <Grid item xs={6} key={index}>
                <Card style={selectedJob ? {backgroundColor : '#cde8ffd9'} :  {backgroundColor : 'white'}} sx={{ padding: '0 20px 10px 20px', display: 'flex', gap: '10px', flexDirection: "column" }}>
                  <h3>شغل {index + 1} {selectedJob && <small style={{fontSize : '12px' , marginRight : '20px'}}>شغل اصلی</small>}</h3>
                  <div>شناسه صنفی : <span>{item.senf_code}</span></div>
                  <div>سمت جاری : <span>{item.position}</span></div>
                  <div>محل کار : <span>{item.workplace}</span></div>
                  <div>اتحادیه : <span>{item?.category}</span></div>
                  <div>رسته : <span>{item.subgroup}</span></div>
                </Card>
              </Grid>
            )
          })}
          {!maxJob && (
            <Grid  item xs={6}>
              <Card style={{paddingBottom : '90px'}} onClick={() => setOpen(true)} sx={{ padding: '0 20px 10px 20px', display: 'flex', flexDirection: "column", alignItems: 'center' }}>
                <h2>افزودن شغل</h2>
                <IconifyIcon width={80} icon={"mdi:tab-add"} />
              </Card>
            </Grid>
          )}
        </Grid>
      </Card>
      <Dialog open={selectBoxOpen} onClose={() => setSelectBoxOpen(false)}>
        <DialogContent>
          <FormControl fullWidth>
            <Autocomplete
              options={indexOfJob}
              value={selectedJobIndex}
              onChange={(e, value) => setSelectedJobIndex(value as number)}
              renderInput={(params) => <TextField {...params} label="شماره شغل" />}
            />
          </FormControl>
        </DialogContent>
        <DialogActions style={{display : 'flex' , justifyContent : 'center' , flexDirection : 'column'}}>
          <Button variant="contained" onClick={submitMainJob}>ثبت</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          <FormControl fullWidth>
            <Controller
              name="senfCode"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="شناسه صنفی" value={newJob.senfCode} onChange={(e) => setNewJob({ ...newJob, senfCode: e.target.value })} />
              )}
            />
            <br />
            <Autocomplete
              options={['مباشر', 'مدیر', 'کارمند', 'کارگر']}
              value={newJob.position}
              onChange={(e, value) => setNewJob({ ...newJob, position: value || '' })}
              renderInput={(params) => <TextField {...params} label="سمت" />}
            />
          </FormControl>
        </DialogContent>
        <DialogActions style={{display : 'flex' , justifyContent : 'center' , flexDirection : 'column'}}>
          {error && <p style={{color : '#ff3d3d' , textAlign : 'center'}}>{error}</p>} 
          {loading ? <CircularProgress /> : <Button variant="contained" onClick={submitWork}>ثبت</Button>}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Work;
