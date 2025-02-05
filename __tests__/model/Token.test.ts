//test/sample.test.ts
import { describe, expect, vi, beforeEach, it } from "vitest";
import prisma from "../../lib/db/__mocks__/prisma";
import Token from "../../lib/model/Token";
import bcrypt from "bcrypt";

vi.mock("../../lib/db/prisma");

describe("Token Class", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should generate a new token instance", () => {
    const token = Token.generateToken();
    expect(token).toBeInstanceOf(Token);
    expect(token.toString()).toHaveLength(64); // 32 bytes in hex
  });

  it("should create a Token instance from a given string", async () => {
    const testToken = await Token.of("test123");
    expect(testToken).toBeInstanceOf(Token);
    expect(testToken.toString()).toBe("test123");
  });

  it("should save a new token if no token exists for the email", async () => {
    const testToken = Token.generateToken();
    const email = "test@example.com";
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour later

    // Mock findUnique to return null (email not found)
    prisma.magicLinkToken.findUnique.mockResolvedValue(null);

    // Mock create function
    prisma.magicLinkToken.create.mockResolvedValue({
      id: "random-id",
      email,
      expiration,
      token: "hashed_token",
    });

    await testToken.saveToken(email, expiration);

    expect(prisma.magicLinkToken.create).toHaveBeenCalledWith({
      data: {
        email,
        expiration,
        token: expect.any(String), // Ensures a hashed token is stored
      },
    });
  });

  it("should update the token if an entry already exists", async () => {
    const testToken = Token.generateToken();
    const email = "existing@example.com";
    const expiration = new Date(Date.now() + 60 * 60 * 1000);

    prisma.magicLinkToken.findUnique.mockResolvedValue({
      id: "existing-id",
      email,
      expiration: new Date(Date.now() - 1000), // Old expiration
      token: "old_hash",
    });

    prisma.magicLinkToken.update.mockResolvedValue({
      id: "existing-id",
      email,
      expiration,
      token: "new_hash",
    });

    await testToken.saveToken(email, expiration);

    expect(prisma.magicLinkToken.update).toHaveBeenCalledWith({
      where: { email },
      data: {
        expiration,
        token: expect.any(String),
      },
    });
  });

  it("should throw an error if token does not exist when checking integrity", async () => {
    const testToken = Token.generateToken();
    const email = "nonexistent@example.com";

    // Mock findUnique to return null
    prisma.magicLinkToken.findUnique.mockResolvedValue(null);

    await expect(testToken.checkTokenIntegrity(email)).rejects.toThrow();
  });

  it("should throw an error if token is expired", async () => {
    const testToken = Token.generateToken();
    const email = "expired@example.com";

    prisma.magicLinkToken.findUnique.mockResolvedValue({
      id: "expired-id",
      email,
      expiration: new Date(Date.now() - 1000), // Expired token
      token: "hashed_token",
    });

    await expect(testToken.checkTokenIntegrity(email)).rejects.toThrow();
  });

  it("should throw an error if token is invalid (hash mismatch)", async () => {
    const testToken = await Token.of("wrong_token");
    const email = "mismatch@example.com";

    prisma.magicLinkToken.findUnique.mockResolvedValue({
      id: "mismatch-id",
      email,
      expiration: new Date(Date.now() + 60 * 60 * 1000),
      token: await bcrypt.hash("correct_token", 10), // Store different hash
    });

    await expect(testToken.checkTokenIntegrity(email)).rejects.toThrow();
  });

  it("should delete the token after successful verification", async () => {
    const testToken = await Token.of("valid_token");
    const email = "valid@example.com";
    const hashedToken = await bcrypt.hash("valid_token", 10);

    prisma.magicLinkToken.findUnique.mockResolvedValue({
      id: "valid-id",
      email,
      expiration: new Date(Date.now() + 60 * 60 * 1000), // Valid token
      token: hashedToken,
    });

    prisma.magicLinkToken.delete.mockResolvedValue({
      id: "valid-id",
      email,
      expiration: new Date(Date.now() + 60 * 60 * 1000),
      token: hashedToken,
    });

    await expect(testToken.checkTokenIntegrity(email)).resolves.toBeUndefined();
    expect(prisma.magicLinkToken.delete).toHaveBeenCalledWith({
      where: { email },
    });
  });
});
