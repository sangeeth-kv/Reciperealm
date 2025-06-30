// public/scripts/login.js

document.addEventListener("DOMContentLoaded", () => {


  const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get('error');

if (error === 'user_not_found') {
  showToast("No account found with your Facebook email","error")
  setTimeout(()=>{
    window.location.href="/accounts/login"
  },2000)
}



  const form = document.getElementById("login-form");
  const emailOrPhoneInput = document.querySelector("input[name='emailorphone']");
  const passwordInput = document.querySelector("input[name='password']");
  const emailOrPhoneError = document.getElementById("emailorphoneError");
  const passwordError = document.getElementById("passwordError");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Clear previous errors
    emailOrPhoneError.textContent = "";
    passwordError.textContent = "";

    const emailorphone = emailOrPhoneInput.value.trim();
    const password = passwordInput.value.trim();

    try {
      const res = await fetch("/accounts/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ emailorphone, password })
      });

      const data = await res.json();

      console.log(" data is : ",data)

      if (!res.ok) {
        if (data.errors) {
          data.errors.forEach(error => {
            if (error.field === "emailorphone") emailOrPhoneError.textContent = error.message;
            if (error.field === "password") passwordError.textContent = error.message;
          });
        } else if (data.message) {
          passwordError.textContent = data.message; // fallback generic error
        }
      } else {
        window.location.href = data.redirectUrl || "/dashboard";
      }
    } catch (err) {
      console.error("Login error:", err);
      passwordError.textContent = "Something went wrong. Please try again.";
    }
  });
});
