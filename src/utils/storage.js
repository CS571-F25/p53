// This file is deprecated - all functions now use the API
// Import from api.js instead
import * as api from './api';

// Re-export API functions for backward compatibility
export const getCurrentUser = api.getCurrentUser;
export const getAllUsers = api.getAllUsers;
export const getAllCards = api.getAllCards;
export const getUserCards = api.getUserCards;
export const addCard = api.addCard;
export const deleteCard = api.deleteCard;
export const updateCard = api.updateCard;
export const toggleFavorite = api.toggleFavorite;

// getUserById - fetch user from API
export const getUserById = async (userId) => {
  try {
    const allUsers = await api.getAllUsers();
    return allUsers.find(user => user.id === userId);
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
