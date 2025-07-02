let allRecipes = [];
let currentDisplayedRecipes = [];
let currentIndex = 0; 
const recipesPerPage = 9; 
const API_BASE_URL = "http://localhost:7090";

// Wait for the DOM to be fully loaded

document.addEventListener("DOMContentLoaded", () => {

    // If we are on the page that has the recipe list section, fetch recipes and add category listeners
    if (document.getElementById("all-recipes-section")) {
        fetchAllRecipes();

        // Category filter button click handler
        document.querySelectorAll(".category-button").forEach(button => {
            button.addEventListener("click", event => {
                const categoryName = event.currentTarget.dataset.category;
                document.querySelectorAll(".category-button").forEach(btn => btn.classList.remove("active"));
                event.currentTarget.classList.add("active");
                filterRecipesByCategory(categoryName);
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById("load-more-button");
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener("click", showNextRecipes);
        }
    }

    // Search form elements
    const mainSearchForm = document.getElementById('main-search-form');
    const mainSearchInput = document.getElementById('main-search-input');
    const mainIngredientSelect = document.getElementById('main-ingredient-select');
    const mainMealTypeSelect = document.getElementById('main-meal-type');
    const mainCuisineSelect = document.getElementById('main-cuisine');
    const mainMaxCookingTimeSelect = document.getElementById('main-max-cooking-time');
    const mainDietaryRequirementSelect = document.getElementById('main-dietary-requirement');

    // Main search form submission
    if (mainSearchForm) {
        mainSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();   
            const searchParams = new URLSearchParams();
            const ingredientTextValue = mainSearchInput.value.trim();
            const ingredientSelectValue = mainIngredientSelect.value;
            let finalIngredientValue = '';

            // Preference to typed input over dropdown
            if (ingredientTextValue) {
                finalIngredientValue = ingredientTextValue;
            } else if (ingredientSelectValue) {
                finalIngredientValue = ingredientSelectValue;
            }

            // Add filters if selected
            if (finalIngredientValue) searchParams.append('ingredient', finalIngredientValue);
            if (mainMealTypeSelect.value) searchParams.append('mealType', mainMealTypeSelect.value);
            if (mainCuisineSelect.value) searchParams.append('cuisine', mainCuisineSelect.value);
            if (mainMaxCookingTimeSelect.value) searchParams.append('maxCookingTime', mainMaxCookingTimeSelect.value);
            if (mainDietaryRequirementSelect.value) searchParams.append('dietaryRequirement', mainDietaryRequirementSelect.value);

            // Redirect to results page
            const queryString = searchParams.toString();
            window.location.href = `search-results.html${queryString ? '?' + queryString : ''}`;
        });
    }

    // Advanced search modal open/close
    const advOpen = document.getElementById('open-advanced-search-modal-btn');
    const advModal = document.getElementById('advanced-search-modal');
    const advClose = document.getElementById('close-advanced-search');

    if (advOpen) advOpen.addEventListener('click', () => advModal.style.display = 'block');
    if (advClose) advClose.addEventListener('click', () => advModal.style.display = 'none');

    window.addEventListener('click', e => {
        if (e.target === advModal) advModal.style.display = 'none';
    });

    // Advanced search form
    const advForm = document.getElementById('advanced-search-form');
    if (advForm) {
        advForm.addEventListener('submit', e => {
            e.preventDefault();
            const data = new FormData(advForm);
            const params = new URLSearchParams();
            let has = false;
            for (let [k, v] of data.entries()) {
                if (v.trim()) {
                    params.append(k, v.trim());
                    has = true;
                }
            }
            if (has) {
                window.location.href = `search-results.html?${params.toString()}`;
                advModal.style.display = 'none';
            } else {
                alert('Enter at least one search criterion!');
            }
        });
    }

    // Scroll to top button
    const scrollBtn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', () => {
        if (scrollBtn) scrollBtn.style.display = window.scrollY > 200 ? 'block' : 'none';
    });
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Highlight current nav link
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        const target = link.getAttribute('href').split('/').pop();
        if ((currentPage === '' || currentPage === 'index.html') && (target === '' || target === '#' || target === 'index.html')) {
            link.classList.add('active');
        } else if (target === currentPage) {
            link.classList.add('active');
        }
    });

    // Display logged-in user name
    const userData = localStorage.getItem('loggedInUser');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            const userDisplay = document.getElementById('navbar-username');
            if (userDisplay) {
                userDisplay.textContent = `Welcome, ${user.name}`;
                userDisplay.style.display = 'inline-block';
            }
        } catch (err) {
            console.error("Error parsing user data", err);
        }
    }

    // Logout link click handler
    const logoutLink = document.querySelector('.logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            sessionStorage.clear();
            window.location.href = 'index.html';
        });
    }
});

