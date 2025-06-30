document.addEventListener('DOMContentLoaded', async () => {
    // Function to fetch and inject HTML
    async function includeHTML(elementId, filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                // If the file is not found (404) or other HTTP error
                throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
            }
            const html = await response.text();
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = html;
            } else {
                console.error(`Placeholder element with ID '${elementId}' not found.`);
            }
        } catch (error) {
            console.error(`Error including ${filePath}:`, error);
            const element = document.getElementById(elementId);
            if (element) {
                element.innerHTML = `<p style="color: red;">Error loading ${elementId}. Please check the path: ${filePath}</p>`;
            }
        }
    }

    // Determine the base path for components relative to the current HTML file
    // Assuming 'login.html' is in 'pages/' and 'components/' is one level up.
    // If 'components' is at the root, and 'pages' is a sibling to 'js',
    // then from 'pages/login.html' you need to go up one level (..) then into 'components/'
    const basePath = '../components/'; 

    // Load Header
    await includeHTML('navbar-placeholder', `${basePath}header.html`);

    // Load Footer
    await includeHTML('footer-placeholder', `${basePath}footer.html`);

    
    const currentPage = window.location.pathname.split('/').pop(); 
    const navLinks = document.querySelectorAll('#navbar-placeholder .nav-link');
    navLinks.forEach(link => {
        // Remove 'active' from all first
        link.classList.remove('active');
        // Add 'active' to the link matching the current page
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else if (currentPage === 'index.html' && linkPage === '') { 
             link.classList.add('active');
        }
    });

   
});