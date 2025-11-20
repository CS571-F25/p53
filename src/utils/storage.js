// LocalStorage utilities for managing cards and users

const DATA_VERSION = '2'; // Increment this to force refresh demo data

// Initialize with some demo data if localStorage is empty
const initializeData = () => {
  const currentVersion = localStorage.getItem('dataVersion');

  // Force update demo data if version changed
  if (currentVersion !== DATA_VERSION) {
    localStorage.setItem('dataVersion', DATA_VERSION);

    // Reset demo data with new placeholder URLs
    const demoUsers = [
      { id: 'user1', name: 'Your Collection' },
      { id: 'user2', name: 'Card Master 123' },
      { id: 'user3', name: 'Collector Pro' }
    ];
    localStorage.setItem('users', JSON.stringify(demoUsers));

    const demoCards = [
      {
        id: '1',
        userId: 'user2',
        name: 'Pikachu',
        game: 'Pokemon',
        set: 'Base Set',
        rarity: 'Rare',
        condition: 'Near Mint',
        image: 'https://placehold.co/200x280/ffcc00/000000?text=Pikachu',
        notes: 'First edition'
      },
      {
        id: '2',
        userId: 'user3',
        name: 'Black Lotus',
        game: 'Magic: The Gathering',
        set: 'Alpha',
        rarity: 'Mythic Rare',
        condition: 'Excellent',
        image: 'https://placehold.co/200x280/333333/ffffff?text=Black+Lotus',
        notes: 'Extremely valuable'
      }
    ];
    localStorage.setItem('cards', JSON.stringify(demoCards));
  }

  if (!localStorage.getItem('currentUser')) {
    localStorage.setItem('currentUser', 'user1');
  }
};

// Get current user
export const getCurrentUser = () => {
  initializeData();
  return localStorage.getItem('currentUser');
};

// Get all users
export const getAllUsers = () => {
  initializeData();
  return JSON.parse(localStorage.getItem('users') || '[]');
};

// Get all cards
export const getAllCards = () => {
  initializeData();
  return JSON.parse(localStorage.getItem('cards') || '[]');
};

// Get cards for a specific user
export const getUserCards = (userId) => {
  const cards = getAllCards();
  return cards.filter(card => card.userId === userId);
};

// Add a new card
export const addCard = (cardData) => {
  const cards = getAllCards();
  const newCard = {
    id: Date.now().toString(),
    userId: getCurrentUser(),
    ...cardData
  };
  cards.push(newCard);
  localStorage.setItem('cards', JSON.stringify(cards));
  return newCard;
};

// Delete a card
export const deleteCard = (cardId) => {
  const cards = getAllCards();
  const filteredCards = cards.filter(card => card.id !== cardId);
  localStorage.setItem('cards', JSON.stringify(filteredCards));
};

// Update a card
export const updateCard = (cardId, updates) => {
  const cards = getAllCards();
  const index = cards.findIndex(card => card.id === cardId);
  if (index !== -1) {
    cards[index] = { ...cards[index], ...updates };
    localStorage.setItem('cards', JSON.stringify(cards));
    return cards[index];
  }
  return null;
};

// Get user by ID
export const getUserById = (userId) => {
  const users = getAllUsers();
  return users.find(user => user.id === userId);
};
