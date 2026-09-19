export const getRole = (): string | null => localStorage.getItem("currentRole");

export const setRole = (role: string): void => localStorage.setItem("currentRole", role);

export const removeRole = (): void => localStorage.removeItem("currentRole");