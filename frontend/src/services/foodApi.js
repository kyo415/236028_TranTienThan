const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || data.error || `Lỗi HTTP ${response.status}`
    );
  }

  return data;
}

export const foodApi = {
  getAll(search = "") {
    return request(`/api/foods?search=${encodeURIComponent(search)}`);
  },

  getById(id) {
    return request(`/api/foods/${id}`);
  },

  create(food) {
    return request("/api/foods", {
      method: "POST",
      body: JSON.stringify(food),
    });
  },

  update(id, food) {
    return request(`/api/foods/${id}`, {
      method: "PUT",
      body: JSON.stringify(food),
    });
  },

  remove(id) {
    return request(`/api/foods/${id}`, {
      method: "DELETE",
    });
  },
};
