export function flatten(...args: (string | undefined)[]) {
  return args.filter(Boolean).join(' ')
}
