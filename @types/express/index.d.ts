export {}

declare global {
  namespace Express {
      interface Request {
          validated?: any,
          log?: any,
      }
  }
}
