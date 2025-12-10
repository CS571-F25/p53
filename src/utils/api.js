// API utilities for CS571 Bucket API
const API_BASE = "https://cs571api.cs.wisc.edu/rest/f25/bucket/cards";

// Helper function to get headers
const getHeaders = (includeContentType = false) => {
  const headers = {
    "X-CS571-ID": "bid_8468662ee7601a059c382abbca315e96cef99228707b9ddb37f7b8d2f8559274"
  };
  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

// ============ USER MANAGEMENT ============

/**
 * Register a new user account
 * Creates a user document in the bucket
 */
export const registerUser = async (username, password) => {
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({
        type: "user",
        username: username,
        password: password, // In production, hash this!
        createdAt: new Date().toISOString()
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to register user");
    }

    return data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

/**
 * Login user by verifying credentials
 * Fetches all users and checks for matching username/password
 */
export const loginUser = async (username, password) => {
  try {
    const response = await fetch(API_BASE, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle Bucket API response format: {collection: "cards", results: {...}}
    let allData;
    if (data.results) {
      // Convert results object to array of items with their IDs
      allData = Object.entries(data.results).map(([id, item]) => ({
        id,
        ...item
      }));
    } else if (Array.isArray(data)) {
      allData = data;
    } else {
      console.warn("API returned unexpected format:", data);
      throw new Error("Invalid API response format");
    }

    // Filter to only user documents
    const users = allData.filter(item => item.type === "user");

    // Find matching user
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      throw new Error("Invalid username or password");
    }

    // Store user session in localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      username: user.username
    }));

    return user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Get current logged-in user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;

  try {
    // Try to parse as JSON (new format: {id: "...", username: "..."})
    const parsed = JSON.parse(userStr);
    return parsed;
  } catch (e) {
    // Old format was just a string like "user1", clear it and return null
    localStorage.removeItem('currentUser');
    return null;
  }
};

/**
 * Logout current user
 */
export const logoutUser = () => {
  localStorage.removeItem('currentUser');
};

/**
 * Check if a user is logged in
 */
export const isLoggedIn = () => {
  return getCurrentUser() !== null;
};

/**
 * Fetch all users (excluding current user)
 */
export const getAllUsers = async () => {
  try {
    const response = await fetch(API_BASE, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const currentUser = getCurrentUser();

    // Handle Bucket API response format: {collection: "cards", results: {...}}
    let allData;
    if (data.results) {
      // Convert results object to array of items with their IDs
      allData = Object.entries(data.results).map(([id, item]) => ({
        id,
        ...item
      }));
    } else if (Array.isArray(data)) {
      allData = data;
    } else {
      console.warn("API returned unexpected format:", data);
      return [];
    }

    // Filter to only user documents, excluding current user if logged in
    const users = allData
      .filter(item => item.type === "user")
      .filter(user => !currentUser || user.id !== currentUser.id)
      .map(user => ({
        id: user.id,
        username: user.username,
        createdAt: user.createdAt
      }));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// ============ CARD MANAGEMENT ============

/**
 * Fetch all cards from the API
 */
export const getAllCards = async () => {
  try {
    const response = await fetch(API_BASE, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle Bucket API response format: {collection: "cards", results: {...}}
    let allData;
    if (data.results) {
      // Convert results object to array of items with their IDs
      allData = Object.entries(data.results).map(([id, item]) => ({
        id,
        ...item
      }));
    } else if (Array.isArray(data)) {
      allData = data;
    } else {
      console.warn("API returned unexpected format:", data);
      return [];
    }

    // Filter to only card documents
    const cards = allData.filter(item => item.type === "card");

    return cards;
  } catch (error) {
    console.error("Error fetching cards:", error);
    return [];
  }
};

/**
 * Get cards for a specific user
 */
export const getUserCards = async (userId) => {
  try {
    const allCards = await getAllCards();
    return allCards.filter(card => card.userId === userId);
  } catch (error) {
    console.error("Error fetching user cards:", error);
    return [];
  }
};

/**
 * Add a new card to the collection
 */
export const addCard = async (cardData) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error("Must be logged in to add cards");
  }

  try {
    const payload = {
      type: "card",
      userId: currentUser.id,
      ...cardData,
      createdAt: new Date().toISOString()
    };

    // Log payload size for debugging
    const payloadStr = JSON.stringify(payload);
    const payloadSizeKB = (new Blob([payloadStr]).size / 1024).toFixed(2);
    console.log(`Payload size: ${payloadSizeKB} KB`);

    // Warn if payload is large
    if (payloadSizeKB > 50) {
      console.warn("Large payload detected. Image data size:", (cardData.image?.length || 0));
    }

    const response = await fetch(API_BASE, {
      method: "POST",
      headers: getHeaders(true),
      body: payloadStr
    });

    // Handle 413 Content Too Large error
    if (response.status === 413) {
      throw new Error(`Card data is too large (${payloadSizeKB} KB). The image is likely too big. Please use a smaller file (under 50KB) or use an image URL instead.`);
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add card");
    }

    return data;
  } catch (error) {
    console.error("Error adding card:", error);
    // Re-throw with better message if it's a fetch error
    if (error.message === "Failed to fetch") {
      throw new Error("Unable to connect to the server. The request may be too large. Try using an image URL instead of uploading a file.");
    }
    throw error;
  }
};

/**
 * Update a card
 */
export const updateCard = async (cardId, updates) => {
  try {
    const response = await fetch(`${API_BASE}?id=${cardId}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(updates)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update card");
    }

    return data;
  } catch (error) {
    console.error("Error updating card:", error);
    throw error;
  }
};

/**
 * Toggle favorite status of a card
 */
export const toggleFavorite = async (cardId, currentFavoriteStatus) => {
  try {
    // Fetch all cards to get the full card data
    const allCards = await getAllCards();
    const card = allCards.find(c => c.id === cardId);

    if (!card) {
      throw new Error("Card not found");
    }

    // Update the card with the new favorite status
    const updatedCard = {
      ...card,
      isFavorite: !currentFavoriteStatus
    };

    // Send the full updated card back to the API using PUT with id in query param
    const response = await fetch(`${API_BASE}?id=${cardId}`, {
      method: "PUT",
      headers: getHeaders(true),
      body: JSON.stringify(updatedCard)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update favorite status");
    }

    return data;
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
};

/**
 * Delete a card
 * The Bucket API uses query parameter for DELETE: ?id=cardId
 */
export const deleteCard = async (cardId) => {
  try {
    const response = await fetch(`${API_BASE}?id=${cardId}`, {
      method: "DELETE",
      headers: getHeaders()
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Failed to delete card");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting card:", error);
    throw error;
  }
};
