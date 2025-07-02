
document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        cookingSkillLevel: document.getElementById("cookingSkill").value,
        dietaryPreferences: document.getElementById("dietary").value.split(",").map(item => item.trim()),
        allergies: document.getElementById("allergies").value.split(",").map(item => item.trim()),
        avoidIngredients: document.getElementById("avoid").value.split(",").map(item => item.trim())
      };

      if (!data.name || !data.email || !data.password || !data.cookingSkillLevel) {
        showMessage("Please fill in all required fields.", "error");
        return;
      }

      fetch("http://localhost:7090/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        if (response.ok) {
          return response.text(); 
        } else {
          return response.text().then(err => {
            throw new Error(err);
          });
        }
      })
      .then(message => {
        showMessage(message, "success");
        localStorage.setItem('loggedInUser', JSON.stringify({ name: data.name, email: data.email }));
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1000);
      })
      .catch(error => {
        showMessage(error.message || "Registration failed", "error");
      });
    });
  }
});

// Global showMessage to the user 
function showMessage(message, type = "info") {
  let messageBox = document.getElementById("messageBox");
  if (!messageBox) {
    messageBox = document.createElement("div");
    messageBox.id = "messageBox";
    Object.assign(messageBox.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '15px 30px',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      zIndex: '1000',
      fontSize: '16px',
      color: '#fff',
      textAlign: 'center',
      display: 'none',
      opacity: '0',
      transition: 'opacity 0.3s ease-in-out'
    });
    document.body.appendChild(messageBox);
  }

  messageBox.textContent = message;
  messageBox.style.backgroundColor = type === "success" ? "#4CAF50"
    : type === "error" ? "#F44336"
    : "#2196F3";

  messageBox.style.display = 'block';
  setTimeout(() => messageBox.style.opacity = '1', 10);

  setTimeout(() => {
    messageBox.style.opacity = '0';
    setTimeout(() => messageBox.style.display = 'none', 300);
  }, 3000);
}
