// ** Type import
import { useEffect, useState } from 'react';
import parseCookieString from 'src/utils/parseCookieString';
import ParseJwt from 'src/utils/ParseJwt';

const Navigation = () => {
  const [isShop , setIsShop] = useState(false);

  useEffect(() => {
    const fillJwt = async () => {
      const { jwt } = parseCookieString(document.cookie)
      
      if (jwt) {
        const parsedData = ParseJwt(jwt);
        async function getStatus(){
          const sendReq = await fetch('https://api.cns365.ir/api/role.php' , {
            method : 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ nationalCode: parsedData.nationalCode})
          })
          const Data = await sendReq.json();
          if(Data.role == 'shop' || Data.role == 'manager') setIsShop(true)
      }
      getStatus()
      }
    }
    fillJwt()
  }, []);
  
  if(isShop) {
    return [  
      {
        title: 'وضعیت پیشرفت',
        icon: 'mdi:progress-check',
        path: '/overview'
      },
      {
        title: 'اطلاعات شخصی',
        icon: 'mdi:account-circle-outline',
        path: '/profile'
      },
      {
        title: 'اطلاعات کاری',
        icon: 'ic:outline-work',
        path: '/work'
      },
  
      {
        title: 'صدور کارت',
        icon: 'ic:baseline-credit-card',
        path: '/cart'
      },
      {
        title: 'پشتیبانی',
        icon: 'mdi:headset',
        path: '/support'
      },
      {
        title: 'راهنمایی',
        icon: 'mdi:help-circle-outline',
        path: '/guide'
      },
      {
        title: 'سوالات متداول',
        icon: 'mdi:frequently-asked-questions',
        path: '/FandQ'
      },
      {
        sectionTitle: 'مدیریت'
      },
      {
        title: 'آپلود دستی',
        icon: 'mdi:file-upload-outline',
        path: '/upload/one'
      },
      {
        title: 'آپلود گروهی',
        icon: 'mdi:folder-upload-outline',
        path: '/upload/group'
      },
      {
        title: 'تایید شده‌ها',
        icon: 'mdi:check-circle-outline',
        path: '/accepted'
      },
      {
        title: 'در انتظار تایید',
        icon: 'mdi:clock-outline',
        path: '/waiting'
      },
      {
        title: 'رد شده',
        icon: 'hugeicons:multiplication-sign',
        path: '/declined'
      }
    ] 
  } else {
    return [  
      {
        title: 'وضعیت پیشرفت',
        icon: 'mdi:progress-check',
        path: '/overview'
      },
      {
        title: 'اطلاعات شخصی',
        icon: 'mdi:account-circle-outline',
        path: '/profile'
      },
      {
        title: 'اطلاعات کاری',
        icon: 'ic:outline-work',
        path: '/work'
      },
  
      {
        title: 'صدور کارت',
        icon: 'ic:baseline-credit-card',
        path: '/cart'
      },
      {
        title: 'پشتیبانی',
        icon: 'mdi:headset',
        path: '/support'
      },
      {
        title: 'راهنمایی',
        icon: 'mdi:help-circle-outline',
        path: '/guide'
      },
      {
        title: 'سوالات متداول',
        icon: 'mdi:frequently-asked-questions',
        path: '/FandQ'
      },
    ]
  }
  

}

export default Navigation
