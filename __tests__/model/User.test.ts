//test/sample.test.ts
import { describe, expect, vi, beforeEach, it } from "vitest";
import User from "../../lib/model/User";
import prisma from "../../lib/db/__mocks__/prisma";

vi.mock("../../lib/db/prisma");

describe("User Class", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should create a new user if not found in saveUser()", async () => {
    const testUser = new User("test@example.com", "1001");

    // Mock findUnique to return null (user doesn't exist)
    prisma.user.findUnique.mockResolvedValue(null);

    // Mock create function
    prisma.user.create.mockResolvedValue({
      id: "6799f609fd056f6b1fc5aaeb",
      email: "test@example.com",
      customerid: "1001",
      isUserAccessForm: false,
    });

    await testUser.saveUser();

    // Ensure create was called
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { email: "test@example.com", customerid: "1001" },
    });
  });

  it("should update customerid if user exists in saveUser()", async () => {
    const testUser = new User("existing@example.com", "2002");

    // Mock findUnique to return an existing user
    prisma.user.findUnique.mockResolvedValue({
      id: "6799f609fd056f6b1fc5aaeb",
      email: "existing@example.com",
      customerid: "1001", // Old ID
      isUserAccessForm: false,
    });

    // Mock update function
    prisma.user.update.mockResolvedValue({
      id: "6799f609fd056f6b1fc5aaee",
      email: "existing@example.com",
      customerid: "2002", // New ID
      isUserAccessForm: false,
    });

    await testUser.saveUser();

    // Ensure update was called
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: "existing@example.com" },
      data: { customerid: "2002" },
    });
  });

  it("should return isUserAccessForm if user exists in hasUserAccessForm()", async () => {
    const testUser = new User("test@example.com", "1001");

    // Mock findUnique to return an existing user
    prisma.user.findUnique.mockResolvedValue({
      id: "6799f609fd056f6b1fc5aaeb",
      email: "test@example.com",
      customerid: "1001",
      isUserAccessForm: true,
    });

    const result = await testUser.hasUserAccessForm();
    expect(result).toBe(true);
  });

  it("should throw an error if user does not exist in hasUserAccessForm()", async () => {
    const testUser = new User("nonexistent@example.com", "1001");

    // Mock findUnique to return null
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(testUser.hasUserAccessForm()).rejects.toThrow();
  });

  it("should update isUserAccessForm to true in makeUserAccessForm()", async () => {
    const testUser = new User("test@example.com", "1001");

    // Mock update function
    prisma.user.update.mockResolvedValue({
      id: "6799f609fd056f6b1fc5aaeb",
      email: "test@example.com",
      customerid: "1001",
      isUserAccessForm: true,
    });

    await testUser.makeUserAccessForm();

    // Ensure update was called
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      data: { isUserAccessForm: true },
    });
  });

  it("should update isUserAccessForm to false in resetFormAccess()", async () => {
    const testUser = new User("test@example.com", "1001");

    // Mock update function
    prisma.user.update.mockResolvedValue({
      id: "6799f609fd056f6b1fc5aaeb",
      email: "test@example.com",
      customerid: "1001",
      isUserAccessForm: false,
    });

    await testUser.resetFormAccess();

    // Ensure update was called
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      data: { isUserAccessForm: false },
    });
  });
});
