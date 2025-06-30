# The Recipe Hub: Recipe Management System

# Description

The Recipe Hub is a personalized recipe management system that allows users to register, create profiles, 
and discover recipes based on their dietary preferences, allergies, ingredient availability, and cooking 
habits. Users can search recipes by cuisine, meal type, or cooking time, and leave ratings and reviews on 
recipes they’ve tried. 
Originally built using Spring Boot and MySQL for the backend, the application uses HTML, CSS, and 
JavaScript for the frontend. Recipe data is fetched from a structured database with optional support for 
external APIs. Performance is enhanced with basic caching techniques, and the entire system is designed 
to be modular and scalable. 

## Table of Contents

* [Features](#-features)
* [Features](#-Description)
* [Tech Stack](#-Tech-stack)
* [Demo and Links](#-demo-and-links)
* [ Running the Project Locally](#️-running-the-project-locally)
    * [Step 1: Prerequisites](#step-1-prerequisites)
    * [Step 2: Backend Setup (Spring Boot)](#step-2-backend-setup-spring-boot)
    * [Step 3: Frontend Setup (HTML/CSS/JS)](#step-3-frontend-setup-htmlcssjs)
    * [Step 4: Frontend-Backend Connection](#step-4-frontend-backend-connection)
* [ Testing the Application](#-testing-the-application)
* [ Screenshots](#-screenshots)
* [ Conclusion](#-conclusion)


## Features

* **User Registration and Login:** Securely register and log in to personal accounts. Users can specify dietary preferences (vegetarian, vegan, keto), allergies (gluten, dairy, nuts), cooking skill level, and preferred/avoided ingredients for personalized recipe recommendations.
* **Search and Filtering:** Efficiently search for recipes using keywords and apply various filters such as cuisine (Indian, Chinese), meal type (breakfast, lunch, dinner), cooking time, and dietary preferences.
* **Recipe Ratings and Reviews:** Rate recipes on a 1-5 star scale and provide written reviews to share feedback. Each recipe page displays the average rating and user reviews to aid in decision-making.
* **Add Recipes:** Users can contribute their own recipes by providing a title, ingredients, instructions, and categorizing them with appropriate cuisine, meal type, and dietary tags.
* **Recipe Database Integration:** All recipes are stored in a structured MySQL database, containing essential information like title, ingredients, instructions, cooking time, cuisine type, meal type, and dietary classification for efficient retrieval and display.


## Tech Stack

* **Frontend:** HTML, CSS, JavaScript (for building the responsive and interactive user interface)
* **Backend:** Spring Boot (Java) (for building RESTful APIs and handling business logic)
* **Database:** MySQL (for storing user profiles, recipe data, ratings, and reviews)
* **API Testing:** Postman (for testing API endpoints and verifying request/response cycles)


## Demo and Links

* **Demo Video:** [https://github.com/Putta-Madhavi/Recipe-Management-System--DemoVedio](https://github.com/Putta-Madhavi/Recipe-Management-System--DemoVedio)
* **GitHub Repository - Frontend:** [https://github.com/Putta-Madhavi/Recipe-Management-System--Frontend/tree/master](https://github.com/Putta-Madhavi/Recipe-Management-System--Frontend/tree/master)
* **GitHub Repository - Backend:** [https://github.2com/Putta-Madhavi/Recipe-Management-System--Backend/tree/master](https://github.com/Putta-Madhavi/Recipe-Management-System--Backend/tree/master)


## Running the Project Locally

Follow these steps to set up and run the Recipe Hub on your local machine.

### Step 1: Prerequisites

Ensure you have the following installed:

* **Java JDK 17 or above**
* **Spring Boot Install**
* **MySQL server running** (with a database created for the project)
* **Code editor** (e.g., VS Code)
* **Postman** (for API testing)

### Step 2: Backend Setup (Spring Boot)

1.  **Create Database:**
    Open MySQL and create a database for the project.

2.  **Update `application.properties`:**
    Configure your database connection details in `src/main/resources/application.properties` within the backend project.

3.  **Run the Application:**
    Open the backend project in your IDE (e.g., IntelliJ IDEA, VS Code with Java extensions) and run the application.
    You can typically do this from your terminal within the backend project directory using:
    ```bash
    mvn spring-boot:run
    

4.  **Access Backend:**
    The backend APIs will be accessible at: `http://localhost:8080/`

### Step 3: Frontend Setup (HTML/CSS/JS)

1.  **Open the Frontend Folder in VS Code:**
    Navigate to the folder where your `index.html` file is located within VS Code.

2.  **Install Live Server Extension:**
    * Go to the **Extensions** tab in VS Code (Ctrl+Shift+X or Cmd+Shift+X).
    * Search for "Live Server" and click **Install**.

3.  **Run the Frontend Locally:**
    * Right-click on `index.html` in your VS Code explorer.
    * Select "Open with Live Server".
    * The site will open in your default browser (e.g., `http://127.0.0.1:5500`).

### Step 4: Frontend-Backend Connection

Ensure your frontend API calls are directed to the correct backend endpoint. The frontend is configured to point to:
`http://localhost:8080/api/recipes`


## Testing the Application

* Test user registration, recipe submission, search, and reviews directly from the frontend user interface.
* Use Postman or your browser's developer tools to thoroughly test individual backend API endpoints and verify request/response cycles.


##  Screenshots

*(Include your screenshots here, perhaps with headings like "Login Screen," "Recipe Search," "Add Recipe," etc. You'll need to embed these as images in your actual GitHub README using Markdown image syntax, e.g., `![Alt text for screenshot](path/to/your/image.png)`)*


## Conclusion

The Recipe Hub is a complete recipe management system that demonstrates the seamless integration of a responsive frontend with a powerful Spring Boot backend and a MySQL database. It empowers users to register, personalize their experience, search for recipes, and contribute their own, making it a dynamic and user-centric platform for culinary enthusiasts.
