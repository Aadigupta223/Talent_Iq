// STEP: 1. Import required functions from express-validator (e.g., body)
import { body } from "express-validator";

//signup validator
// STEP: 2. Create an arrow function for the validator
const userRegisterValidator = () => {
  // STEP: 3. Return an array of validation rules
  return [
    // STEP: 4. Validate email (format, required)
    body("email")
      .trim()
      .notEmpty() //what if it was empty thats why we use .withMessage to adress the above validator
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    // STEP: 5. Validate username (required, length, format)
    // body("username")
    //   .trim()
    //   .notEmpty()
    //   .withMessage("Username is required")
    //   .isLowercase()
    //   .withMessage("Username must be in lower case")
    //   .isLength({ min: 2 })
    //   .withMessage("Username must be at least 2 characters long"),
    // STEP: 6. Validate password (required, strength)
    body("password").trim().notEmpty().withMessage("Password is required"),
    // STEP: 7. Validate fullName (optional, format/length if needed)
    body("fullName").optional().trim(),
  ];
};
//Login validator
const userLoginValidator = () => {
  return [
    body("email").isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

//update user validator
const userUpdateValidator= ()=> {
  return [
    body("fullName").optional().trim(),
    body("profilePic").optional().trim(),
  ];
}

export { userRegisterValidator, userLoginValidator,userUpdateValidator };

// NOTE: validator(index.js) is a method that will collect all the errors and throw them to middleware(validate) then next to route
//? exampe router.post("/login", loginLimiter, userLoginValidator(), validate, login);
