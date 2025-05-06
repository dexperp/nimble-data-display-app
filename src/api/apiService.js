
import axios from 'axios';
import { destinations, reviews, bookings } from './mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
const apiService = {
  // Destinations
  getDestinations: async (filters = {}) => {
    await delay(800); // Simulate network delay
    
    let results = [...destinations];
    
    // Apply filters if provided
    if (filters) {
      // Filter by location
      if (filters.location && filters.location !== 'All') {
        results = results.filter(dest => dest.location === filters.location);
      }
      
      // Filter by price range
      if (filters.minPrice !== undefined) {
        results = results.filter(dest => dest.price >= filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        results = results.filter(dest => dest.price <= filters.maxPrice);
      }
      
      // Filter by rating
      if (filters.minRating !== undefined) {
        results = results.filter(dest => dest.rating >= filters.minRating);
      }

      // Filter by search term
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        results = results.filter(dest => 
          dest.name.toLowerCase().includes(searchLower) || 
          dest.description.toLowerCase().includes(searchLower) ||
          dest.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      // Sort results
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-asc':
            results.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            results.sort((a, b) => b.price - a.price);
            break;
          case 'rating-desc':
            results.sort((a, b) => b.rating - a.rating);
            break;
          default:
            // No sorting
            break;
        }
      }
    }
    
    return results;
  },
  
  getDestinationById: async (id) => {
    await delay(800); // Simulate network delay
    const destination = destinations.find(dest => dest.id === id);
    
    if (!destination) {
      throw new Error('Destination not found');
    }
    
    return destination;
  },
  
  createDestination: async (destinationData) => {
    await delay(1000); // Simulate network delay
    
    // Generate a new ID
    const newId = `dest-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const newDestination = {
      id: newId,
      ...destinationData,
      featured: false
    };
    
    // In a real API, this would add to the database
    destinations.push(newDestination);
    
    return newDestination;
  },
  
  updateDestination: async (id, destinationData) => {
    await delay(1000); // Simulate network delay
    
    const index = destinations.findIndex(dest => dest.id === id);
    if (index === -1) {
      throw new Error('Destination not found');
    }
    
    // Update the destination
    destinations[index] = { ...destinations[index], ...destinationData };
    
    return destinations[index];
  },
  
  deleteDestination: async (id) => {
    await delay(1000); // Simulate network delay
    
    const index = destinations.findIndex(dest => dest.id === id);
    if (index === -1) {
      throw new Error('Destination not found');
    }
    
    // Remove the destination
    destinations.splice(index, 1);
    
    return { success: true, message: 'Destination deleted successfully' };
  },
  
  // Reviews
  getReviewsByDestination: async (destinationId) => {
    await delay(500); // Simulate network delay
    
    const destinationReviews = reviews.filter(review => review.destinationId === destinationId);
    return destinationReviews;
  },
  
  createReview: async (reviewData) => {
    await delay(800); // Simulate network delay
    
    // Generate a new ID
    const newId = `rev-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const newReview = {
      id: newId,
      ...reviewData,
      date: new Date().toISOString().split('T')[0]
    };
    
    // In a real API, this would add to the database
    reviews.push(newReview);
    
    return newReview;
  },
  
  updateReview: async (id, reviewData) => {
    await delay(800); // Simulate network delay
    
    const index = reviews.findIndex(review => review.id === id);
    if (index === -1) {
      throw new Error('Review not found');
    }
    
    // Update the review
    reviews[index] = { ...reviews[index], ...reviewData };
    
    return reviews[index];
  },
  
  deleteReview: async (id) => {
    await delay(800); // Simulate network delay
    
    const index = reviews.findIndex(review => review.id === id);
    if (index === -1) {
      throw new Error('Review not found');
    }
    
    // Remove the review
    reviews.splice(index, 1);
    
    return { success: true, message: 'Review deleted successfully' };
  },
  
  // Bookings
  getBookingsByUser: async (userId) => {
    await delay(800); // Simulate network delay
    
    const userBookings = bookings.filter(booking => booking.userId === userId);
    
    // Enrich bookings with destination info
    const enrichedBookings = await Promise.all(userBookings.map(async booking => {
      const destination = await apiService.getDestinationById(booking.destinationId);
      return { ...booking, destination };
    }));
    
    return enrichedBookings;
  },
  
  createBooking: async (bookingData) => {
    await delay(1000); // Simulate network delay
    
    // Generate a new ID
    const newId = `book-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    const newBooking = {
      id: newId,
      ...bookingData,
      status: 'confirmed'
    };
    
    // In a real API, this would add to the database
    bookings.push(newBooking);
    
    return newBooking;
  },
  
  updateBooking: async (id, bookingData) => {
    await delay(1000); // Simulate network delay
    
    const index = bookings.findIndex(booking => booking.id === id);
    if (index === -1) {
      throw new Error('Booking not found');
    }
    
    // Update the booking
    bookings[index] = { ...bookings[index], ...bookingData };
    
    return bookings[index];
  },
  
  deleteBooking: async (id) => {
    await delay(1000); // Simulate network delay
    
    const index = bookings.findIndex(booking => booking.id === id);
    if (index === -1) {
      throw new Error('Booking not found');
    }
    
    // Remove the booking
    bookings.splice(index, 1);
    
    return { success: true, message: 'Booking cancelled successfully' };
  }
};

export default apiService;
