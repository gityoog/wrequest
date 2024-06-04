export function getErrorMessage(e: unknown, def = 'unknown error') {
  return typeof e === 'string' ? e : e instanceof Error ? e.message : def
}

/**@deprecated */
export class WRequestError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class WRequestOriginError extends WRequestError {
  data
  code
  constructor({
    message,
    code,
    data
  }: {
    message: string
    code: string
    data: unknown
  }) {
    super(message)
    this.code = code
    this.data = data
  }
}