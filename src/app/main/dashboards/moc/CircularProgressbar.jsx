import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

/**
 * The CourseProgress component.
 */
const CircularProgress = (props) => {
  const { course, className } = props;
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
    <div style={{ width: "100px", height: "100px", position: "relative" }}>
      <CircularProgressbar
        value={progress}
        text={`${course}% `}
        styles={buildStyles({
          textColor: "#000",
          pathColor: "rgb(83 169 255)",
          trailColor: "#e0e0df",
          textSize: "16px",
          backgroundColor: "#3e98c7",
          pathTransitionDuration: 0.5,
          pathTransition: "ease-in-out",
        })}
      />
    </div>
  );
};

export default CircularProgress;
