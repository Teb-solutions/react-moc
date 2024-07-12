import React, { useState, useEffect } from "react";

const CountdownTimer = ({ Session }) => {
  const sessionTime = localStorage.getItem("timeoutMin");
  const initialSeconds = sessionTime * 60;
  const [currentSeconds, setCurrentSeconds] = useState(() => {
    const storedTime = localStorage.getItem("currentSeconds");
    return storedTime ? parseInt(storedTime, 10) : initialSeconds;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSeconds((prevSeconds) => {
        if (prevSeconds > 0) {
          const newTime = prevSeconds - 1;
          localStorage.setItem("currentSeconds", newTime.toString());
          return newTime;
        } else {
          clearInterval(timer);
          return prevSeconds;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hoursToDay = Math.floor(currentSeconds / 3600);
  const minutesToDay = Math.floor((currentSeconds % 3600) / 60);
  const secondsToDay = currentSeconds % 60;

  return (
    <>
      {Session?.activeSession?.status === 2 && (
        <span>
          Stop Session{" "}
          <b className="text-red">
            {hoursToDay} Hr {minutesToDay} Min {secondsToDay} Sec
          </b>
        </span>
      )}
    </>
  );
};

export default CountdownTimer;
