import crypto from "crypto";

import bcrypt from "bcrypt";

import prisma from "../db/prisma";

/**
 * Represents a secure authentication token.
 * Used for magic link authentication, stored in the `MagicLinkToken` table.
 */
class Token {
  private readonly token: string;

  /**
   * Private constructor to initialize a Token instance.
   * @param {string} token - The raw token string.
   */
  private constructor(token: string) {
    this.token = token;
  }

  /**
   * Generates a new cryptographically secure token.
   * @returns {Token} - A new Token instance with a randomly generated token.
   */
  public static generateToken() {
    return new Token(crypto.randomBytes(32).toString("hex"));
  }

  /**
   * Creates a Token instance from a given token string.
   * @param {string} token - The raw token string.
   * @returns {Promise<Token>} - A new Token instance.
   */
  public static async of(token: string) {
    return new Token(token);
  }

  /**
   * Saves or updates the hashed token in the database for the given email.
   * If the email already has a token, it updates the existing entry.
   * @param {string} email - The email associated with the token.
   * @param {Date} expiration - The expiration date of the token.
   * @returns {Promise<void>}
   */
  async saveToken(email: string, expiration: Date) {
    const tokenHash = bcrypt.hashSync(this.token, 10); // Hash the token for security
    const obj = await prisma.magicLinkToken.findUnique({
      where: { email: email },
    });
    if (obj == null) {
      await prisma.magicLinkToken.create({
        data: { email: email, expiration: expiration, token: tokenHash },
      });
    } else {
      await prisma.magicLinkToken.update({
        where: { email: email },
        data: { expiration: expiration, token: tokenHash },
      });
    }
  }

  /**
   * Checks the integrity of the stored token.
   * - Ensures the token exists for the given email.
   * - Validates the token is not expired.
   * - Verifies that the stored token matches the provided token.
   * - If valid, deletes the token after successful verification.
   * @param {string} email - The email associated with the token.
   * @throws {Error} If the token is missing, expired, or invalid.
   * @returns {Promise<void>}
   */
  async checkTokenIntegrity(email: string) {
    const tokenData = await prisma.magicLinkToken.findUnique({
      where: { email: email },
    });
    if (!tokenData) throw new Error();
    if (
      !tokenData ||
      tokenData.expiration < new Date(Date.now()) || // Check expiration
      !(await bcrypt.compare(this.token, tokenData.token)) // Validate token hash
    ) {
      throw new Error();
    }
    await this.invalidateToken(email);
  }

  /**
   * Invalidates the token by removing it from the database.
   * This is called after successful token verification.
   * @param {string} email - The email associated with the token.
   * @returns {Promise<void>}
   */
  private async invalidateToken(email: string) {
    await prisma.magicLinkToken.delete({ where: { email: email } });
  }

  /**
   * Returns the raw token string.
   * @returns {string} - The raw token value.
   */
  toString() {
    return this.token;
  }
}

export default Token;
