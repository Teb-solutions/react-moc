export default function authHeader() {
  const userData = localStorage.getItem("token");

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
