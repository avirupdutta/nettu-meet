const isDevelopment: boolean =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const devApiConfig = {
  baseUrl: "http://localhost:5000/nettu/api/v1",
  url: "http://localhost:5000",
  docsUrl: "http://localhost:5000/nettu/api/v1/docs",
};

const prodApiConfig = {
  baseUrl: "https://backend.instaconnect.io/nettu/api/v1",
  url: "https://backend.instaconnect.io/nettu",
  docsUrl: "https://backend.instaconnect.io/nettu/api/v1/docs",
};

const frontendUrl = !isDevelopment
  ? "https://backend.instaconnect.io/nettu-fe"
  : "http://localhost:3000";

const apiConfig = !isDevelopment ? prodApiConfig : devApiConfig;

export { apiConfig, frontendUrl };
