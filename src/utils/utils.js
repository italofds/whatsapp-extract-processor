import moment from 'moment';

export function formatPhoneNumber(phoneNumber) {
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
    let match;

    if(cleaned.slice(0,2) === "55") {
        if (cleaned.length === 13) {
            match = cleaned.match(/55(\d{2})(\d{5})(\d{4})$/);
            if (match) {
                return `+55 (${match[1]}) ${match[2]}-${match[3]}`;
            }
    
        } else if (cleaned.length === 12) {
            match = cleaned.match(/55(\d{2})(\d{4})(\d{4})$/);
            if (match) {
                return `+55 (${match[1]}) 9${match[2]}-${match[3]}`;
            }
        }
    }
    
    
    return `+${phoneNumber}`;
}

export function formatDate(dateValue, format) {
    return moment.utc(dateValue).locale('pt-br').format(format);
}