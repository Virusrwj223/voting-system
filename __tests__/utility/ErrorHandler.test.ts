import { describe, it, expect, vi } from 'vitest';
import {
  CustomError,
  Error500,
  Error400,
  Error403,
  Error401,
  triErrorHandler,
  Success200,
} from '../../lib/utility/errorHandler';

vi.mock('../../lib/db/prisma');
vi.mock('next/server', () => ({
  NextResponse: {
    json: vi.fn((data, options) => ({ data, options })),
  },
}));

describe('ErrorHandler Classes', () => {
  it('should return correct response for CustomError', () => {
    const error = new CustomError('Custom error occurred', 418);
    const response = error.throwError();

    expect(response).toEqual({
      data: { error: 'Custom error occurred' },
      options: { status: 418 },
    });
  });

  it('should return correct response for Error500', () => {
    const error = new Error500('Server error');
    const response = error.throwError();

    expect(response).toEqual({
      data: { error: 'Server error' },
      options: { status: 500 },
    });
  });

  it('should return correct response for Error400', () => {
    const error = new Error400('Bad request');
    const response = error.throwError();

    expect(response).toEqual({
      data: { error: 'Bad request' },
      options: { status: 400 },
    });
  });

  it('should return correct response for Error403', () => {
    const error = new Error403('Forbidden');
    const response = error.throwError();

    expect(response).toEqual({
      data: { error: 'Forbidden' },
      options: { status: 403 },
    });
  });

  it('should return correct response for Error401', () => {
    const error = new Error401('Unauthorized');
    const response = error.throwError();

    expect(response).toEqual({
      data: { error: 'Unauthorized' },
      options: { status: 401 },
    });
  });
});

describe('triErrorHandler Function', () => {
  it('should return response from an instance of CustomError', () => {
    const error = new CustomError('Handled error', 409);
    const response = triErrorHandler(error);

    expect(response).toEqual({
      data: { error: 'Handled error' },
      options: { status: 409 },
    });
  });

  it('should return a 500 error for a generic Error', () => {
    const error = new Error('Something went wrong');
    const response = triErrorHandler(error);

    expect(response).toEqual({
      data: { error: 'Something went wrong' },
      options: { status: 500 },
    });
  });

  it('should return a 500 error for an unknown error', () => {
    const response = triErrorHandler('unknown error');

    expect(response).toEqual({
      data: { error: 'An unexpected error occurred' },
      options: { status: 500 },
    });
  });
});

describe('Success200 Class', () => {
  it('should return a success response with status 200', () => {
    const success = new Success200('Operation successful');
    const response = success.returnSuccess();

    expect(response).toEqual({
      data: { message: 'Operation successful' },
      options: { status: 200 },
    });
  });
});
