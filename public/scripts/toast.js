// toast.js

function showToast(message, type = "success", duration = 3000) {
  Toastify({
    text: message,
    duration: duration,
    gravity: "top",
    position: 'right',
    backgroundColor: type === "success"
      ? "linear-gradient(to right, #4facfe, #00f2fe)"
      : "linear-gradient(to right, #ff5f6d, #ffc371)",
    close: true,
  }).showToast();
}
