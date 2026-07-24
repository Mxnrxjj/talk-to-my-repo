export async function api<T>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }

  return data;
}
