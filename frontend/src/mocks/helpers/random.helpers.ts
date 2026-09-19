// ===== RANDOM HELPERS =====
export const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

export const randomDate = () => {
    const start = new Date(2025, 0, 1).getTime();
    const end = new Date(2025, 11, 30).getTime();
    return new Date(start + Math.random() * (end - start))
        .toISOString()
        .split("T")[0];
};

export const randomTime = () => {
    const h = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
    const m = ["00", "15", "30", "45"][Math.floor(Math.random() * 4)];
    return `${h}:${m}`;
};

export const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

export const generateRandomToken = (length = 24): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};

export const randomDelay = (ms = 1000): number => {
    return Math.random() * ms + 500;
}

export const randomBool = () => Boolean(Math.round(Math.random()));