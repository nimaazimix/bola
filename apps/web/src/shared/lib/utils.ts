export function getInitial(name: string) {
  const trimmed = name.trim();

  if (!trimmed) return "?";

  return Array.from(trimmed.split(/\s+/)[0]!)[0]!.toUpperCase();
}
