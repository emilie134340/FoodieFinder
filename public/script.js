let currentCard = 0;
const restaurants = [];

let filteredRestaurants = [...restaurants];
let favorites = [];

// User Preferences
let userPreferences = {
  cuisine: [],
  dietaryRestrictions: [],
  price_range: ''
};

const quizQuestions = [
  {
    question: 'What cuisines do you prefer?',
    type: 'multiple',
    options: ['Italian', 'Mexican', 'Sushi', 'Indian', 'Thai', 'American', 'Hawaiian', 'Fast Food', 'Barbecue', 'French', 'Café', 'Deli', 'Pizza'],
    key: 'cuisine'
  },
  {
    question: 'Do you have any dietary restrictions?',
    type: 'multiple',
    options: ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'],
    key: 'dietaryRestrictions'
  },
  {
    question: 'What\'s your preferred price range?',
    type: 'single',
    options: ['$', '$$', '$$$', '$$$$'],
    key: 'price_range'
  }
];

// Page Navigation
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  document.getElementById(`${pageId}-page`).classList.add('active');
  
  if (pageId === 'favorites') {
    displayFavorites();
  }
}

// Filter Functionality
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const cuisine = btn.dataset.cuisine;
    filteredRestaurants = cuisine === 'all' 
      ? [...restaurants]
      : restaurants.filter(r => r.cuisine.toLowerCase() === cuisine);
    
    currentCard = 0;
    updateCard();
  });
});

// Search Functionality
function searchRestaurants(query) {
  const searchResults = restaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
    restaurant.cuisine.toLowerCase().includes(query.toLowerCase())
  );
  
  displaySearchResults(searchResults);
}

async function fetchAndDisplayResults() {
  const searchResultsDiv = document.getElementById('search-results');

  try {
    const response = await fetch('https://btrgiewhu8.execute-api.us-east-1.amazonaws.com/items');

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    // Save the fetched data to `restaurants` and `filteredRestaurants`
    restaurants.length = 0;
    restaurants.push(...data);
    filteredRestaurants = [...restaurants]; // Initialize with all restaurants
    
    // Display the initial results
    displaySearchResults(filteredRestaurants);
    updateCard(); // Display the first card

  } catch (error) {
    console.error('Error fetching data:', error);
    searchResultsDiv.innerHTML = `<p>Failed to load restaurant data. Please try again later.</p>`;
  }
}




