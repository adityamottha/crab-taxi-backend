import { AuthUser } from "../../models/authModel/AuthUsers.model.js";
import { ApiError } from "../../utils/ApiError.js";
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

export { registerService };
