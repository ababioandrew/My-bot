// export const mobileNumber = /^((\+[0-9]{3})|(\(\+[0-9]{3})\))?(\s)?[0-9]{10}$/; //+233 260721202
export const mobileNumber = /^[0].{9}$/; //ensures you start with 0 and takes 10 digits only
export const isFullGhanaPhoneNumber = /^\+233/; //+233 260721202
export const isGhanaMobileNumber = /^(\+233)?0*((2|5){1})((0|3|4|6|7|8){1})([0-9]{7})$/;
export const vodafoneMobileNumber = /^(\+233)?0*(20|50|51|59|56){1}/;

export const vodafoneEmail = /@vodafone.com$/;

export const isEmpty = /^[\s\xa0]*$/;
export const isAlpha = /^[A-z]+$/;
export const isNumeric = /^[0-9]+$/;
export const isAlphaNumeric = /^[A-z0-9]+$/;

/**
 ID Number formats should follow below format: [Where X = (0..9) and & = (A..Z)]
 "CXXXXXXXXXXXX" (new)
 "PXXXXXXXXXXXX" (new)
 "RXXXXXXXXXXXX" (new)
 "&&&-XXXXXXXXX-X" (existing)

 C234548603565
 ASD-234548603-5
 */
export const isNationalId = /^((C|P|R){1}[0-9]{12})|([A-Z]{3}-[0-9]{9}-[0-9])$/;

/*
. ID – DVLA (Driving License)
ID Number formats should follow below format: [Where X = (0..9) and & = (A..Z)]
"&&&&XXXXXXXXXX" (new)
"&&&-XXXXXX-XX-XX" (existing)
"&&&&-XXXX-XX-XX" (existing)
"&&&-XXXXXXXX-XXXXX" (existing)
"XXXXXXXX&X" (new) to be eliminated //msg not implemented due to deprecation
"&&XXXXXX" (new)
"&XXXXXXX" (new)
"&XXXXXX" (implemented)

*/
export const isOldDrivingLicense = /^([A-Z]{3,4})-?(([0-9]{10})|([0-9]{6}-[0-9]{2}-[0-9]{2})|([0-9]{4}-[0-9]{2}-[0-9]{2})|([0-9]{8}-[0-9]{5}))$/;
export const isNewDrivingLicense = /^([A-Z]{1,2})([0-9]{6,7})$/;

/*
ID – NHIS (National Health ID)
ID Number formats should follow below format: [Where X = (0..9) and & = (A..Z)]
XXXXXXXX - 8 characters (existing)
*/
export const isNationalHealthId = /^[0-9]{8}$/;

/*
ID – EC (Electoral Card )
ID Number formats should follow below format: [Where X = (0..9) and & = (A..Z)]
XXXXXXXX&& - 10 characters (existing)
XXXXXXXXXX – 10 characters (existing)
*/
export const isEcVoterId = /^[0-9]{8}([A-Z]{2}|[0-9]{2})$/;

/*
Passport
ID Number formats should follow below format: [Where X = (0..9) and & = (A..Z)]
HXXXXXXX or GXXXXXXX (For ONLY Ghana passports)
The ID number for passport should be between ranges H00...H99 and G00…G99
*/
export const isPassport = /^(H|G)[0-9]{7}$/;

/*
TIN
ID Number formats should follow below format: [Where X = (0..9) and & = (A..Z)]
&XXXXXXXXXX
The ID number for passport should be between ranges H00...H99 and G00…G99
*/
export const isTin = /^[A-Z][0-9]{9}([A-Z]{1}|[0-9]{1})$/;

/*
Customer Name Validation
The name can include a hyphen, ‘-’ but cannot begin or end with a hyphen;  
The name can include an apostrophe, ‘ ’ ’ but cannot begin or end with a apostrophe;  
No other special characters can be accepted 
Names cannot begin with space(s)
*/
export const isValidCustomerName = /^([A-z]+(\s+)?-?'?\.?)+[A-z]$/;
/*

Ghana Post GPS Didgital Address
Digital Address formats should follow below format: [Where X = (0..9) and & = (A..Z)]
&&-XXXX-XXX
&X-XXXX-XXX
*/
export const isGpDigitalAddress = /^[A-Z]([A-Z]|[0-9])-?[0-9]{3}-?[0-9]{4}$/;

export function ValidationError  (message, path, inner, value = "") {
  this.name = 'ValidationError';
  this.message = message;
  this.errors = [message];
  this.inner = [{ path, message }];
  this.path = path;
  this.value = value
}
