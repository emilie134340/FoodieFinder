let currentCard = 0;
    const restaurants = [
      {
        name: 'Chipotle',
        cuisine: 'Mexican',
        price: '$$',
        distance: '0.8 miles',
        rating: 4.5,
        reviews: '2.3k'
      },
      {
        name: 'Sushi Delight',
        cuisine: 'Japanese',
        price: '$$$',
        distance: '1.2 miles',
        rating: 4.8,
        reviews: '1.5k'
      },
      {
        name: 'Pizza Roma',
        cuisine: 'Italian',
        price: '$$',
        distance: '0.5 miles',
        rating: 4.3,
        reviews: '3.1k'
      }
    ];
    
    let filteredRestaurants = [...restaurants];
    let favorites = [];
    
    // Page Navigation
    function showPage(pageId) {
      document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
      });
      document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      document.getElementById(`${pageId}-page`).classList.add('active');
      event.currentTarget.classList.add('active');
      
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
    
    function displaySearchResults(results) {
      const searchResultsDiv = document.getElementById('search-results');
      searchResultsDiv.innerHTML = results.map(restaurant => `
        <div class="restaurant-card" style="position: static; margin-bottom: 1rem;">
          <div class="card-image" style="background-image: url('https://source.unsplash.com/random/800x600/?restaurant,${restaurant.cuisine.toLowerCase()}')"></div>
          <div class="card-content">
            <h2 class="restaurant-name">${restaurant.name}</h2>
            <div class="restaurant-details">
              <span>${restaurant.cuisine}</span>
              <span>${restaurant.price}</span>
              <span>${restaurant.distance}</span>
            </div>
            <div class="rating">
              <i class="ph ph-star-fill"></i>
              <span>${restaurant.rating}</span>
              <span>(${restaurant.reviews} reviews)</span>
            </div>
          </div>
        </div>
      `).join('');
    }
    
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
            <p>${restaurant.cuisine} • ${restaurant.price}</p>
            <div class="rating">
              <i class="ph ph-star-fill"></i>
              <span>${restaurant.rating}</span>
            </div>
          </div>
        </div>
      `).join('') : '<p>No favorites yet! Start exploring restaurants to add some.</p>';
    }
    
    // Profile Functionality
    function openSettings() {
      alert('Settings functionality coming soon!');
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
              <span>${restaurant.price}</span>
              <span>${restaurant.distance}</span>
            </div>
            <div class="rating">
              <i class="ph ph-star-fill"></i>
              <span>${restaurant.rating}</span>
              <span>(${restaurant.reviews} reviews)</span>
            </div>
          </div>
        </div>
      `;
    }
    
    function updateCard() {
        const cardContainer = document.querySelector('.card-container');
        cardContainer.innerHTML = createCard(filteredRestaurants[currentCard]);
    }
    
    
    function nextCard() {
      const cardContainer = document.querySelector('.card-container');
      const currentElement = cardContainer.children[0];
      
      currentCard = (currentCard + 1) % filteredRestaurants.length;
      
      currentElement.style.transform = 'translateX(-120%)';
      setTimeout(() => {
        cardContainer.innerHTML = createCard(filteredRestaurants[currentCard]);
      }, 300);
    }
    
    function previousCard() {
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