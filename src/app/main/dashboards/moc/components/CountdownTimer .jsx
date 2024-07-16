import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";

const CountdownTimer = forwardRef(({ Session }, ref) => {
  const [currentSeconds, setCurrentSeconds] = useState(() => {
    const storedTime = localStorage.getItem("currentSeconds");
    return storedTime ? parseInt(storedTime, 10) : 0;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSeconds((prevSeconds) => {
        const newTime = prevSeconds + 1;
        localStorage.setItem("currentSeconds", newTime.toString());
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useImperativeHandle(ref, () => ({
    startTimer: () => {
      setCurrentSeconds(0);
      localStorage.setItem("currentSeconds", "0");
    },
  }));

  const hours = Math.floor(currentSeconds / 3600);
  const minutes = Math.floor((currentSeconds % 3600) / 60);
  const seconds = currentSeconds % 60;

  return (
    <>
      {Session?.activeSession?.status === 2 && (
        <span>
          Stop Session{" "}
          <b className="text-red">
            {hours} Hr {minutes} Min {seconds} Sec
          </b>
        </span>
      )}
    </>
  );
});

export default CountdownTimer;
