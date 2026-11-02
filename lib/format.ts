export function formatDate(value: string): string {
  // The API sends UTC times with no timezone, which browsers read as local time.
  const utc = /(Z|[+-]\d{2}:\d{2})$/i.test(value) ? value : `${value}Z`;
  return new Date(utc).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function splitList(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