// Fetch recipes from backend
function fetchAllRecipes() {
    const container = document.getElementById("all-recipes-section");
    const loadMoreBtn = document.getElementById("load-more-button");
    if (!container) return;

    container.innerHTML = '<p style="text-align:center;grid-column:1/-1">Loading recipes...</p>';

    fetch(`${API_BASE_URL}/api/recipes`)
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            return res.json();
        })
        .then(data => {
            allRecipes = data;
            currentDisplayedRecipes = allRecipes;
            currentIndex = 0;
            container.innerHTML = "";
            showNextRecipes();

            if (loadMoreBtn) loadMoreBtn.style.display = data.length > recipesPerPage ? "block" : "none";
        })
        .catch(err => {
            console.error("Error fetching recipes", err);
            container.innerHTML = "<p style='text-align:center;grid-column:1/-1'>Error loading recipes.</p>";
            if (loadMoreBtn) loadMoreBtn.style.display = "none";
        });
}

// Filter by category
function filterRecipesByCategory(category) {
    const container = document.getElementById("all-recipes-section");
    const loadMoreBtn = document.getElementById("load-more-button");
    if (!container) return;

    currentDisplayedRecipes = category === "All Types" ? allRecipes : allRecipes.filter(r => r.category === category);
    currentIndex = 0;
    container.innerHTML = "";
    showNextRecipes();

    if (loadMoreBtn) loadMoreBtn.style.display = currentDisplayedRecipes.length > recipesPerPage ? "block" : "none";
    if (currentDisplayedRecipes.length === 0) {
        container.innerHTML = `<p style="text-align:center;grid-column:1/-1">No recipes found for \"${category}\".</p>`;
    }
}

// Show next batch of recipes (pagination)
function showNextRecipes() {
    const container = document.getElementById("all-recipes-section");
    const loadMoreBtn = document.getElementById("load-more-button");
    if (!container) return;

    const nextBatch = currentDisplayedRecipes.slice(currentIndex, currentIndex + recipesPerPage);
    nextBatch.forEach(recipe => container.appendChild(createRecipeCard(recipe)));
    currentIndex += recipesPerPage;

    if (loadMoreBtn) loadMoreBtn.style.display = currentIndex >= currentDisplayedRecipes.length ? "none" : "block";
}

// Generate HTML for a single recipe card
function createRecipeCard(recipe) {
    const rating = (recipe.averageRating != null && !isNaN(recipe.averageRating)) ? recipe.averageRating.toFixed(1) : 'N/A';
    const dietary = recipe.dietaryRequirements ? `<p><strong>Dietary:</strong> ${recipe.dietaryRequirements}</p>` : '';

    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
        <div class="recipe-card-header"><h3>${recipe.name}</h3></div>
        <div class="recipe-card-image-container">
            <img src="${recipe.imageUrl || 'https://placehold.co/600x400'}" class="recipe-card-image" alt="${recipe.name}">
            <div class="review-badge">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                <span>${rating}</span>
            </div>
        </div>
        <div class="recipe-card-content" style="padding:10px 15px;">
            ${dietary}
        </div>
        <div class="recipe-card-footer">
            <a href="single-recipe.html?id=${recipe.id}" class="recipe-card-button">
                See Complete Recipe
                <svg class="chef-hat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M7 10h10v3l-1.5 2h-7L7 13v-3z"/>
                    <path d="M10 7L12 5L14 7"/>
                </svg>
            </a>
        </div>
    `;
    return card;
}
