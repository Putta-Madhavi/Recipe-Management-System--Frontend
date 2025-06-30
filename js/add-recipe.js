
document.addEventListener("DOMContentLoaded", function () {
    // Load header
    fetch("../components/header.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("header-placeholder").innerHTML = data;
        })
        .catch(error => console.error('Error loading header:', error));

    // Load footer
    fetch("../components/footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        })
        .catch(error => console.error('Error loading footer:', error));
    const form = document.getElementById('recipeForm');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const messageDiv = document.getElementById('message');
            messageDiv.textContent = '';
            messageDiv.classList.remove('success', 'error');

            const recipe = {
                name: form.name.value,
                cuisine: form.cuisine.value,
                mealType: form.mealType.value,
                cookingTime: parseInt(form.cookingTime.value),
                category: form.category.value,
                ingredients: form.ingredients.value.trim(),
                instructions: form.instructions.value,
                nutritionalInfo: form.nutritionalInfo.value,
                averageRating: parseFloat(form.averageRating.value) || 0,
                reviews: [],
                imageUrl: form.imageUrl.value.trim() 
            };


            try {
                const response = await fetch('http://localhost:7090/api/recipes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(recipe)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('Recipe added:', result);
                    messageDiv.textContent = '✅ Recipe added successfully! Redirecting to home...';
                    messageDiv.classList.add('success');

                    // Clear form fields
                    form.reset();

                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500);
                } else {
                    const errorText = await response.text();
                   
                    messageDiv.textContent = `❌ Error: ${errorText || response.statusText}`;
                    messageDiv.classList.add('error');
                    console.error('Error response:', response.status, errorText);
                }
            } catch (error) {
                console.error('Fetch error:', error);
                messageDiv.textContent = '❌ Network error or backend unavailable.';
                messageDiv.classList.add('error');
            }
        });
    }
});