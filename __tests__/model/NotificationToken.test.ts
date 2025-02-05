import { describe, it, expect, beforeEach, vi } from "vitest";
import prisma from "../../lib/db/__mocks__/prisma";
import NotificationToken from "../../lib/model/NotificationToken";

vi.mock("../../lib/db/prisma");

describe("NotificationToken Class", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should generate a new notification token instance", () => {
    const token = NotificationToken.generateToken();
    expect(token).toBeInstanceOf(NotificationToken);
    expect(token.toString()).toHaveLength(64); // 32 bytes in hex
  });

  it("should create a NotificationToken instance from a given string", async () => {
    const testToken = NotificationToken.of("test123");
    expect(testToken).toBeInstanceOf(NotificationToken);
    expect(testToken.toString()).toBe("test123");
  });

  it("should save a new notification token if no token exists for the email", async () => {
    const testToken = NotificationToken.generateToken();
    const email = "test@example.com";
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour later

    // Mock findUnique to return null (email not found)
    prisma.notificationToken.findUnique.mockResolvedValue(null);

    // Mock create function
    prisma.notificationToken.create.mockResolvedValue({
      id: "random-id",
      email: email,
      notificationexpiration: expiration,
      notificationtoken: testToken.toString(),
    });

    await testToken.saveToken(email, expiration);

    expect(prisma.notificationToken.create).toHaveBeenCalledWith({
      data: {
        email,
        notificationexpiration: expiration,
        notificationtoken: testToken.toString(),
      },
    });
  });

  it("should update the token if an entry already exists", async () => {
    const testToken = NotificationToken.generateToken();
    const email = "existing@example.com";
    const expiration = new Date(Date.now() + 60 * 60 * 1000);

    prisma.notificationToken.findUnique.mockResolvedValue({
      id: "existing-id",
      email,
      notificationexpiration: new Date(Date.now() - 1000), // Old expiration
      notificationtoken: "old_token",
    });

    prisma.notificationToken.update.mockResolvedValue({
      id: "existing-id",
      email,
      notificationexpiration: expiration,
      notificationtoken: testToken.toString(),
    });

    await testToken.saveToken(email, expiration);

    expect(prisma.notificationToken.update).toHaveBeenCalledWith({
      where: { email },
      data: {
        notificationexpiration: expiration,
        notificationtoken: testToken.toString(),
      },
    });
  });

  it("should throw an error if token does not exist when fetching user", async () => {
    const testToken = NotificationToken.of("invalid_token");

    // Mock findUnique to return null
    prisma.notificationToken.findUnique.mockResolvedValue(null);

    await expect(testToken.getUser()).rejects.toThrow();
  });

  it("should throw an error if token is expired", async () => {
    const testToken = NotificationToken.of("expired_token");

    prisma.notificationToken.findUnique.mockResolvedValue({
      id: "expired-id",
      email: "expired@example.com",
      notificationexpiration: new Date(Date.now() - 1000), // Expired token
      notificationtoken: "expired_token",
    });

    await expect(testToken.getUser()).rejects.toThrow();
  });

  it("should throw an error if associated user is not found", async () => {
    const testToken = NotificationToken.of("valid_token");
    const email = "missing@example.com";

    prisma.notificationToken.findUnique.mockResolvedValue({
      id: "valid-id",
      email,
      notificationexpiration: new Date(Date.now() + 60 * 60 * 1000), // Valid token
      notificationtoken: "valid_token",
    });

    // Mock user not found
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(testToken.getUser()).rejects.toThrow();
  });

  it("should return the user if the token is valid and user exists", async () => {
    const testToken = NotificationToken.of("valid_token");
    const email = "valid@example.com";

    prisma.notificationToken.findUnique.mockResolvedValue({
      id: "valid-id",
      email,
      notificationexpiration: new Date(Date.now() + 60 * 60 * 1000), // Valid token
      notificationtoken: "valid_token",
    });

    prisma.user.findUnique.mockResolvedValue({
      id: "user-id",
      email,
      customerid: "12345",
      isUserAccessForm: true,
    });

    const user = await testToken.getUser();

    expect(user).toEqual({
      id: "user-id",
      email,
      customerid: "12345",
      isUserAccessForm: true,
    });
  });

  it("should delete the token after invalidation", async () => {
    const testToken = NotificationToken.of("to_delete_token");

    prisma.notificationToken.delete.mockResolvedValue({
      id: "delete-id",
      email: "delete@example.com",
      notificationexpiration: new Date(Date.now() + 60 * 60 * 1000),
      notificationtoken: "to_delete_token",
    });

    await expect(testToken.invalidateToken()).resolves.toEqual({
      id: "delete-id",
      email: "delete@example.com",
      notificationexpiration: expect.any(Date),
      notificationtoken: "to_delete_token",
    });

    expect(prisma.notificationToken.delete).toHaveBeenCalledWith({
      where: { notificationtoken: "to_delete_token" },
    });
  });
});
