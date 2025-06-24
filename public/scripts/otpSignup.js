document.addEventListener("DOMContentLoaded", function () {
  const resendBtn = document.getElementById("resendBtn");
  const countdown = document.getElementById("countdown");
  const timerText = document.getElementById("timerText");
  const otpForm = document.getElementById("otpForm");

  let timerInterval = null;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function startTimerFromExpiry(expiryTimestamp) {
    if (timerInterval) clearInterval(timerInterval);

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.floor((expiryTimestamp - now) / 1000);

      if (remaining > 0) {
        timerText.classList.remove("d-none");
        resendBtn.classList.add("d-none");
        countdown.textContent = formatTime(remaining);
      } else {
        clearInterval(timerInterval);
        timerText.classList.add("d-none");
        resendBtn.classList.remove("d-none");
      }
    };

    updateTimer();
    timerInterval = setInterval(updateTimer, 1000);
  }

  // ⏱️ Start with OTP expiry from server
const initialExpiry = new Date(window.OTP_EXPIRY).getTime();



  console.log(window.OTP_EXPIRY)
  startTimerFromExpiry(initialExpiry);

  // 🔁 Resend OTP
  resendBtn.addEventListener("click", () => {
    fetch("/resend-otp", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.success && data.otpExpiry) {
          window.OTP_EXPIRY = data.otpExpiry;
          startTimerFromExpiry(data.otpExpiry);
          location.reload()
        }
      })
      .catch((error) => {
        console.error("Resend error:", error);
        alert("Failed to resend OTP");
      });
  });

  // ✅ OTP Form Submission
  otpForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const otp = document.getElementById("otp").value.trim();
    const otpError = document.getElementById("otpError");
    otpError.innerText = "";

    if (otp.length !== 6) {
      return (otpError.innerText = "Please enter a valid 6-digit OTP.");
    }

    fetch("/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          otpError.innerText = data.message || "Invalid OTP";
        } else {
          clearInterval(timerInterval);
          alert("OTP Verified Successfully");
          window.location.href = "/dashboard";
        }
      })
      .catch((error) => {
        console.error("Verification error:", error);
        otpError.innerText = "Network error occurred";
      });
  });
});
