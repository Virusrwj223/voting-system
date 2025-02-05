/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { Email, Gmail } from "../../lib/model/Email";

vi.stubEnv("EMAIL_USER", "test-sender@example.com");
vi.stubEnv("EMAIL_PASS", "test-password");
vi.stubEnv("BASE_URL", "http://localhost:3000");

vi.mock("../../lib/db/prisma");

vi.mock("resend", () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: vi.fn().mockResolvedValue({ id: "mock-email-id" }),
    },
  })),
}));

describe("Email Class", () => {
  it("should not allow instantiation of abstract Email class", () => {
    class TestEmail extends Email {
      async sendMail(
        receipients: string[],
        subject: string,
        body: string,
        html: string
      ) {}
    }

    const emailInstance = new TestEmail("test@example.com");
    expect(emailInstance).toBeInstanceOf(Email);
  });
});

describe("Gmail Class", () => {
  let gmail: Gmail;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSendMail: any;

  beforeEach(() => {
    gmail = new Gmail("sender@example.com", "test-password");

    // Reset mocks
    mockSendMail = vi.spyOn(gmail["transport"].emails, "send");
  });

  it("should send an email with the correct parameters", async () => {
    const recipients = ["recipient1@example.com", "recipient2@example.com"];
    const subject = "Test Subject";
    const html = "<p>Test Email</p>";

    await gmail.sendMail(recipients, subject, html);

    expect(mockSendMail).toHaveBeenCalledWith({
      from: "Acme <onboarding@resend.dev>",
      to: recipients,
      subject: subject,
      html: html,
    });
  });

  it("should send an email to each recipient individually", async () => {
    const recipients = ["recipient1@example.com", "recipient2@example.com"];
    const subject = "Test Subject";
    const html = "<p>Test Email</p>";

    await gmail.sendMail(recipients, subject, html);

    // Expect sendMail to be called for each recipient separately
    expect(mockSendMail).toHaveBeenCalledTimes(recipients.length);

    recipients.forEach(() => {
      expect(mockSendMail).toHaveBeenCalledWith({
        from: "Acme <onboarding@resend.dev>",
        to: recipients,
        subject: subject,
        html: html,
      });
    });
  });

  it("should handle errors when sending an email", async () => {
    mockSendMail.mockRejectedValue(new Error("Failed to send email"));

    const recipients = ["recipient@example.com"];
    const subject = "Error Test";
    const html = "<p>Error Handling</p>";

    await expect(gmail.sendMail(recipients, subject, html)).rejects.toThrow(
      "Failed to send email"
    );
  });
});
