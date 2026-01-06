import validator from "validator"
import { parsePhoneNumberFromString } from "libphonenumber-js"

//Email validating method
const checkValidEmail =(emailAddress)=>{
    return validator.isEmail(emailAddress)
};

//Phone-number validatin method
const checkValidNumber = (phoneNumber)=>{
    const number = parsePhoneNumberFromString(phoneNumber)
    return number && number.isValid();
}
export {checkValidEmail, checkValidNumber}