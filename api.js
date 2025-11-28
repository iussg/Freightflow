const API_BASE_URL = 'http://localhost:5000/api';

// Sign Up
async function signUp(fullname, email, phone, password, userType) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname,
        email,
        phone,
        password,
        userType,
      }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

// Sign In
async function signIn(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user));
      return data;
    }
    throw new Error(data.message);
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

// Create Booking
async function createBooking(bookingData) {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Booking error:', error);
    throw error;
  }
}

// Get Trucks
async function getTrucks() {
  try {
    const response = await fetch(`${API_BASE_URL}/trucks`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Trucks fetch error:', error);
    throw error;
  }
}
