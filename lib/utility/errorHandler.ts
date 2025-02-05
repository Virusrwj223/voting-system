import { NextResponse } from 'next/server';

export abstract class ErrorHandler {
  abstract throwError(): void;
}

export class CustomError extends ErrorHandler {
  private message;
  private code;
  constructor(message: string, code: number) {
    super();
    this.message = message;
    this.code = code;
  }
  throwError() {
    return NextResponse.json({ error: this.message }, { status: this.code });
  }
}

export class Error500 extends ErrorHandler {
  private message;
  private readonly code = 500;
  constructor(message: string) {
    super();
    this.message = message;
  }
  throwError() {
    return NextResponse.json({ error: this.message }, { status: this.code });
  }
}

export class Error400 extends ErrorHandler {
  private message;
  private readonly code = 400;
  constructor(message: string) {
    super();
    this.message = message;
  }
  throwError() {
    return NextResponse.json({ error: this.message }, { status: this.code });
  }
}

export class Error403 extends ErrorHandler {
  private message;
  private readonly code = 403;
  constructor(message: string) {
    super();
    this.message = message;
  }
  throwError() {
    return NextResponse.json({ error: this.message }, { status: this.code });
  }
}

export class Error401 extends ErrorHandler {
  private message;
  private readonly code = 401;
  constructor(message: string) {
    super();
    this.message = message;
  }
  throwError() {
    return NextResponse.json({ error: this.message }, { status: this.code });
  }
}

export function triErrorHandler(error: unknown) {
  if (error instanceof ErrorHandler) {
    return error.throwError(); // CustomError should have a method to return a NextResponse
  } else if (error instanceof Error) {
    return new CustomError(error.message, 500).throwError(); // Handle standard errors
  } else {
    return new Error500('An unexpected error occurred').throwError(); // Handle unknown errors
  }
}

export class Success200 {
  private message;
  private readonly code = 200;
  constructor(message: string) {
    this.message = message;
  }
  returnSuccess() {
    return NextResponse.json({ message: this.message }, { status: this.code });
  }
}
