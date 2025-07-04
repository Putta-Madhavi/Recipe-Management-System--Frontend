document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      showMessage("Both fields are required.", "error");
      return;
    }

    try {
      const resp = await fetch("http://localhost:7090/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const msg = await resp.text();
      if (resp.ok) {
        localStorage.setItem("loggedInUserEmail", email);
        showMessage("Login successful!", "success");
        setTimeout(() => window.location.href = "../index.html", 1000);
      } else {
        showMessage(msg, "error");
      }
    } catch (err) {
      console.error(err);
      showMessage("Server error, try later", "error");
    }
  });

  // --- ADD GOOGLE LOGIN BUTTON EVENT LISTENER HERE ---
  const googleLoginButton = document.getElementById("google-login-button");
  if (googleLoginButton) {
    googleLoginButton.addEventListener("click", function() {
      window.location.href = 'http://localhost:7090/auth/google'; 
    });
  }

});

function showMessage(message, type = "info") {
  let messageBox = document.getElementById("messageBox");
  if (!messageBox) {
    messageBox = document.createElement("div");
    messageBox.id = "messageBox";
    Object.assign(messageBox.style, {
      position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
      padding: '15px 30px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      zIndex: '1000', fontSize: '16px', color: '#fff', textAlign: 'center',
      display: 'none', opacity: '0', transition: 'opacity 0.3s ease-in-out'
    });
    document.body.appendChild(messageBox);
  }
  messageBox.textContent = message;
  messageBox.style.backgroundColor = type === "success" ? '#4CAF50' : type === "error" ? '#F44336' : '#2196F3';
  messageBox.style.display = 'block';
  setTimeout(() => messageBox.style.opacity = '1', 10);
  setTimeout(() => {
    messageBox.style.opacity = '0';
    setTimeout(() => messageBox.style.display = 'none', 300);
  }, 3000);
}
