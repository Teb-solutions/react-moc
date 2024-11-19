import {
  FormControl,
  Icon,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { FormLabel, InputLabel, OutlinedInput } from "@mui/material";
import Button from "../../../common/Button";
import { useEffect, useState } from "react";
import useFetchLookUpData from "../common/useFetchLookUpData";
import { likelihoodValues, severityValues } from "../common/riskAnalysisHook";
import AddControlMeasures from "../common/AddControlMeasures";
import { ControlMeasures } from "../../../helpers/enum";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalculateFrequencyScoring,
  CalculatePotentialRisk,
  CalculateRiskClassification,
} from "src/app/main/moc/common_components/RiskAnalysisCalculate";
import { set } from "lodash";
import { ISelectedControlMeasures } from "../../../helpers/type";
import { useTaskStore } from "../common/taskStore";
import RiskClassificationDisplay from "../../../common/RiskClassificationDisplay";

export const AddTaskSchema = z.object({
  riskId: z.number(),
  task: z.string().nonempty("Task is required"),
  subTask: z.string().nonempty("Sub task is required"),
  hazardousSituation: z.string().nonempty("Hazardous situation is required"),
  consequences: z.string().nonempty("Consequences is required"),
  hazardType: z.number(),
  time: z.number(),
  frequencyDetails: z.number(),
  frequencyScoring: z.number(),
  likelyhoodScoring: z.number(),
  severityScoring: z.number(),
  potentialRisk: z.number(),
  humanControlMeasures: z.array(z.any()),
  technicalControlMeasures: z.array(z.any()),
  organizationalControlMeasures: z.array(z.any()),
  residualTime: z.number(),
  residualFrequency: z.number(),
  residualFrequencyScoring: z.number(),
  residualLikelyhoodScoring: z.number(),
  residualSeverityScoring: z.number(),
  residualRisk: z.number(),
  residualRiskClassification: z.string(),
  residualRiskClassificationDisplay: z.string(),
});

type AddTaskFormValues = z.infer<typeof AddTaskSchema>;

