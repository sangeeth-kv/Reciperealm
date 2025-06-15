const resendBtn = document.getElementById("resendBtn");
    const countdown = document.getElementById("countdown");
    const timerText = document.getElementById("timerText");
    const otpForm = document.getElementById("otpForm");

    // Get or initialize start time
    const key = "otpCountdownStart";
    let startTime = localStorage.getItem(key);
    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem(key, startTime);
    }

    function updateTimer() {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      const remaining = 60 - elapsed;

      if (remaining > 0) {
        countdown.textContent = remaining;
        resendBtn.classList.add("d-none");
        timerText.classList.remove("d-none");
      } else {
        timerText.classList.add("d-none");
        resendBtn.classList.remove("d-none");
        clearInterval(timerInterval);
      }
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();

    resendBtn.addEventListener("click", () => {
      localStorage.setItem(key, Date.now()); // reset timer
      resendBtn.classList.add("d-none");
      timerText.classList.remove("d-none");
      updateTimer();

      // 👇 You can call your resend OTP backend here
      fetch("/resend-otp", { method: "POST" })
        .then(res => res.json())
        .then(data => alert(data.message || "OTP resent"))
        .catch(() => alert("Something went wrong"));
    });

    otpForm.addEventListener("submit", function (e) {
      e.preventDefault();

      document.getElementById("otpError").innerText = "";

      const otp = document.getElementById("otp").value.trim();

      fetch("/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp })
      })
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            document.getElementById("otpError").innerText = data.message || "Invalid OTP";
          } else {
            alert("OTP Verified Successfully");
            localStorage.removeItem(key); // clear timer
            window.location.href = "/dashboard";
          }
        });
    });
