import MocHeader from "../moc/MocHeader";
import  jwtDecode  from "jwt-decode";
function MocAiReport() {
    const accessToken = localStorage.getItem("jwt_access_token");
    const decodedToken = jwtDecode(accessToken);
    const userId =
      decodedToken[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ];
    // console.log(u
    console.log(accessToken, userId);
  return (
    <div className="flex flex-col w-full h-screen white_bg">
      <div className="">
        <MocHeader nothing={"nothing"} type={"Report"} />
        <div className="flex flex-col w-full h-screen">
            <iframe src={`https://aiagent.tebs.co.in/reports?productId=MOCTOTAL&staffId=${userId}&userId=1&role=staff`} 
            title="AI MOC Report"
            width="100%"
            height="100%"
            />
            
        </div>
      </div>
    </div>
  );
}

export default MocAiReport;
