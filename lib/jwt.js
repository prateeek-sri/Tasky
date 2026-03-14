import jwt from "jsonwebtoken";

/**
 * JWT (JSON Web Token) Utility
 * 
 * How to explain this:
 * 1. Tokens are like "Digital ID Cards". 
 * 2. signToken: When a user logs in, we give them this card containing their ID and Name.
 * 3. verifyToken: Every time they request their tasks, they show us this card.
 *    If the secret is correct and it hasn't expired, we let them in.
 */

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// Create a new token for the user
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); // Token lasts for 7 days
}

// Check if a token provided by the user is valid
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // If token is expired or altered, return null
    return null;
  }
}
