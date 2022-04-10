
const ipregx = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)
export function validateIP(ip) {
    if(ipregx.test(ip)) return true;
    else return false;
}

const boothregx = new RegExp(/Booth-\d/)
export function validateBoothNo(booth) {
    if(boothregx.test(booth)) return true;
    else return false;
}