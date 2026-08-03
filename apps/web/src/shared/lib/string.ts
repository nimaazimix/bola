export function capitalize(value: string) {
  if (!value) return value;

  return value[0]!.toUpperCase() + value.slice(1).toLowerCase();
}

export function getInitial(value: string) {
  if (!value) return "?";

  return value.split(/\s+/)[0]![0]!.toUpperCase();
}
