const tempUserSchema = require("../model/tempUserModel"); // this should be the model, not schema

async function tempSave({ email, hashedPassword, fullname, phone, otpExpiry, otp }) {
  try {
    const tempUser = new tempUserSchema({
      email,
      password: hashedPassword,
      fullname,
      phone,
      otpExpiry,
      otp,
      createdAt: new Date(), // useful if you're using TTL
    });

    await tempUser.save();
    return tempUser;
  } catch (err) {
    console.error("Error saving temp user:", err);
    throw err;
  }
}

module.exports = tempSave;
