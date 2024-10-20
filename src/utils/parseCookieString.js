export default function parseCookieString(cookieString) {
    return cookieString.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = decodeURIComponent(value);
      
      return acc;
    }, {});
  }