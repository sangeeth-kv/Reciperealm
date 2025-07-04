document.getElementById("signupForm").addEventListener("submit", function (e) {
  e.preventDefault();


  document.querySelectorAll(".error-message").forEach((el) => (el.innerText = ""));
  let valid = true;

  const fullname = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (fullname === "") {
    document.getElementById("fullnameError").innerText = "Fullname is required";
    valid = false;
  }

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    document.getElementById("emailError").innerText = "Invalid email address";
    valid = false;
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    document.getElementById("phoneError").innerText = "Enter a valid 10-digit phone number";
    valid = false;
  }

  if (password.length < 6) {
    document.getElementById("passwordError").innerText = "Password must be at least 6 characters";
    valid = false;
  }

  if (password !== confirmPassword) {
    document.getElementById("confirmPasswordError").innerText = "Passwords do not match";
    valid = false;
  }

  if (!valid) return;

  document.getElementById("submitBtn").disabled=true

  fetch("/accounts/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fullname, email, phone, password, confirmPassword }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success && data.errors) {
        document.getElementById("submitBtn").disabled=false
        data.errors.forEach((err) => {
            console.log(err)
          const errorDiv = document.getElementById(`${err.field}Error`);
          if (errorDiv) errorDiv.innerText = err.message;
        });
      } else {
        if(data.success){
            showToast(data.message, "success");
             setTimeout(()=>{
            window.location.href = "/accounts/sign-up/otp";
            },3000) // redirect or show success
        }else{
            showToast(data.message,"error");
            if(data.redirectUrl){
              setTimeout(()=>{
                window.location=data.redirectUrl
              },3000)
            }
        }
        // showToast(`we have sent an OTP to ${email}, please verify that !`, "success")
       
      }
    })
    .catch((err) => {
      console.error("Signup error:", err);
    });
});
