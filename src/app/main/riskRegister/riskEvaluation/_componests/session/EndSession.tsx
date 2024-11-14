import { TextField } from "@mui/material";
import Button from "../../../common/Button";
import CommonModal from "../../../common/CommonModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { apiAuth } from "src/utils/http";

const EndSession = ({ open, handleClose, riskId, sessionId }) => {
  const [comment, setComment] = useState<string>("");
  const [commentError, setCommentError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const handleEndSession = () => {
    if (comment === "") {
      setCommentError("Comment is required");
      return;
    }
    setLoading(true);
    apiAuth
      .put(`/RiskRegister/session/end/${riskId}/${sessionId}`, {
        comments: comment,
      })
      .then((res) => {
        if (res.data.statusCode == 200) {
          toast.success(res.data.message);
          handleClose();
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <CommonModal title="End Session" open={open} handleClose={handleClose}>
      <div className="flex flex-col">
        <div className="flex flex-col">
          <p className="text-gray-500">
            You are about to end the session. Once ended, you will no longer be
            able to edit or add tasks. Are you sure you want to continue?
          </p>
          <div className="flex flex-col my-20">
            <TextField
              className="mt-10"
              id="outlined-basic"
              label="Comment*"
              variant="outlined"
              onChange={(e) => {
                setComment(e.target.value);
                setCommentError("");
              }}
            />
            {commentError && (
              <p className="text-red-500 text-sm">{commentError}</p>
            )}
          </div>
        </div>
        <div className="flex my-20 flex-row gap-10 w-full text-right justify-end">
          <Button
            onClick={() => {
              handleClose();
            }}
            type="button"
            variant="neutral"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleEndSession();
            }}
            type="button"
            variant="approve"
          >
            End Session
          </Button>
        </div>
      </div>
    </CommonModal>
  );
};
export default EndSession;
