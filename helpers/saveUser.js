const userSchema=require("../model/userModel")
const tempUserSchema=require("../model/tempUserModel")
async function saveUser(email) {
    const tempUser=await tempUserSchema.findOne({email})

    if(!tempUser)return false

    const newUser=new userSchema({
        fullname:tempUser.fullname,
        email:tempUser.email,
        phone:tempUser.phone,
        password:tempUser.password,
    })

    await newUser.save()

    return { success: true, user: newUser.fullname };
}

module.exports = { saveUser };