const AddTask = ({ riskId }: { riskId: number }) => {
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [selectedResidualTime, setSelectedResidualTime] = useState<
    number | null
  >(null);

  //storing all the control measures in an array
  const [selectedHumanControlMeasures, setSelectedHumanControlMeasures] =
    useState<ISelectedControlMeasures[] | null>(null);
  const [
    selectedTechnicalControlMeasures,
    setSelectedTechnicalControlMeasures,
  ] = useState<ISelectedControlMeasures[] | null>(null);
  const [
    selectedOrganizationalControlMeasures,
    setSelectedOrganizationalControlMeasures,
  ] = useState<ISelectedControlMeasures[] | null>(null);

  //URLs for fetching lookup data for hazard type, time, frequency and residual frequency
  const hazardTypeUrl = "/LookupData/Lov/28";
  const timeUrl = "/LookupData/Lov/29";
  const frequencyUrl = selectedTime
    ? `/LookupData/Lov/30/${selectedTime}`
    : null;
  const residualFrequencyUrl = selectedResidualTime
    ? `/LookupData/Lov/30/${selectedResidualTime}`
    : null;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddTaskFormValues>({
    resolver: zodResolver(AddTaskSchema),
    defaultValues: {
      riskId: riskId,
    },
  });

  //fetching lookup data for hazard type, time, frequency and residual frequency

  const {
    data: hazardTypes,
    loading: hazardLoading,
    error: hazardError,
  } = useFetchLookUpData(hazardTypeUrl);
  const {
    data: timesArr,
    loading: timeLoading,
    error: timeError,
  } = useFetchLookUpData(timeUrl);
  const {
    data: frequencyArr,
    loading: frequencyLoading,
    error: frequencyError,
  } = useFetchLookUpData(frequencyUrl);
  const {
    data: residualFrequencyArr,
    loading: residualFrequencyLoading,
    error: residualFrequencyError,
  } = useFetchLookUpData(residualFrequencyUrl);

  //watching the changes in  the form values and
  // calculating the potential frequency scoring, residual frequency scoring,
  // potential risk and residual risk

  const timeChange = watch("time");
  const frequencyChange = watch("frequencyDetails");
  const residualTimeChange = watch("residualTime");
  const residualFrequencyChange = watch("residualFrequency");
  const frequencyScoringWatch = watch("frequencyScoring");
  const residualFrequencyScoringWatch = watch("residualFrequencyScoring");
  const likelyhoodScoringWatch = watch("likelyhoodScoring");
  const severityScoringWatch = watch("severityScoring");
  const residualLikelyhoodScoringWatch = watch("residualLikelyhoodScoring");
  const residualSeverityScoringWatch = watch("residualSeverityScoring");
  const residualRiskWatch = watch("residualRisk");

  //useEffect to update the selected time and residual time,
  // potential frequency scoring and residual frequency scoring
  useEffect(() => {
    setSelectedTime(timeChange);
    setSelectedResidualTime(residualTimeChange);

    if (timeChange > 0 && frequencyChange > 0) {
      const selectedFrequency = frequencyArr.find(
        (frequency) => frequency.value === frequencyChange
      );
      const frequencyScoring = CalculateFrequencyScoring(
        selectedFrequency.text
      );
      setValue("frequencyScoring", frequencyScoring);
    }
    if (residualTimeChange > 0 && residualFrequencyChange > 0) {
      const selectedFrequency = residualFrequencyArr.find(
        (frequency) => frequency.value === residualFrequencyChange
      );
      const frequencyScoring = CalculateFrequencyScoring(
        selectedFrequency.text
      );
      setValue("residualFrequencyScoring", frequencyScoring);
    }
  }, [
    timeChange,
    frequencyChange,
    residualTimeChange,
    residualFrequencyChange,
  ]);

  //useEffect to calculate the potential risk and residual risk
  useEffect(() => {
    if (
      frequencyScoringWatch &&
      frequencyScoringWatch > 0 &&
      likelyhoodScoringWatch &&
      likelyhoodScoringWatch > 0 &&
      severityScoringWatch &&
      severityScoringWatch > 0
    ) {
      const potentialRisk = CalculatePotentialRisk(
        frequencyScoringWatch,
        likelyhoodScoringWatch,
        severityScoringWatch
      );
      potentialRisk && setValue("potentialRisk", potentialRisk);
    }
    if (
      residualFrequencyScoringWatch &&
      residualFrequencyScoringWatch > 0 &&
      residualLikelyhoodScoringWatch &&
      residualLikelyhoodScoringWatch > 0 &&
      residualSeverityScoringWatch &&
      residualSeverityScoringWatch > 0
    ) {
      {
        const residualRisk = CalculatePotentialRisk(
          residualFrequencyScoringWatch,
          residualLikelyhoodScoringWatch,
          residualSeverityScoringWatch
        );
        residualRisk && setValue("residualRisk", residualRisk);
      }
    }
  }, [
    frequencyScoringWatch,
    residualFrequencyScoringWatch,
    likelyhoodScoringWatch,
    severityScoringWatch,
    residualLikelyhoodScoringWatch,
    residualSeverityScoringWatch,
  ]);

  //useEffect to calculate the final task risk classification
  useEffect(() => {
    const { classification, classificationValue } =
      CalculateRiskClassification(residualRiskWatch);
    setValue("residualRiskClassification", classificationValue);
    setValue("residualRiskClassificationDisplay", classification);
  }, [residualRiskWatch]);

  //useEffect to update the control measures in the form values
  useEffect(() => {
    console.clear();
    console.log(selectedHumanControlMeasures);
    selectedHumanControlMeasures &&
      setValue(
        "humanControlMeasures",
        selectedHumanControlMeasures.length > 0
          ? selectedHumanControlMeasures
          : null
      );
    selectedTechnicalControlMeasures &&
      setValue(
        "technicalControlMeasures",
        selectedTechnicalControlMeasures.length > 0
          ? selectedTechnicalControlMeasures
          : null
      );
    selectedOrganizationalControlMeasures &&
      setValue(
        "organizationalControlMeasures",
        selectedOrganizationalControlMeasures.length > 0
          ? selectedOrganizationalControlMeasures
          : null
      );
  }, [
    selectedHumanControlMeasures,
    selectedOrganizationalControlMeasures,
    selectedTechnicalControlMeasures,
  ]);

  const { tasks, setTasks, setSelectedTask } = useTaskStore();

  const onTaskFormSubmit = (data: AddTaskFormValues) => {
    console.log(data);
    setTasks([...tasks, data as any]);
    setSelectedTask(data as any);
  };
  return (
    <form onSubmit={handleSubmit(onTaskFormSubmit)}>
      <div
        className="grid grid-cols-2 w-full gap-20 justify-end mx-4 sm:mx-8 py-10"
        style={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        <h3 className="col-span-2">Task Details</h3>
        <div className="col-span-2">
          <TextField
            fullWidth
            error={!!errors.task}
            // helperText={errors.task?.message}
            label="Task*"
            id="task"
            {...register("task")}
          />
          {errors.task && (
            <p className="text-red-500 my-2 text-sm">{errors.task.message}</p>
          )}
        </div>
        <div className="col-span-2">
          <TextField
            fullWidth
            error={!!errors.subTask}
            // helperText={errors.subTask?.message}
            label="Sub Task*"
            id="subTask"
            {...register("subTask")}
          />
          {errors.subTask && (
            <p className="text-red-500 my-2 text-sm">
              {errors.subTask.message}
            </p>
          )}
        </div>
        <div className="col-span-2 sm:w-1/2">
          {hazardLoading && <p>Loading...</p>}
          {!hazardLoading && hazardTypes && (
            <FormControl fullWidth>
              <InputLabel>Hazard Type*</InputLabel>
              <Select
                error={!!errors.hazardType}
                {...register("hazardType")}
                label="Hazard Type*"
              >
                {hazardTypes.map((hazard) => (
                  <MenuItem key={hazard.value} value={hazard.value}>
                    {hazard.text}
                  </MenuItem>
                ))}
              </Select>
              {errors.hazardType && (
                <p className="text-red-500 my-2 text-sm">
                  {errors.hazardType.message}
                </p>
              )}
            </FormControl>
          )}
        </div>
        <div>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Hazardous Situation*"
            id="hazardousSituation"
            error={!!errors.hazardousSituation}
            {...register("hazardousSituation")}
          />
          {errors.hazardousSituation && (
            <p className="text-red-500 my-2 text-sm">
              {errors.hazardousSituation.message}
            </p>
          )}
        </div>
        <div>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Consequences*"
            id="consequences"
            error={!!errors.consequences}
            {...register("consequences")}
          />
          {errors.consequences && (
            <p className="text-red-500 my-2 text-sm">
              {errors.consequences.message}
            </p>
          )}
        </div>
        <hr className="col-span-2" />
        <h3 className="col-span-2">Potential Risk</h3>
        <div>
          {timeLoading && <p>Loading...</p>}
          {!timeLoading && timesArr && (
            <FormControl fullWidth>
              <InputLabel>Time*</InputLabel>
              <Select error={!!errors.time} {...register("time")} label="Time*">
                {timesArr.map((time) => (
                  <MenuItem key={time.value} value={time.value}>
                    {time.text}
                  </MenuItem>
                ))}
              </Select>
              {errors.time && (
                <p className="text-red-500 my-2 text-sm">
                  {errors.time.message}
                </p>
              )}
            </FormControl>
          )}
        </div>
        <div>
          {frequencyLoading && <p>Loading...</p>}
          {!frequencyLoading && frequencyArr && (
            <FormControl fullWidth>
              <InputLabel>Frequency*</InputLabel>
              <Select
                error={!!errors.frequencyDetails}
                {...register("frequencyDetails")}
                label="Frequency*"
              >
                {frequencyArr.map((frequency) => (
                  <MenuItem key={frequency.value} value={frequency.value}>
                    {frequency.text}
                  </MenuItem>
                ))}
              </Select>
              {errors.frequencyDetails && (
                <p className="text-red-500 my-2 text-sm">
                  {errors.frequencyDetails.message}
                </p>
              )}
            </FormControl>
          )}
        </div>
        <div>
          <TextField
            fullWidth
            error={!!errors.frequencyScoring}
            label="Frequency Scoring*"
            id="frequencyScoring"
            disabled
            InputLabelProps={{ shrink: frequencyScoringWatch > 0 }}
            {...register("frequencyScoring")}
          />
          {errors.frequencyScoring && (
            <p className="text-red-500 my-2 text-sm">
              {errors.frequencyScoring.message}
            </p>
          )}
        </div>
        <div>
          <FormControl fullWidth>
            <InputLabel>Likelyhood Scoring*</InputLabel>
            <Select
              error={!!errors.likelyhoodScoring}
              {...register("likelyhoodScoring")}
              label="Likelyhood Scoring*"
            >
              {likelihoodValues.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            {errors.likelyhoodScoring && (
              <p className="text-red-500 my-2 text-sm">
                {errors.likelyhoodScoring.message}
              </p>
            )}
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth>
            <InputLabel>Severity Scoring*</InputLabel>
            <Select
              error={!!errors.severityScoring}
              {...register("severityScoring")}
              label="Severity Scoring*"
            >
              {severityValues.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            {errors.severityScoring && (
              <p className="text-red-500 my-2 text-sm">
                {errors.severityScoring.message}
              </p>
            )}
          </FormControl>
        </div>
        <div>
          <TextField
            fullWidth
            label="Potential Risk*"
            id="potentialRisk"
            error={!!errors.potentialRisk}
            {...register("potentialRisk")}
            InputLabelProps={{ shrink: watch("potentialRisk") > 0 }}
            disabled
          />
          {errors.potentialRisk && (
            <p className="text-red-500 my-2 text-sm">
              {errors.potentialRisk.message}
            </p>
          )}
        </div>{" "}
        <hr className="col-span-2" />
        <h3 className="col-span-2">Control Measures</h3>
        <div>
          <AddControlMeasures
            errors={!!errors.humanControlMeasures}
            controlMeasureType={ControlMeasures.Human}
            selectedValues={selectedHumanControlMeasures}
            setSelectedValues={setSelectedHumanControlMeasures}
          />
        </div>
        <div>
          <AddControlMeasures
            errors={!!errors.technicalControlMeasures}
            controlMeasureType={ControlMeasures.Technical}
            selectedValues={selectedTechnicalControlMeasures}
            setSelectedValues={setSelectedTechnicalControlMeasures}
          />
        </div>
        <div>
          <AddControlMeasures
            errors={!!errors.organizationalControlMeasures}
            controlMeasureType={ControlMeasures.Organizational}
            selectedValues={selectedOrganizationalControlMeasures}
            setSelectedValues={setSelectedOrganizationalControlMeasures}
          />
        </div>
        <hr className="col-span-2" />
        <h3 className="col-span-2">Residual Risk</h3>
        <div>
          {timeLoading && (
            <p className="text-red-500 my-2 text-sm">Loading...</p>
          )}
          {!timeLoading && timesArr && (
            <FormControl fullWidth>
              <InputLabel>Time*</InputLabel>
              <Select
                {...register("residualTime")}
                error={!!errors.residualTime}
                label="Time*"
              >
                {timesArr.map((time) => (
                  <MenuItem key={time.value} value={time.value}>
                    {time.text}
                  </MenuItem>
                ))}
              </Select>
              {errors.residualTime && (
                <p className="text-red-500 my-2 text-sm">
                  {errors.residualTime.message}
                </p>
              )}
            </FormControl>
          )}
        </div>
        <div>
          {frequencyLoading && <p>Loading...</p>}
          {!frequencyLoading && frequencyArr && (
            <FormControl fullWidth>
              <InputLabel>Frequency*</InputLabel>
              <Select
                error={!!errors.residualFrequency}
                {...register("residualFrequency")}
                label="Frequency*"
              >
                {residualFrequencyArr.map((frequency) => (
                  <MenuItem key={frequency.value} value={frequency.value}>
                    {frequency.text}
                  </MenuItem>
                ))}
              </Select>
              {errors.residualFrequency && (
                <p className="text-red-500 my-2 text-sm">
                  {errors.residualFrequency.message}
                </p>
              )}
            </FormControl>
          )}
        </div>
        <div>
          <TextField
            fullWidth
            label="Frequency Scoring*"
            id="frequencyScoring"
            error={!!errors.residualFrequencyScoring}
            InputLabelProps={{ shrink: residualFrequencyScoringWatch > 0 }}
            disabled
            {...register("residualFrequencyScoring")}
          />
          {errors.residualFrequencyScoring && (
            <p className="text-red-500 my-2 text-sm">
              {errors.residualFrequencyScoring.message}
            </p>
          )}
        </div>
        <div>
          <FormControl fullWidth>
            <InputLabel>Likelyhood Scoring*</InputLabel>
            <Select
              {...register("residualLikelyhoodScoring")}
              error={!!errors.residualLikelyhoodScoring}
              label="Likelyhood Scoring*"
            >
              {likelihoodValues.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            {errors.residualLikelyhoodScoring && (
              <p className="text-red-500 my-2 text-sm">
                {errors.residualLikelyhoodScoring.message}
              </p>
            )}
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth>
            <InputLabel>Severity Scoring*</InputLabel>
            <Select
              error={!!errors.residualSeverityScoring}
              {...register("residualSeverityScoring")}
              label="Severity Scoring*"
            >
              {severityValues.map((value) => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
            {errors.residualSeverityScoring && (
              <p className="text-red-500 my-2 text-sm">
                {errors.residualSeverityScoring.message}
              </p>
            )}
          </FormControl>
        </div>
        <div>
          <TextField
            fullWidth
            label="Residual Risk*"
            id="residualRisk"
            disabled
            error={!!errors.residualRisk}
            InputLabelProps={{ shrink: residualRiskWatch > 0 }}
            {...register("residualRisk")}
          />
          {errors.residualRisk && (
            <p className="text-red-500 my-2 text-sm">
              {errors.residualRisk.message}
            </p>
          )}
        </div>{" "}
      </div>
      <div className="flex flex-row justify-between gap-10 mt-10">
        <RiskClassificationDisplay
          residualRiskClassification={watch("residualRiskClassification")}
          residualRiskClassificationDisplay={watch(
            "residualRiskClassificationDisplay"
          )}
        />
        <div className="flex flex-row gap-10">
          <Button variant="neutral" type="button">
            Cancel
          </Button>
          <Button variant="approve" type="submit">
            Add Task
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddTask;
