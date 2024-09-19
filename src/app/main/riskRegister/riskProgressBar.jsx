import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * The RiskProgress component.
 * @param {object} props - The component props.
 * @param {number} props.course - The target progress value.
 * @param {string} [props.className] - Optional additional class name.
 */
const RiskProgress = ({ course, className }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressValue = 0;
    const incrementStep = 2;
    const intervalDuration = 2;

    const interval = setInterval(() => {
      if (progressValue < course) {
        progressValue += incrementStep;
        setProgress(progressValue > course ? course : progressValue);
      } else {
        clearInterval(interval);
      }
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [course]);

  return (
    <div className={className} style={{ width: "100%", padding: "10px 0" }}>
      <div
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "#e0e0df",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
        }}
        className="mt-10"
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "rgb(83 169 255)",
            transition: "width 0.5s ease-in-out",
            borderRadius: "10px 0 0 10px",
            position: "absolute",
          }}
        />
      </div>
      <div style={{ textAlign: "center", marginTop: "5px" }}>
        <span style={{ fontSize: "20px", color: "#444444" }}>{progress}%</span>
        <span style={{ fontSize: "10px", color: "#A9A9A9" }}> progress</span>
      </div>
    </div>
  );
};

RiskProgress.propTypes = {
  course: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default RiskProgress;
