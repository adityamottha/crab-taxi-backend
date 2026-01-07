import { AuthUser } from "../../models/authModel/AuthUsers.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { generateAccessAndRefreshToken } from "../../utils/RefAccTokens.js"
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
    if(
      user.role === "DRIVER" 
      && 
      user.driverApprovalStatus !== "APPROVED"
    ) throw new ApiError(400,"Account is not Approved by ADMIN!");

    // generate tokens 
    const {refreshToken, accessToken} = generateAccessAndRefreshToken(user._id);

    // set lastLogin and LoginCount 
    user.lastLoginAt = new Date();
    user.loginCount += 1;

    // remove sensetive fields
    const loggedInUser = await AuthUser.findById(user._id).select("-password");
    if(!loggedInUser) throw new ApiError(500,"User failed to login!");

    // return 
    return {loggedInUser,refreshToken,accessToken}

}

//LOGOUT SERVICE---------------
const logoutService = async (userId)=>{
  if(!userId) throw new ApiError(402,"userId is required for logout!");

  await AuthUser.findByIdAndUpdate(
    userId,
    {$inc:{ refreshTokenVersion: 1}},
    { new:true}
   );

   return true;
}


export { 
  registerService,
  loginService,
  logoutService
};
