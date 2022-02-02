export {}

declare global {
  namespace Express {
      interface Request {
          validated?: any,
          decoded?: any,
          log?: any,
          db?: any,
          fileValidationError?: any,
      }
  }
}
