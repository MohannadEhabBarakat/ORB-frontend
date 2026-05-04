export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
console.log(API_BASE_URL);
export const apiFetch = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;

    let response: Response;
    try {
        response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });
    } catch (err) {
        // Network-level failure: CORS, DNS, connection refused, etc.
        const message = err instanceof Error ? err.message : String(err);
        alert(`Network error fetching ${endpoint}: ${message}`);
        throw new Error(`Network error fetching ${endpoint}: ${message}`);
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.detail || `HTTP error! status: ${response.status}`);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

export const apiFetchMultipart = async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        method: 'POST',
        body: formData,
        // Content-Type is intentionally omitted so browser can set boundary
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};
