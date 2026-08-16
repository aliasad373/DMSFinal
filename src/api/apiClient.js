import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://119.13.189.233:80/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// =====================================================
// REQUEST INTERCEPTOR
// =====================================================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("dms_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================
apiClient.interceptors.response.use(
  // -----------------------------
  // SUCCESS: 200, 201, 204 etc.
  // -----------------------------
  (response) => {
    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      message:
        response.data?.message ||
        response.statusText ||
        "Request successful",
      data: response.data,
    };
  },

  // -----------------------------
  // ERROR: 400, 401, 404, 500 etc.
  // -----------------------------
  (error) => {
    let normalizedError;

    // Server returned a response
    if (error.response) {
      normalizedError = {
        success: false,

        // 400, 401, 404, 500...
        status: error.response.status,

        // Bad Request, Unauthorized...
        statusText: error.response.statusText,

        // Backend message
        message:
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.statusText ||
          "Something went wrong",

        // Complete response from backend
        data: error.response.data,
      };

      // Handle unauthorized globally
      if (error.response.status === 401) {
        if (!error.config?.url?.includes("/login")) {
          localStorage.removeItem("dms_token");
          localStorage.removeItem("dms_user");

          window.location.href = "/login";
        }
      }
    }

    // Request sent but server didn't respond
    else if (error.request) {
      normalizedError = {
        success: false,
        status: 0,
        statusText: "No Response",
        message:
          "Unable to connect to the server. Please check your connection.",
        data: null,
      };
    }

    // Axios/configuration error
    else {
      normalizedError = {
        success: false,
        status: 0,
        statusText: "Request Error",
        message: error.message || "Something went wrong",
        data: null,
      };
    }

    return Promise.reject(normalizedError);
  }
);

export default apiClient;