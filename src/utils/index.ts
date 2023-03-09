export function getErrorMessage(e: unknown, def = 'unknown error') {
  return typeof e === 'string' ? e : e instanceof Error ? e.message : def
}

export class WRequestError extends Error {
  constructor(message: string) {
    super(message)
  }
}