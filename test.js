
// replace _ to space
 function rep(str){
    let string = "";
    for (let i = 0; i < str.length; i++) {
        if(str[i] == " "){
           string += "_";
        }else{
            string += str[i];
        }
    }
    return string
 };

//  console.log(rep("testing on docker"

const testOfLargestType = (largest = []) =>{
    // assume largest type
    let assumeNum = largest[0]
    // for loop over arr
    for (let i = 0; i < largest.length; i++) {
        if(largest[i] > assumeNum){
           assumeNum = largest[i]
        }
    }
  return assumeNum
};

// console.log(testOfLargestType([12,34,53,56]))

const testOfSmallestType = (smallest = []) =>{
    let arr = smallest[0];

    for (let i = 0; i < smallest.length; i++) {
        if(smallest[i] < arr){
           arr = smallest[i]
        }
    }
return arr
}

//  console.log(testOfSmallestType([12,43,431,34]))