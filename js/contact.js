// js/contact.js

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); 

            // Clear previous messages and reset styling
            formMessage.style.display = 'none';
            formMessage.textContent = '';
            formMessage.classList.remove('success', 'error');

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic client-side validation for all fields and email format
            if (!name || !email || !subject || !message) {
                displayMessage('All fields are required!', 'error');
                return;
            }

            if (!validateEmail(email)) {
                displayMessage('Please enter a valid email address.', 'error');
                return;
            }

            console.log('Form Submitted (Mock):', { name, email, subject, message });
            displayMessage('Your message has been sent successfully! Redirecting...', 'success');
            contactForm.reset();

            // Redirect to the home page after a short delay
            setTimeout(() => {
                window.location.href = '../index.html';
            }, 2000);
        });
    }

    // Helper function to display form messages (success/error)
    function displayMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `message-box ${type}`;
        formMessage.style.display = 'block';
    }

    // Helper function to validate email format using a regular expression
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});