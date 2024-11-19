import jwtDecode from "jwt-decode";

export const getCurrentUserId = () => {
  const accessToken = localStorage.getItem("jwt_access_token");
  const descodedToken = jwtDecode(accessToken);
  const userId =
    descodedToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];
  return userId;
};
