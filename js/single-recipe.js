document.addEventListener("DOMContentLoaded", async () => {
    const recipeDetailSection = document.getElementById("recipe-detail-section");
    const loadingMessage = recipeDetailSection.querySelector(".loading-message");

    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    if (!recipeId) {
        loadingMessage.textContent = "No recipe ID found in URL. Please provide a valid recipe ID.";
        loadingMessage.style.color = "red";
        return;
    }

    try {
        // 1. Fetch Recipe Details
        const recipeResponse = await fetch(`http://localhost:7090/api/recipes/${recipeId}`);
        if (!recipeResponse.ok) {
            const errorDetail = await recipeResponse.text();
            throw new Error(`Failed to fetch recipe: ${recipeResponse.status} ${recipeResponse.statusText}. Detail: ${errorDetail}`);
        }
        const recipe = await recipeResponse.json();

        // 2. Fetch Reviews for this Recipe
        const reviewsResponse = await fetch(`http://localhost:7090/api/reviews/recipe/${recipeId}`);
        let reviews = [];
        if (reviewsResponse.ok) {
            reviews = await reviewsResponse.json();
        } else {
            const errorDetail = await reviewsResponse.text();
            console.warn(`Failed to fetch reviews for recipe ${recipeId}: ${reviewsResponse.status} ${reviewsResponse.statusText}. Detail: ${errorDetail}`);
        }

        loadingMessage.style.display = 'none'; 

        // Generate Ingredients List with interactive checkboxes
        const ingredientsList = Array.isArray(recipe.ingredients)
            ? recipe.ingredients.map(i => `
                <li>
                    <label class="checkbox-container">
                        <input type="checkbox" class="ingredient-checkbox">
                        <span class="checkmark"></span>
                        ${i}
                    </label>
                </li>
            `).join('')
            : recipe.ingredients?.split(',').map(i => `
                <li>
                    <label class="checkbox-container">
                        <input type="checkbox" class="ingredient-checkbox">
                        <span class="checkmark"></span>
                        ${i.trim()}
                    </label>
                </li>
            `).join('') || '';

        // Generate Instructions List 
        const instructionsList = Array.isArray(recipe.instructions)
            ? recipe.instructions.map(i => `<li>${i}</li>`).join('')
            : recipe.instructions?.split('.').map(i => i.trim()).filter(Boolean).map(i => `<li>${i}</li>`).join('') || '';

        // Generate Reviews HTML
        const reviewsHtml = reviews.length > 0
            ? reviews.map(review => `
                <div class="review-item">
                    <div class="review-header">
                        <span class="reviewer-name">${review.userName || 'Anonymous User'}</span>
                        <span class="review-rating">${'⭐'.repeat(review.rating || 0)}</span>
                    </div>
                    <p class="review-text">${review.comment || review.reviewText || 'No comment provided.'}</p>
                    <span class="review-date">${new Date(review.date || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            `).join('')
            : '<p class="no-reviews-message">No reviews yet. Be the first to share your experience!</p>';


        // Inject all content into the recipe detail section
        recipeDetailSection.innerHTML = `
            <h1>${recipe.name}</h1>
            <img src="${recipe.imageUrl || 'https://via.placeholder.com/250x180/EEEEEE/999999?text=Recipe+Image'}" alt="${recipe.name}" class="recipe-image" onerror="this.src='https://via.placeholder.com/250x180/EEEEEE/999999?text=Recipe+Image';">
            
            <div class="details-grid">
                <div class="detail-item"><strong>Cuisine:</strong> ${recipe.cuisine || 'N/A'}</div>
                <div class="detail-item"><strong>Meal Type:</strong> ${recipe.mealType || 'N/A'}</div>
                <div class="detail-item"><strong>Category:</strong> ${recipe.category || 'N/A'}</div>
                <div class="detail-item"><strong>Cooking Time:</strong> ${recipe.cookingTime || 'N/A'} mins</div>
                <div class="detail-item"><strong>Rating:</strong> ${recipe.averageRating || 'N/A'} ⭐</div>
            </div>
            <h2>Ingredients</h2>
            <ul class="ingredient-list">${ingredientsList}</ul>
            <h2>Instructions</h2>
            <ol class="instructions-list">${instructionsList}</ol>

            <div class="reviews-section">
                <h2>Reviews</h2>
                <div class="review-list">
                    ${reviewsHtml}
                </div>

                <h3>Submit Your Review</h3>
                <form id="review-form" class="review-form">
                    <div class="form-group">
                        <label for="review-rating">Rating:</label>
                        <select id="review-rating" required>
                            <option value="">-- Select a rating --</option>
                            <option value="1">1 ⭐</option>
                            <option value="2">2 ⭐⭐</option>
                            <option value="3">3 ⭐⭐⭐</option>
                            <option value="4">4 ⭐⭐⭐⭐</option>
                            <option value="5">5 ⭐⭐⭐⭐⭐</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="review-comment">Your Review:</label>
                        <textarea id="review-comment" rows="5" placeholder="Share your thoughts about this recipe..."></textarea>
                    </div>
                    <button type="submit" class="submit-review-btn">Submit Review</button>
                    <div id="review-message" class="review-message"></div>
                </form>
            </div>
        `;

        // Add event listener for review submission AFTER HTML is injected
        const reviewForm = document.getElementById('review-form');
        if (reviewForm) {
            reviewForm.addEventListener('submit', async (event) => {
                event.preventDefault(); 

                const rating = document.getElementById('review-rating').value;
                const comment = document.getElementById('review-comment').value;
                const reviewMessage = document.getElementById('review-message');

                if (!rating) {
                    reviewMessage.textContent = "Please select a rating.";
                    reviewMessage.style.color = "red";
                    return;
                }

             
                const userId = 1; 
                if (!userId) {
                    reviewMessage.textContent = "Error: User ID not found. Cannot submit review.";
                    reviewMessage.style.color = "red";
                    return;
                }
                if (!recipeId) { 
                    reviewMessage.textContent = "Error: Recipe ID not available for review submission.";
                    reviewMessage.style.color = "red";
                    return;
                }

                try {
                    // Append both userId and recipeId as query parameters to the URL
                    const submitResponse = await fetch(`http://localhost:7090/api/reviews?userId=${userId}&recipeId=${recipeId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                           
                        },
                        body: JSON.stringify({
                            rating: parseInt(rating),
                            comment: comment,
                            date: new Date().toISOString().split('T')[0]
                        })
                    });

                    if (!submitResponse.ok) {
                        const errorText = await submitResponse.text();
                        throw new Error(`Failed to submit review: ${submitResponse.status} ${submitResponse.statusText} - ${errorText}`);
                    }

                    reviewMessage.textContent = "Review submitted successfully!";
                    reviewMessage.style.color = "green";
                    reviewForm.reset();

                 
                    setTimeout(() => {
                        
                        window.location.reload();
                    }, 1000); 

                } catch (error) {
                    console.error("Error submitting review:", error);
                    reviewMessage.textContent = `Error: ${error.message || "Could not submit review."}`;
                    reviewMessage.style.color = "red";
                }
            });
        }

    } catch (error) {
        console.error("Critical error during recipe or reviews fetching:", error);
        loadingMessage.textContent = `Failed to load recipe details. Please try again later. Error: ${error.message}`;
        loadingMessage.style.color = "red";
    }
});