import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "0",
        bottom: "0",
        left: "0",
        right: 0,
        zIndex: "1000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.1)",
      }}
    >
      <div class="loader"></div>
    </div>
  );
};

export default Loader;
