import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

/**
 * The CircularProgress component.
 * @param {object} props - The component props.
 * @param {number} props.course - The target progress value.
 * @param {string} [props.className] - Optional additional class name.
 */
const CircularProgress = ({ course, className }) => {
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
    <div
      style={{ width: "100px", height: "100px", position: "relative" }}
      className={className}
    >
      <CircularProgressbar
        value={progress}
        styles={buildStyles({
          textColor: "#444444",
          pathColor: "rgb(83 169 255)",
          trailColor: "#e0e0df",
          textSize: "20px",
          pathTransitionDuration: 0.5,
          pathTransition: "ease-in-out",
        })}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "#444444",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <div style={{ fontSize: "20px", fontWeight: "normal" }}>{course}</div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              color: "#A9A9A9",
              marginLeft: "2px",
            }}
          >
            %
          </div>
        </div>
        <div
          style={{ fontSize: "10px", fontWeight: "normal", color: "#A9A9A9" }}
        >
          progress
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
