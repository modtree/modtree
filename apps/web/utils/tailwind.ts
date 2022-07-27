/** combine css */
export function cc(...args: (string | undefined)[]) {
  return args.filter(Boolean).join(' ')
}
