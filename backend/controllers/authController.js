const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password',
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data and token
    res.json({
      status: 'success',
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

const signup = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    console.log('Signup attempt for:', email);
    
    // Check if email already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      console.log('Email already exists:', email);
      return res.status(400).json({
        status: 'error',
        message: 'Email already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    // Generate username from email
    const username = email.split('@')[0];

    // Create user
    console.log('Attempting to create user with username:', username);
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, username, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [first_name, last_name, email, username, hashedPassword]
    );

    const user = result.rows[0];
    console.log('User created successfully:', user.id);

    // Generate token
    const token = generateToken(user.id);
    console.log('Token generated successfully');

    // Return user data and token
    res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        token,
      },
    });
  } catch (error) {
    console.error('Signup error details:', {
      error: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      details: error.message // Adding error details in development
    });
  }
};

module.exports = {
  login,
  signup,
}; 