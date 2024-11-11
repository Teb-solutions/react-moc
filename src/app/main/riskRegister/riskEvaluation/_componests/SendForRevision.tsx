import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import Button from "../../common/Button";
import CommonModal from "../../common/CommonModal";

const SendForRevision = ({
  openRevision,
  handleRevision,
}: {
  openRevision: boolean;
  handleRevision: () => void;
}) => {
  return (
    <CommonModal
      open={openRevision}
      handleClose={handleRevision}
      title="Send for Revision"
    >
      <div className="flex flex-col">
        <div className="flex flex-col my-20">
          <p>Are you sure you want to send this request for revision?</p>
          <p>
            The request will be sent back to the selected phase for further
            modification.
          </p>
          <div className="flex flex-col my-20">
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">
                <h3>Phase</h3>
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
              >
                <FormControlLabel
                  value="female"
                  control={<Radio />}
                  label="Approval"
                />
                <FormControlLabel
                  value="male"
                  control={<Radio />}
                  label="Evaluation"
                />
              </RadioGroup>
            </FormControl>
            <FormControl className="w-[600px] my-10">
              <InputLabel id="demo-simple-select-label">Approver*</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                // value={age}
                label="Approver*"
                // onChange={handleChange}
              >
                <MenuItem value={10}>Approver 1</MenuItem>
                <MenuItem value={20}>Approver 2</MenuItem>
                <MenuItem value={30}>Approver 3</MenuItem>
              </Select>
            </FormControl>
            <TextField
              className="mt-10"
              id="outlined-basic"
              label="Comment*"
              variant="outlined"
            />
          </div>
        </div>
        <div className="flex my-20 flex-row gap-10 w-full text-right justify-end">
          <Button
            onClick={() => {
              // sendForRevision();
            }}
            type="button"
            variant="neutral"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              // sendForRevision();
            }}
            type="button"
            variant="approve"
          >
            Send for Revision
          </Button>
        </div>
      </div>
    </CommonModal>
  );
};
export default SendForRevision;
