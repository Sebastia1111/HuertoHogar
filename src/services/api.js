const API_URL = "https://localhost:8080/api";

export const fetchConToken = async (endpoint, options = {}) => {

    const token = localStorage.getItem("jwtToken")

    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`Error en la peticion de la API: ${response.status}`);
    }

    return response.json();
}