import { AuthUser } from "./authUsers.models.js"
import { ApiError } from "../../utils/ApiError.js"
import { generateAccessAndRefreshToken } from "../../utils/RefAccTokens.js"
import jwt from "jsonwebtoken";
import { ONE_DAY } from "../../constants.js";
// import { checkValidEmail } from "../../utils/validEmailPassword.js";
// import { parsePhoneNumberFromString } from "libphonenumber-js";

const registerService = async ({ phoneNumber, email, password, role }) => {

  // Required checks
  if (!phoneNumber) {
    throw new ApiError(400, "Phone number is required!");
  }

  if (!email?.trim() || !password?.trim() || !role) {
    throw new ApiError(400, "All fields are required!");
  }

  // // Email validation
  // if (!checkValidEmail(email)) {
  //   throw new ApiError(400, "Invalid email!");
  // }

  // // Phone validation + formatting
  // const parsedPhone = parsePhoneNumberFromString(phoneNumber);

  // if (!parsedPhone || !parsedPhone.isValid()) {
  //   throw new ApiError(400, "Invalid phone number");
  // }

  // phoneNumber = parsedPhone.format("E.164");

  // Check existing user
  const existedUser = await AuthUser.findOne({
    $or: [{ phoneNumber }, {email}],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists!");
  }

  // Create user
  const user = await AuthUser.create({
    phoneNumber,
    email: email.toLowerCase(),
    password,
    role,
    authProvider: "EMAIL",
    accountStatus: "ACTIVE",
    driverApprovalStatus: role === "DRIVER" ? "PENDING" : "NOT_APPLICABLE",
    kycRequired: role === "DRIVER",
  });

  // Remove sensitive data
  const createdUser = await AuthUser.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "User failed to register!");
  }

  return createdUser;
};


// LOGIN SERVICE---------------
const loginService = async ({email,password})=>{

  // check data is ot empty 
  if([email,password].some(fields=>!fields?.trim())){
    throw new ApiError(404,"All Email & Password is required!")
    }

    // check user is avilable in db 
    const user = await AuthUser.findOne({email}).select("+password");
    if(!user) throw new ApiError(402,"Not a register user!");

    // check password 
    const isValidPassword = await user.isPasswordCorrect(password);
    if(!isValidPassword) throw new ApiError(400,"Invalid Password!");

    // check user status 
    if(user.accountStatus !== "ACTIVE") throw new ApiError(200,"Account is not active!");

    // check if role is DRIVER and not approved by ADMIN give error 
    // if(
    //   user.role === "DRIVER" 
    //   && 
    //   user.driverApprovalStatus !== "APPROVED"
    // ) throw new ApiError(400,"Account is not Approved by ADMIN!");

    // generate tokens 
    const {refreshToken, accessToken} = await generateAccessAndRefreshToken(user._id);

    // set lastLogin and LoginCount 
    user.lastLoginAt = new Date();
    user.loginCount += 1;
    
    await user.save();
    // remove sensetive fields
    const loggedInUser = await AuthUser.findById(user._id).select("-password");
    if(!loggedInUser) throw new ApiError(500,"User failed to login!");

    // return 
    return {loggedInUser,refreshToken,accessToken}

}

//LOGOUT SERVICE---------------
const logoutService = async (userId)=>{

  // through err if not provide a userId 
  if(!userId) throw new ApiError(402,"userId is required for logout!");

// find user and update (increase a refreshToken and gives updated one)
  await AuthUser.findByIdAndUpdate(
    userId,
    {$inc:{ refreshTokenVersion: 1}},
    { new:true}
   );

  //  return true 
   return true;
};

// Access-token generting for continue login
const refreshAccessTokenService = async (incomingRefreshToken) => {

  // check token is available 
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request!");
  }

  // Verifies the incoming refresh token using secret key and decodes its payload
  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_KEY
  );

  //find the user by userId and validate if user exist
  const user = await AuthUser.findById(decodedToken.userId);
  if (!user) throw new ApiError(401, "Invalid refresh token");

  // check refresh-token is still valid by comaring token version
  if (decodedToken.tokenVersion !== user.refreshTokenVersion) {
    throw new ApiError(401, "Refresh token expired or revoked");
  }

  // generate a new refresh and access token by id
  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(user._id);

    // return for controller 
  return { accessToken, refreshToken };
};

// CHANGE PASSWORD --------------------------------

const changePasswordService = async (userId,oldPassword,newPassword)=>{

//check all fields are required
if([oldPassword,newPassword].some(fields=>!fields?.trim())){
  throw new ApiError(404,"All fields are required!");
};

// check new password is different from old password 
if(oldPassword === newPassword) throw new ApiError(409,"New-password must be different!");

// find user +password 
const user = await AuthUser.findById(userId).select("+password");
if(!user) throw new ApiError(400,"User is not registered!");

//  Add a password change limit in 24h 
if(user.passwordChangedAt && Date.now() - user.passwordChangedAt.getTime() < ONE_DAY){
  throw new ApiError(400,"You can change email only one in 24h!");
};

// compare old password
const isMatchOldPassword = await user.isPasswordCorrect(oldPassword);
if(!isMatchOldPassword) throw new ApiError(402,"Old password is wrong!");

// Update email and changedAt date
user.password = newPassword;
user.passwordChangedAt = new Date();

// increase refreshTokenVersion for loggedOut from all device
user.refreshTokenVersion += 1;

// save user 
await user.save();

};

// CHANGE EMAIL ------------------

const changeEmailService = async ({userId,oldEmail, newEmail})=>{
  console.log("USER_SERVICE_USERID:- ",userId.oldEmail);
  
  // check all fields are required 
  if([oldEmail,newEmail].some(fields=>!fields?.trim())){
    console.log("OLD_EMAIL:- ",oldEmail);
    console.log("NEW_EMAIL:- ",newEmail);
    throw new ApiError(404,"All fields are required!");
  };

  
  // check new Email must be diffrant from Old-Email
  if(newEmail === oldEmail){
    throw new ApiError(402,"New Email must be diffrante from old one!");
  };

  // find user by id
  const user = await AuthUser.findById(userId);
  if(!user) throw new ApiError(409,"User is not valid!");

  // check email must be match from oldEmail
  if(user.email !== oldEmail){
    throw new ApiError(400,"Old Email is wrong!");
  };

  // change email to newEmail
  user.email = newEmail;

  // save user 
  await user.save();

  // return 
  return user;
}

// CHANGE PHONE_NUMBER ----------------------------

const changePhoneNumberService = async ({userId,oldPhoneNumber,newPhoneNumber})=>{

  // check all fields are required 
  if([oldPhoneNumber,newPhoneNumber].some(fields=>!fields?.trim())){
    throw new ApiError(404,"All fields are required!");
  };

  // check new and old number are not same
  if(newPhoneNumber === oldPhoneNumber){
    throw new ApiError(403,"New email must be diffrante from old one!");
  };

  // get user by userId
  const user = await AuthUser.findById(userId);
  if(!user) throw new ApiError(409,"User is not registered!");

  // check old phoneNumber is same as db phoneNumber
  if(user.phoneNumber !== oldPhoneNumber){
    throw new ApiError(404,"oldNumber is not valid number!");
  };

  // Update old phone number to new phone number
  user.phoneNumber = newPhoneNumber;

  // save user 
   await user.save();

  // return
  return user;
}

export { 
  registerService,  
  loginService,
  logoutService,
  refreshAccessTokenService,
  changePasswordService,
  changeEmailService,
  changePhoneNumberService
};
