// utils/auth.js
export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('token') ? true : false;
  };
  
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Redirect to login page
  };