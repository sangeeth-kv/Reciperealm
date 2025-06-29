const forgetBtn=document.getElementById("forgotPasswordLink")

forgetBtn.addEventListener("click",async (e) => {
    e.preventDefault()
    
    const emailOrPhoneError = document.getElementById("emailorphoneError");
    emailOrPhoneError.textContent = "";
   
    const emailOrPhoneInput=document.querySelector("input[name='emailorphone']");

     const emailorphone = emailOrPhoneInput.value.trim();

    console.log(emailorphone)
    if(!emailorphone)return emailOrPhoneError.textContent="Must enter a Email or a phone number here."
    const response=await fetch("/forget-password",{
        method:"Post",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({emailorphone})
    })

    const result=await response.json()
    if(result.errors){
        result.errors.forEach(error=>{
            emailOrPhoneError.textContent=error.message;
        })
    }else{
        showToast(result.message,"success")
        setTimeout(()=>{
            window.location=result.redirectUrl ||"/login"
        },3000) 
    }
    console.log("result of response : ",result)
})