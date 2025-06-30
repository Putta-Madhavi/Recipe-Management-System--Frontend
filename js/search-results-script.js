
document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('results-container');
    const searchQueryDisplay = document.getElementById('search-query-display');
    const noResultsMessage = document.getElementById('no-results-message');
    const errorMessage = document.getElementById('error-message');
    const loadingMessage = document.getElementById('loading-message');

    const searchFormResults = document.getElementById('navbar-search-form-results');
    const searchInputResults = document.getElementById('navbar-search-input-results');

    const urlParams = new URLSearchParams(window.location.search);

    // Collect all possible URL parameters
    const ingredient = urlParams.get('ingredient')?.trim() || null;
    const query = urlParams.get('query')?.trim() || null; // Fallback for ingredient if no ingredient is specified
    const cuisine = urlParams.get('cuisine')?.trim() || null;
    const mealType = urlParams.get('mealType')?.trim() || null;
    const maxCookingTime = urlParams.get('maxCookingTime') || null;
    const dietaryRequirement = urlParams.get('dietaryRequirement')?.trim() || null;

    // Pre-fill search box with ingredient or query if available
    // This ensures the search bar on the results page reflects what was searched
    if (searchInputResults) {
        if (ingredient) {
            searchInputResults.value = ingredient;
        } else if (query) {
            searchInputResults.value = query; 
        }
    }

    const queryParams = new URLSearchParams();
    const displayParts = [];
    let hasActiveSearchParams = false; 

    // Build query parameters for the API call and for display
    // Prioritize 'ingredient' param, then fallback to 'query' for the ingredient search
    if (ingredient) {
        queryParams.append('ingredient', ingredient);
        displayParts.push(`Ingredient: ${ingredient}`);
        hasActiveSearchParams = true;
    } else if (query) {
       
        queryParams.append('ingredient', query);
        displayParts.push(`Ingredient: ${query}`);
        hasActiveSearchParams = true;
    }

    if (cuisine) {
        queryParams.append('cuisine', cuisine);
        displayParts.push(`Cuisine: ${cuisine}`);
        hasActiveSearchParams = true;
    }

    if (mealType) {
        queryParams.append('mealType', mealType);
        displayParts.push(`Meal Type: ${mealType}`);
        hasActiveSearchParams = true;
    }

    if (maxCookingTime) {
        queryParams.append('maxCookingTime', maxCookingTime);
        displayParts.push(`Max Time: ${maxCookingTime} mins`);
        hasActiveSearchParams = true;
    }

    if (dietaryRequirement) {
        queryParams.append('dietaryRequirement', dietaryRequirement);
        displayParts.push(`Dietary: ${dietaryRequirement}`);
        hasActiveSearchParams = true;
    }

    // Display search context or prompt
    if (hasActiveSearchParams) {
        searchQueryDisplay.textContent = `Showing results for: ${displayParts.join(', ')}`;
        fetchRecipes(queryParams.toString()); 
    } else {
        
        searchQueryDisplay.textContent = 'No search performed.';
        loadingMessage.style.display = 'none'; 
        noResultsMessage.textContent = 'Please use the search bar or filters to find recipes.';
        noResultsMessage.style.display = 'block';
    }

    // --- Handle Navbar Search Form Submission on search-results.html ---
    if (searchFormResults) {
        searchFormResults.addEventListener('submit', (e) => {
            e.preventDefault();
            const newQuery = searchInputResults.value.trim();

            const newUrlParams = new URLSearchParams();
            if (newQuery) {
                newUrlParams.append('ingredient', newQuery);
            }
           
            window.location.href = `search-results.html?${newUrlParams.toString()}`;
        });
    }

    // --- Async Function to Fetch Recipes ---
    async function fetchRecipes(queryString) {
        resultsContainer.innerHTML = ''; 
        loadingMessage.style.display = 'block'; 
        noResultsMessage.style.display = 'none';
        errorMessage.style.display = 'none'; 

        try {
            const response = await fetch(`http://localhost:7090/api/recipes/search?${queryString}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const recipes = await response.json();
            loadingMessage.style.display = 'none'; 

            if (recipes.length === 0) {
                noResultsMessage.style.display = 'block';
                noResultsMessage.textContent = 'No recipes found for your search criteria.';
            } else {
                recipes.forEach(recipe => {
                    resultsContainer.appendChild(createRecipeCard(recipe));
                });
            }
        } catch (err) {
            loadingMessage.style.display = 'none';
            errorMessage.style.display = 'block';
            errorMessage.textContent = `Error fetching recipes: ${err.message}`;
            console.error('Fetch error:', err);
        }
    }

    // --- Function to Create Recipe Card ---
    function createRecipeCard(recipe) {
        const rating = recipe.averageRating ? recipe.averageRating.toFixed(1) : 'N/A';
        const card = document.createElement('div');
        card.classList.add('recipe-card');

        card.innerHTML = `
            <div class="recipe-card-header">
                <h3>${recipe.name}</h3>
            </div>
            <div class="recipe-card-image-container">
                <img src="${recipe.imageUrl || 'https://placehold.co/600x400'}" class="recipe-card-image" alt="${recipe.name}">
                <div class="review-badge">
                    ⭐ <span>${rating}</span>
                </div>
            </div>
            <div class="recipe-card-footer">
                <a href="single-recipe.html?id=${recipe.id}" class="recipe-card-button">
                    See Complete Recipe
                </a>
            </div>
        `;
        return card;
    }

    // --- Scroll to Top Functionality ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            scrollToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});