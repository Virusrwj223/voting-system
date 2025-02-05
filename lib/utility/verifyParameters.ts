import { NextRequest } from 'next/server';

import { Error400 } from './errorHandler';

export class ParameterParser<T> {
  private data: T | undefined | null;
  private constructor(data: T | undefined | null) {
    this.data = data;
  }
  static parseUrl(req: NextRequest, searchTerm: string) {
    const url = new URL(req.url);
    return new ParameterParser<string>(url.searchParams.get(searchTerm));
  }
  static parsePayload(data: string | undefined) {
    return new ParameterParser<string>(data);
  }
  static parseEnv(data: string | undefined) {
    return new ParameterParser<string>(data);
  }

  verifyParameter(variableName: string): T {
    if (this.data === null || this.data === undefined) {
      throw new Error400(variableName + ' is required');
    } else {
      return this.data;
    }
  }
}
