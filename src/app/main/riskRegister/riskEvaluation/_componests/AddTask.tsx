import { FormControl } from "@mui/base";
import { FormLabel, OutlinedInput } from "@mui/material";
import Button from "../../common/Button";

const AddTask = () => {
  return (
    <FormControl>
      <div
        className="grid grid-cols-2 gap-10 justify-end mx-4 sm:mx-8 py-10"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <hr className="col-span-2" />
        <div>
          <FormLabel>Task Title</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter task description"
            multiline
            rows={1}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Area</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter area"
            multiline
            rows={1}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Role</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter role"
            multiline
            rows={1}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Hazard Type</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter role"
            multiline
            rows={1}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Hazardous Situation</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter hazardous situation"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Consequences</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter consequences"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <hr className="col-span-2" />
        <h3 className="col-span-2">Potential Risk</h3>
        <div>
          <FormLabel>Time</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter time"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Frequency</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter frequency"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Frequency scoring</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter frequency scoring"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Likelyhood Scoring</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter likelyhood scoring"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Severity Scoring</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter severity scoring"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Potential Risk</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Potential risk"
            multiline
            rows={2}
            fullWidth
          />
        </div>{" "}
        <hr className="col-span-2" />
        <h3 className="col-span-2">Control Measures</h3>
        <div>
          <FormLabel>Human</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter human control measures"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Technical</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter technical control measures"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Organizational</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter organizational control measures"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <hr className="col-span-2" />
        <h3 className="col-span-2">Residual Risk</h3>
        <div>
          <FormLabel>Time</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter time"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Frequency</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter frequency"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Frequency scoring</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter frequency scoring"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Likelyhood Scoring</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter likelyhood scoring"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Severity Scoring</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="Enter severity scoring"
            multiline
            rows={2}
            fullWidth
          />
        </div>
        <div>
          <FormLabel>Residual Risk</FormLabel>
          <OutlinedInput
            id="task-description"
            placeholder="residual risk"
            multiline
            rows={2}
            fullWidth
          />
        </div>
      </div>
      <div className="flex flex-row justify-center gap-10 mt-10">
        <Button variant="neutral" type="button">
          Cancel
        </Button>
        <Button variant="approve" type="button">
          Add
        </Button>
      </div>
    </FormControl>
  );
};

export default AddTask;
