
function getEmailOrPhone(value){
    let emailReg= /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    let phoneReg= /^\d{10}$/
    if(emailReg.test(value))return true
    return false
}

module.exports=getEmailOrPhone