function displaySearchResults(results) {
  const searchResultsDiv = document.getElementById('search-results');
  searchResultsDiv.innerHTML = results.map(restaurant => `
    <div class="restaurant-card" style="position: static; margin-bottom: 1rem;">
      <div class="card-image" style="background-image: url('https://source.unsplash.com/random/800x600/?restaurant,${restaurant.cuisine.toLowerCase()}')"></div>
      <div class="card-content">
        <h2 class="restaurant-name">${restaurant.name}</h2>
        <div class="restaurant-details">
          <span>${restaurant.cuisine}</span>
          <span>${restaurant.price_range}</span>
          <span>${restaurant.location}</span>
        </div>
        <div class="rating">
          <i class="ph ph-star-fill"></i>
          <span>${restaurant.description}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// Call the function to load and display the data
fetchAndDisplayResults().then(updateCard); // Initialize the card after data is fetched



// Favorites Functionality
function toggleFavorite(restaurant) {
  const index = favorites.findIndex(f => f.name === restaurant.name);
  if (index === -1) {
    favorites.push(restaurant);
  } else {
    favorites.splice(index, 1);
  }
  displayFavorites();
}

function displayFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = favorites.length ? favorites.map(restaurant => `
    <div class="favorite-card">
      <img src="https://source.unsplash.com/random/800x600/?restaurant,${restaurant.cuisine.toLowerCase()}" 
           alt="${restaurant.name}" />
      <div class="favorite-content">
        <h3>${restaurant.name}</h3>
        <p>${restaurant.cuisine} • ${restaurant.price_range}</p>
        <div class="rating">
          <i class="ph ph-star-fill"></i>
          <span>${restaurant.description}</span>
        </div>
      </div>
    </div>
  `).join('') : '<p>No favorites yet! Start exploring restaurants to add some.</p>';
}

// Profile Functionality
function openSettings() {
  alert('Settings functionality coming soon!');
}

// Quiz Functionality
function openQuiz() {
  const modal = document.createElement('div');
  modal.className = 'quiz-modal';
  modal.innerHTML = `
    <div class="quiz-content">
      <h2>Preferences Quiz</h2>
      <div id="quiz-questions"></div>
      <button class="settings-btn" onclick="submitQuiz()">Save Preferences</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'block';
  displayQuizQuestions();
}

function displayQuizQuestions() {
  const container = document.getElementById('quiz-questions');
  container.innerHTML = quizQuestions.map((q, i) => `
    <div class="quiz-question">
      <h3>${q.question}</h3>
      <div class="quiz-options" data-type="${q.type}" data-key="${q.key}">
        ${q.options.map(opt => `
          <div class="quiz-option" onclick="toggleOption(this, '${q.type}')">${opt}</div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function toggleOption(element, type) {
  if (type === 'single') {
    element.parentElement.querySelectorAll('.quiz-option').forEach(opt => 
      opt.classList.remove('selected'));
    element.classList.add('selected');
  } else {
    element.classList.toggle('selected');
  }
}

function submitQuiz() {
  try {
    quizQuestions.forEach(q => {
      const options = document.querySelector(`[data-key="${q.key}"]`);
      const selected = Array.from(options.querySelectorAll('.selected')).map(opt => opt.textContent);

      if (q.type === 'single') {
        userPreferences[q.key] = selected[0] || '';
      } else {
        userPreferences[q.key] = selected;
      }
    });

    updatePreferencesDisplay();
    filterRestaurantsByPreferences(); // Apply filtering based on preferences
    
  } catch (error) {
    console.error("Error while submitting the quiz:", error);
  }

  // Ensure the modal is removed
  const quizModal = document.querySelector('.quiz-modal');
  if (quizModal) {
    quizModal.remove();
  }
}


function updatePreferencesDisplay() {
  const container = document.getElementById('user-preferences');
  container.innerHTML = `
    ${userPreferences.cuisine.length ? `
      <div class="preference-tag">🍽️ ${userPreferences.cuisine.join(', ')}</div>
    ` : ''}
    ${userPreferences.dietaryRestrictions.length ? `
      <div class="preference-tag">🥗 ${userPreferences.dietaryRestrictions.join(', ')}</div>
    ` : ''}
    ${userPreferences.price_range ? `
      <div class="preference-tag">💰 ${userPreferences.price_range}</div>
    ` : ''}
  `;
}

function filterRestaurantsByPreferences() {
  filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCuisine = userPreferences.cuisine.length === 0 || 
      userPreferences.cuisine.some(preference => restaurant.cuisine.includes(preference));
    const matchesDietary = userPreferences.dietaryRestrictions.length === 0 || 
      userPreferences.dietaryRestrictions.every(diet => restaurant.dietaryRestrictions.includes(diet));
    const matchesPrice = !userPreferences.price_range || restaurant.price_range === userPreferences.price_range;
    
    return matchesCuisine && matchesDietary && matchesPrice;
  });
  
  console.log("Filtered restaurants:", filteredRestaurants); // Check the filtered results
  currentCard = 0; // Reset to the first card
  updateCard(); // Refresh the displayed card
}




// Card Navigation
function createCard(restaurant) {
  return `
    <div class="restaurant-card">
      <div class="card-image" style="background-image: url('https://source.unsplash.com/random/800x600/?restaurant,${restaurant.cuisine.toLowerCase()}')">
      </div>
      <div class="card-content">
        <h2 class="restaurant-name">${restaurant.name}</h2>
        <div class="restaurant-details">
          <span>${restaurant.cuisine}</span>
          <span>${restaurant.price_range}</span>
          <span>${restaurant.location}</span>
        </div>
        <div class="rating">
          <i class="ph ph-star-fill"></i>
          <span>${restaurant.description}</span>
        </div>
      </div>
    </div>
  `;
}

function updateCard() {
  const cardContainer = document.querySelector('.card-container');
  
  if (filteredRestaurants.length === 0) {
    cardContainer.innerHTML = `<p>No restaurants match your preferences. Please adjust your filters.</p>`;
  } else {
    cardContainer.innerHTML = createCard(filteredRestaurants[currentCard]);
  }
}



function nextCard() {
  if (filteredRestaurants.length === 0) return; // Prevent swipe if no restaurants

  const cardContainer = document.querySelector('.card-container');
  const currentElement = cardContainer.children[0];

  currentCard = (currentCard + 1) % filteredRestaurants.length;
  currentElement.style.transform = 'translateX(-120%)';
  
  setTimeout(() => {
    cardContainer.innerHTML = createCard(filteredRestaurants[currentCard]);
  }, 300);
}

function previousCard() {
  if (filteredRestaurants.length === 0) return; // Prevent swipe if no restaurants

  const cardContainer = document.querySelector('.card-container');
  const currentElement = cardContainer.children[0];

  currentCard = (currentCard - 1 + filteredRestaurants.length) % filteredRestaurants.length;
  currentElement.style.transform = 'translateX(120%)';
  
  setTimeout(() => {
    cardContainer.innerHTML = createCard(filteredRestaurants[currentCard]);
  }, 300);
}



// Swipe Functionality
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  const swipeThreshold = 50;
  const difference = touchStartX - touchEndX;
  
  if (Math.abs(difference) > swipeThreshold) {
    if (difference > 0) {
      nextCard();
    } else {
      previousCard();
    }
  }
}

// Initialize
displayFavorites();
updatePreferencesDisplay();