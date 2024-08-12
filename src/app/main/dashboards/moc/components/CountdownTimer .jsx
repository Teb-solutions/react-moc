import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

const CountdownTimer = forwardRef(({ Session, show }, ref) => {
  const [currentSeconds, setCurrentSeconds] = useState(() => {
    const storedTime = localStorage.getItem("currentSeconds");
    return storedTime ? parseInt(storedTime, 10) : 0;
  });

  const [lastUpdate, setLastUpdate] = useState(() => {
    const storedUpdate = localStorage.getItem("lastUpdate");
    return storedUpdate ? new Date(parseInt(storedUpdate, 10)) : new Date();
  });

  useEffect(() => {
    let timer;
    if (Session?.activeSession?.status === 2) {
      timer = setInterval(() => {
        setCurrentSeconds((prevSeconds) => {
          const now = new Date();
          const elapsedTime = Math.floor((now - lastUpdate) / 1000);
          const newTime = prevSeconds + elapsedTime;
          localStorage.setItem("currentSeconds", newTime.toString());
          setLastUpdate(now);
          localStorage.setItem("lastUpdate", now.getTime().toString());
          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [Session, lastUpdate]);

  useImperativeHandle(ref, () => ({
    startTimer: () => {
      setCurrentSeconds(0);
      localStorage.setItem("currentSeconds", "0");
      const now = new Date();
      setLastUpdate(now);
      localStorage.setItem("lastUpdate", now.getTime().toString());
    },
    resetTimer: () => {
      setCurrentSeconds(0);
      localStorage.removeItem("currentSeconds");
      localStorage.removeItem("lastUpdate");
    },
    stopTimer: () => {
      // This method doesn't do anything in the new code but can be used if needed
    },
  }));

  const hours = Math.floor(currentSeconds / 3600);
  const minutes = Math.floor((currentSeconds % 3600) / 60);
  const seconds = currentSeconds % 60;

  return (
    <>
      {Session?.activeSession?.status === 2 && (
        <span>
          {show && "Stop Session"}
          <b className="text-red">
            {hours} Hr {minutes} Min {seconds} Sec
          </b>
        </span>
      )}
    </>
  );
});

export default CountdownTimer;
