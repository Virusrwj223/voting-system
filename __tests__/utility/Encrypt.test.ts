import { describe, it, expect, beforeEach, vi } from "vitest";
import { Encryptor } from "../../lib/utility/encrypt";

vi.mock("../../lib/db/prisma");

describe("Encryptor Class", () => {
  const secretKey = "12345678901234567890123456789012"; // 32 characters for AES-256
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let encryptor: Encryptor<any>;

  beforeEach(() => {
    encryptor = new Encryptor(secretKey);
  });

  it("should throw an error if secret key is not 32 characters long", () => {
    expect(() => new Encryptor("short-key")).toThrow(
      "Secret key must be 32 characters long for AES-256."
    );
  });

  it("should encrypt a string properly", () => {
    const plainText = "Hello, world!";
    const encryptedText = encryptor.encrypt(plainText);

    expect(encryptedText).toBeDefined();
    expect(encryptedText).toContain(":"); // Ensures IV and encrypted data are separated
  });

  it("should encrypt an object properly", () => {
    const obj = { name: "Alice", age: 25 };
    const encryptedText = encryptor.encrypt(obj);

    expect(encryptedText).toBeDefined();
    expect(encryptedText).toContain(":");
  });

  it("should encrypt a number properly", () => {
    const number = 42;
    const encryptedText = encryptor.encrypt(number);

    expect(encryptedText).toBeDefined();
    expect(encryptedText).toContain(":");
  });

  it("should decrypt an encrypted string correctly", () => {
    const plainText = "Hello, world!";
    const encryptedText = encryptor.encrypt(plainText);
    const decryptedText = encryptor.decrypt(encryptedText);

    expect(decryptedText).toBe(plainText);
  });

  it("should decrypt an encrypted object correctly", () => {
    const obj = { name: "Alice", age: 25 };
    const encryptedText = encryptor.encrypt(obj);
    const decryptedObj = encryptor.decrypt(encryptedText);

    expect(decryptedObj).toEqual(obj);
  });

  it("should throw an error when decrypting an invalid input", () => {
    expect(() => encryptor.decrypt("invalid-data")).toThrow();
  });

  it("should throw an error when decrypting malformed encrypted text", () => {
    expect(() => encryptor.decrypt("not-an-iv:not-encrypted")).toThrow();
  });
});
