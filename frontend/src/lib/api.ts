const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper: read error detail from a failed fetch response
async function readError(res: Response, fallback: string): Promise<string> {
    try {
        const data = await res.json();
        // Include both message and the detailed error field if present
        if (data.error) return `${data.message || fallback}: ${data.error}`;
        return data.message || fallback;
    } catch {
        return fallback;
    }
}

// --- AUTH APIs ---
export const loginApi = async (credentials: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();
};

export const logout = async () => {
    const res = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
    });
    return res.json();
};

export const getMe = async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include'
    });
    if (!res.ok) throw new Error("Not authenticated");
    return res.json();
};

// --- CAR APIs ---
export const getCars = async () => {
    const res = await fetch(`${API_URL}/cars`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch cars");
    return res.json();
};

export const getCar = async (id: string) => {
    const res = await fetch(`${API_URL}/cars/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch car");
    return res.json();
};

export const createCar = async (formData: FormData) => {
    const res = await fetch(`${API_URL}/cars`, {
        method: 'POST',
        body: formData,
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to create car"));
    }
    return res.json();
};

export const updateCar = async (id: string, formData: FormData) => {
    const res = await fetch(`${API_URL}/cars/${id}`, {
        method: 'PUT',
        body: formData,
        credentials: 'include'
    });
    if (!res.ok) {
        throw new Error(await readError(res, "Failed to update car"));
    }
    return res.json();
};

export const deleteCar = async (id: string) => {
    const res = await fetch(`${API_URL}/cars/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    if (!res.ok) throw new Error("Failed to delete car");
    return res.json();
};
