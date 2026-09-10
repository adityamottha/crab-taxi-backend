
// find largest user in the Database 

const findLargest = (largest =[]) =>{
    // asume
    let assumeLargeUser = largest[0];
    // loop over 
    for (let i = 0; i < largest.length; i++) {
        if(largest[i] > assumeLargeUser){
            assumeLargeUser = largest[i]
        }
    }

    return assumeLargeUser;

}

// console.log(findLargest([12,43,545,6,5]));

// find less today's less paide driver 

const driversAmout = [1222,4322,5226,7812]
const lessPaidDriver = async (driversAmout =[]) =>{
    // assumeLessPaidDriver 
    const lessPaidDriver = driversAmout[0]

    // for loop over driversAmout 
    for (let i = 0; i < driversAmout.length; i++) {
        if(driversAmout[i] < lessPaidDriver){
            lessPaidDriver = driversAmout[i]
        }
    };
    return {
        message:`Less paid amount is: ${lessPaidDriver}`
    }
}

// console.log(lessPaidDriver(driversAmout))

// FIND THE SECOND LARGEST DAY EARNIN OF DRIVER

const secLargestEaningOfDriver = (arr=[]) =>{
    // assumeLargest number
    let largest = arr[0]

    // assumeSecondLargest number
    let secLargestNumber = arr[0]

    //for loop over arr:=
    for (let i = 0; i < arr.length; i++) {
            if(arr[i] > largest){
               return largest = arr[i]
            }
            if(arr[i] > secLargestNumber && arr[i] < largest ){
             secLargestNumber = arr[i]
       }

       }

       
    return secLargestNumber;
}; // AGAIN DO TOMMMOROW

// console.log(secLargestEaningOfDriver([12,32,431,23]))

/// REVERSE PAYMENTBLOCK

const reversePaymentFlow = (arr =[]) =>{
    let rev = []
    for (let i = arr.length -1; i >=0; i--) {
        rev.push(arr[i])
    };
    return {
        rightPaymentFlow:arr,
        reversePaymentFlow:rev
    }
}

// console.log(reversePaymentFlow([12,13,14,15,16]))

// check if RideDays sorted 

const sorted = (arr =[]) =>{
    for (let i = 0; i < arr.length; i++) {
        if(arr[i] > arr[i+1]){
            return false
        }
    }
    return true
}

console.log(sorted([1,2,3,4,2]));
