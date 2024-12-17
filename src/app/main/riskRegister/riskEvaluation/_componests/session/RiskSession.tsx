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
import {
  SessionStatus,
  SessionStatusDisplayNames,
} from "../../../helpers/enum";
import { useGetPermenant } from "src/utils/swr";
import { useRiskStore } from "../common/riskstore";

dayjs.extend(duration);

const RiskSession = () => {
  const [sessionList, setSessionList] = useState<SessionList[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStartOpen, setSessionStartOpen] = useState(false);
  const [sessionEndOpen, setSessionEndOpen] = useState(false);
  const [sessionViewOpen, setSessionViewOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const { risk, isCurrentUserPartOfTeam, setIsSessionActive } = useRiskStore();

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
        const activeSession =
          sessionList &&
          sessionList.find(
            (session) =>
              session.isActive && session.status === SessionStatus.Started
          );
        if (activeSession) {
          setIsSessionActive(true);
          const startTime = dayjs(activeSession.startedAt);
          const endTime = startTime.add(activeSession.timeoutMin, "minute");
          setTimeLeft(calculateTimeLeft(endTime));
        } else {
          setIsSessionActive(false);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionList]);

  const {
    data: result,
    isLoading,
    error,
  } = useGetPermenant<{
    data: SessionList[];
    message: string;
    statusCode: number;
  }>(`/RiskRegister/session/list/${risk.id}`);

  useEffect(() => {
    if (result) {
      if (result.statusCode == 200) {
        setLoading(false);
        setSessionList(result.data);
      } else toast.error(result.message);
    }
  }, [result]);
  return (
    <div className="flex flex-col sm:flex-row py-3 gap-10">
      {!loading && sessionList && (
        <>
          <span className="w-[125px] mt-10 text-md text-right font-semibold text-blue-500">
            {timeLeft} {timeLeft.length > 0 && " left"}
          </span>
          <Button
            onClick={() => {
              setSessionViewOpen(true);
            }}
            variant="neutral"
            type="button"
          >
            <Icon className="text-xl">visibility</Icon>
            {sessionList &&
            sessionList[sessionList.length - 1]?.status in
              [SessionStatus.Started, SessionStatus.Created] &&
            sessionList[sessionList.length - 1]?.isActive
              ? SessionStatusDisplayNames[
                  sessionList[sessionList.length - 1]?.status
                ]
              : sessionList.length == 0
                ? "No Session History"
                : "View Session History"}
          </Button>

          {sessionList.length > 0 && (
            <ViewSessionHistory
              open={sessionViewOpen}
              handleClose={() => setSessionViewOpen(false)}
              sessionList={sessionList}
            />
          )}
          {isCurrentUserPartOfTeam &&
            sessionList &&
            (sessionList.length == 0 ||
              !sessionList[sessionList.length - 1]?.isActive) && (
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

          {isCurrentUserPartOfTeam &&
            sessionList &&
            sessionList.length > 0 &&
            sessionList[sessionList.length - 1]?.status ===
              SessionStatus.Started &&
            sessionList[sessionList.length - 1]?.isActive && (
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
