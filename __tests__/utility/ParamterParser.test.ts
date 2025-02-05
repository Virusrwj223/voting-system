import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";
import { ParameterParser } from "../../lib/utility/verifyParameters";
import { Error400 } from "../../lib/utility/errorHandler";

vi.mock("../../lib/db/prisma");
vi.mock("next/server", () => ({
  NextRequest: vi.fn(),
}));

describe("ParameterParser Class", () => {
  it("should correctly parse a URL parameter", () => {
    const req = { url: "https://example.com/?query=testValue" } as NextRequest;
    const parser = ParameterParser.parseUrl(req, "query");

    expect(parser).toBeInstanceOf(ParameterParser);
    expect(parser.verifyParameter("query")).toBe("testValue");
  });

  it("should return null when URL parameter is missing", () => {
    const req = { url: "https://example.com/" } as NextRequest;
    const parser = ParameterParser.parseUrl(req, "missing");

    expect(() => parser.verifyParameter("missing")).toThrow(Error400);
  });

  it("should correctly parse a payload", () => {
    const parser = ParameterParser.parsePayload("testPayload");

    expect(parser).toBeInstanceOf(ParameterParser);
    expect(parser.verifyParameter("payload")).toBe("testPayload");
  });

  it("should throw an error when payload is missing", () => {
    const parser = ParameterParser.parsePayload(undefined);

    expect(() => parser.verifyParameter("payload")).toThrow(Error400);
  });

  it("should correctly parse an environment variable", () => {
    const parser = ParameterParser.parseEnv("ENV_VALUE");

    expect(parser).toBeInstanceOf(ParameterParser);
    expect(parser.verifyParameter("envVar")).toBe("ENV_VALUE");
  });

  it("should throw an error when environment variable is missing", () => {
    const parser = ParameterParser.parseEnv(undefined);

    expect(() => parser.verifyParameter("envVar")).toThrow(Error400);
  });
});
