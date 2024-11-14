import { Icon } from "@mui/material";
import Button from "../../../common/Button";
import { IRiskRegisterDetails, SessionList } from "../../../helpers/type";
import { useEffect, useState } from "react";
import { apiAuth } from "src/utils/http";
import StartSession from "./StartSession";
import ViewSessionHistory from "./ViewSessionHistory";
import { toast } from "react-toastify";
import EndSession from "./EndSession";
import { set } from "lodash";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { SessionStatus } from "../../../helpers/enum";

dayjs.extend(duration);

const RiskSession = ({ risk }: { risk: IRiskRegisterDetails }) => {
  const [sessionList, setSessionList] = useState<SessionList[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStartOpen, setSessionStartOpen] = useState(false);
  const [sessionEndOpen, setSessionEndOpen] = useState(false);
  const [sessionViewOpen, setSessionViewOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const calculateTimeLeft = (endTime: dayjs.Dayjs) => {
    const now = dayjs();
    const duration = dayjs.duration(endTime.diff(now));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sessionList.length > 0) {
        const activeSession = sessionList.find(
          (session) =>
            session.isActive && session.status === SessionStatus.Started
        );
        if (activeSession) {
          const startTime = dayjs(activeSession.startedAt);
          const endTime = startTime.add(activeSession.timeoutMin, "minute");
          setTimeLeft(calculateTimeLeft(endTime));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionList]);
  useEffect(() => {
    apiAuth
      .get(`/RiskRegister/session/list/${risk.id}`)
      .then((res) => {
        // console.log("API Response:", res); // Log the entire response
        if (res.data.statusCode === 200) {
          // console.log("Response data length", res.data.data);
          setSessionList(res.data.data as SessionList[]);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [risk]);
  return (
    <div className="flex flex-col sm:flex-row py-3 gap-10">
      {!loading && sessionList && (
        <>
          <span className="w-[125px] mt-10 text-md font-semibold text-blue-500">
            {timeLeft} {timeLeft.length > 0 && " left"}
          </span>
          <Button
            onClick={() => {
              setSessionViewOpen(true);
            }}
            variant="neutral"
            type="button"
          >
            <Icon className="text-xl">visibility</Icon>View
          </Button>

          {sessionList.length > 0 && (
            <ViewSessionHistory
              open={sessionViewOpen}
              handleClose={() => setSessionViewOpen(false)}
              sessionList={sessionList}
            />
          )}
          {!loading &&
            sessionList &&
            (sessionList.length == 0 ||
              !sessionList[sessionList.length - 1].isActive) && (
              <>
                <Button
                  onClick={() => {
                    setSessionStartOpen(true);
                  }}
                  type="button"
                  variant="approve"
                >
                  <Icon className="text-xl">timer</Icon>
                  Start Session
                </Button>
                <StartSession
                  open={sessionStartOpen}
                  handleClose={() => setSessionStartOpen(false)}
                  riskId={risk.id}
                  teamList={risk.teamList}
                />
              </>
            )}

          {!loading &&
            sessionList &&
            sessionList.length > 0 &&
            sessionList[sessionList.length - 1].isActive && (
              <>
                <Button
                  onClick={() => setSessionEndOpen(true)}
                  type="button"
                  variant="reject"
                >
                  <Icon className="text-xl">close</Icon>
                  End Session
                </Button>
                <EndSession
                  riskId={risk.id}
                  sessionId={sessionList[sessionList.length - 1].id}
                  open={sessionEndOpen}
                  handleClose={() => setSessionEndOpen(false)}
                />
              </>
            )}
        </>
      )}
    </div>
  );
};

export default RiskSession;
