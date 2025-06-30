 document.getElementById("toggleNewPassword").addEventListener("click", function () {
        const input = document.getElementById("newPassword");
        input.type = input.type === "password" ? "text" : "password";
        this.classList.toggle("fa-eye-slash");
    });

    // Toggle visibility for Confirm Password
    document.getElementById("toggleConfirmPassword").addEventListener("click", function () {
        const input = document.getElementById("confirmPassword");
        input.type = input.type === "password" ? "text" : "password";
        this.classList.toggle("fa-eye-slash");
    });

document.getElementById("reset-password-form").addEventListener("submit",(e)=>{
    e.preventDefault()

    let valid=true

    const passwordError=document.getElementById("passwordError")
    const confirmPasswordError=document.getElementById("confirmPasswordError")
    const password=document.getElementById("newPassword").value.trim()
    const confirmPassword=document.getElementById("confirmPassword").value.trim()

    passwordError.textContent=""
    confirmPasswordError.textContent=""

    if (password.length < 6) {
    passwordError.innerText = "Password must be at least 6 characters";
    valid = false;
  }


  if (password !== confirmPassword) {
    confirmPasswordError.innerText = "Passwords do not match";
    valid = false;
  }

   if (!valid) return;

   fetch("/accounts/reset-password",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({password,confirmPassword})
   })
   .then((res)=>res.json())
   .then((data)=>{
        if(!data.success&&data.errors){
            data.errors.forEach(error=>{
                console.log(error)
                const errorDiv= document.getElementById(`${error.field}Error`);
                if(errorDiv) errorDiv.innerText = error.message;
            })
        }else{
            if(!data.success){
                showToast(data.message,"error")
                setTimeout(()=>{
                    window.location.href=data.redirectUrl
                },2000)
            }else{
                showToast(data.message,"success")
                setTimeout(()=>{
                    window.location.href=data.redirectUrl
                },2000)
            }
        }
   })

})