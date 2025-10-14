// Local authentication system for development
// This provides a working authentication system without external dependencies

class LocalAuth {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
  }

  // Load users from localStorage
  loadUsers() {
    try {
      const stored = localStorage.getItem('echo_style_users');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading users:', error);
      return {};
    }
  }

  // Load current user from localStorage
  loadCurrentUser() {
    try {
      const stored = localStorage.getItem('echo_style_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error loading current user:', error);
      return null;
    }
  }

  // Save users to localStorage
  saveUsers() {
    try {
      localStorage.setItem('echo_style_users', JSON.stringify(this.users));
    } catch (error) {
      console.error('Error saving users:', error);
    }
  }

  // Save current user to localStorage
  saveCurrentUser(user) {
    try {
      if (user) {
        localStorage.setItem('echo_style_current_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('echo_style_current_user');
      }
    } catch (error) {
      console.error('Error saving current user:', error);
    }
  }

  // Register a new user
  async register(userData) {
    try {
      console.log('Registering user locally:', userData.email);
      
      // Check if user already exists
      if (this.users[userData.email]) {
        throw new Error('User already exists with this email');
      }

      // Create user object
      const user = {
        id: this.generateId(),
        email: userData.email,
        name: userData.name,
        password: userData.password, // In production, this would be hashed
        created_at: new Date().toISOString(),
        user_metadata: {
          name: userData.name,
          saved_products: [],
          skin_analyses: []
        }
      };

      // Save user
      this.users[userData.email] = user;
      this.saveUsers();

      console.log('✅ User registered successfully');
      return { 
        user: { ...user, password: undefined }, // Remove password from response
        token: this.generateToken(user)
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      console.log('Logging in user:', credentials.email);
      
      const user = this.users[credentials.email];
      if (!user) {
        throw new Error('Invalid login credentials');
      }

      if (user.password !== credentials.password) {
        throw new Error('Invalid login credentials');
      }

      // Set current user
      this.currentUser = { ...user, password: undefined };
      this.saveCurrentUser(this.currentUser);

      console.log('✅ User logged in successfully');
      return { 
        user: this.currentUser,
        token: this.generateToken(user)
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser() {
    return this.currentUser;
  }

  // Get session
  async getSession() {
    if (this.currentUser) {
      return {
        user: this.currentUser,
        access_token: this.generateToken(this.currentUser)
      };
    }
    return null;
  }

  // Logout
  async logout() {
    console.log('Logging out user');
    this.currentUser = null;
    this.saveCurrentUser(null);
  }

  // Update user
  async updateUser(userData) {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...this.currentUser, ...userData };
    this.users[this.currentUser.email] = { ...this.users[this.currentUser.email], ...userData };
    this.currentUser = updatedUser;
    
    this.saveUsers();
    this.saveCurrentUser(updatedUser);
    
    return updatedUser;
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generate simple token (in production, use proper JWT)
  generateToken(user) {
    return btoa(JSON.stringify({ userId: user.id, email: user.email, timestamp: Date.now() }));
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.currentUser;
  }

  // Save user data (like saved products, analyses)
  async saveUserData(data) {
    if (!this.currentUser) {
      throw new Error('No user logged in');
    }

    const updatedUser = { ...this.currentUser, ...data };
    this.users[this.currentUser.email] = { ...this.users[this.currentUser.email], ...data };
    this.currentUser = updatedUser;
    
    this.saveUsers();
    this.saveCurrentUser(updatedUser);
    
    return updatedUser;
  }
}

// Create singleton instance
export const localAuth = new LocalAuth();
export default localAuth;









