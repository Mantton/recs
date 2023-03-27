/**
 * Reference: https://reacthustle.com/blog/how-to-chain-multiple-middleware-functions-in-nextjs
 */

import { type NextMiddleware, NextResponse } from "next/server";
type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;
export function middlewareStack(
  functions: MiddlewareFactory[] = [],
  index = 0
): NextMiddleware {
  const current = functions[index];
  if (current) {
    const next = middlewareStack(functions, index + 1);
    return current(next);
  }
  return () => NextResponse.next();
}
