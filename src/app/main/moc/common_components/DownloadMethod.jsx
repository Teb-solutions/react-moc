import { apiAuth } from "src/utils/http.js";


export const HandleDownload = (documenDowToken, name) => {
    apiAuth
        .get(`/DocumentManager/download/${documenDowToken}`, {
            responseType: "blob",
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");

            link.href = url;
            link.setAttribute("download", name); // or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            console.error("Download failed", error);
        });
};