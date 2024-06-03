export default function authHeader() {
  const userData = localStorage.getItem("jwt_access_token");

  if (userData) {
    return {
      Authorization: "Bearer " + userData,
    };
  } else {
    return {
      Authorization: "Bearer " + userData,
    };
  }
}
