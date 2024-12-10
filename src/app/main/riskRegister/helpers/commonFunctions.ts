import jwtDecode from "jwt-decode";

export const getCurrentUserId = () => {
  const accessToken = localStorage.getItem("jwt_access_token");
  const decodedToken = jwtDecode(accessToken);
  const userId =
    decodedToken[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];
  console.log(userId);
  return userId;
};
