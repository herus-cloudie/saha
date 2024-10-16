export default function convertPersianDateToLatin(persianDate) {  
    const persianDigits = '۰۱۲۳۴۵۶۷۸۹';  
    const latinDigits = '0123456789';  

    let latinDate = persianDate.split('').map((char) => {  
        const index = persianDigits.indexOf(char);  

        return index !== -1 ? latinDigits[index] : char;  
    }).join('');  

    let [year, month, day] = latinDate.split('/');  

    const formattedMonth = month?.padStart(2, '0'); 
    const formattedDay = day.padStart(2, '0'); 
    
    return `${year}/${formattedMonth}/${formattedDay}`;  
} 