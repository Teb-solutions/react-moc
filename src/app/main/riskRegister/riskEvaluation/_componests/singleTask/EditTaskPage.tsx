import {
  FormControl,
  Icon,
  MenuItem,
  Paper,
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
import { ControlMeasuresType } from "../../../helpers/enum";
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
import { apiAuth } from "src/utils/http";
import { toast } from "react-toastify";
import { mutate } from "swr";
import RatingCalculator from "../common/RatingCalculator";
import { useRatingStore } from "../common/ratingStore";

export const AddTaskSchema = z.object({
  riskRegisterId: z.number(),
  taskName: z.string().nonempty("Task is required"),
  subTaskName: z.string().nonempty("Sub task is required"),
  hazardousSituation: z.string().nonempty("Hazardous situation is required"),
  consequence: z.string().nonempty("Consequences is required"),
  hazardType: z.number(),
  time: z.number(),
  frequencyDetails: z.number(),
  frequencyScoring: z.number(),
  likelihoodScoring: z.number(),
  severityScoring: z.number(),
  potentialRisk: z.number(),
  humanControlMeasures: z.array(z.any()),
  technicalControlMeasures: z.array(z.any()),
  organisationalControlMeasures: z.array(z.any()),
  modifiedTime: z.number(),
  modifiedFrequencyDetails: z.number(),
  residualFrequencyScoring: z.number(),
  residualLikelihoodScoring: z.number(),
  residualSeverityScoring: z.number(),
  residualRisk: z.number(),
  residualRiskClassification: z.string(),
  residualRiskClassificationDisplay: z.string(),
});

type AddTaskFormValues = z.infer<typeof AddTaskSchema>;

const EditTaskPage = (
  {
    // riskId,
    // setIsOpen,
  }: {
    // riskId: number;
    // setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
) => {
  const { selectedTask, isEditTaskClicked, setIsEditTaskClicked } =
    useTaskStore();
  const [selectedTime, setSelectedTime] = useState<number | null>(
    selectedTask && selectedTask?.time
  );
  const [selectedResidualTime, setSelectedResidualTime] = useState<
    number | null
  >(selectedTask && selectedTask?.modifiedTime);

  //storing all the control measures in an array
  const [selectedHumanControlMeasures, setSelectedHumanControlMeasures] =
    useState<ISelectedControlMeasures[] | null>(
      selectedTask?.controlMeasures
        .filter((measure) => measure.type === ControlMeasuresType.Human)
        .map((measure) => ({
          id: measure.controlMeasureId,
          title: measure.controlMeasure,
        }))
    );
  const [
    selectedTechnicalControlMeasures,
    setSelectedTechnicalControlMeasures,
  ] = useState<ISelectedControlMeasures[] | null>(
    selectedTask?.controlMeasures
      .filter((measure) => measure.type === ControlMeasuresType.Technical)
      .map((measure) => ({
        id: measure.controlMeasureId,
        title: measure.controlMeasure,
      }))
  );
  const [
    selectedOrganizationalControlMeasures,
    setSelectedOrganizationalControlMeasures,
  ] = useState<ISelectedControlMeasures[] | null>(
    selectedTask?.controlMeasures
      .filter((measure) => measure.type === ControlMeasuresType.Organizational)
      .map((measure) => ({
        id: measure.controlMeasureId,
        title: measure.controlMeasure,
      }))
  );

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
      riskRegisterId: selectedTask?.riskRegisterId,
      taskName: selectedTask?.taskName,
      subTaskName: selectedTask?.subTaskName,
      hazardousSituation: selectedTask?.hazardousSituation,
      consequence: selectedTask?.consequence,
      hazardType: selectedTask?.hazardType,
      time: selectedTask?.time,
      frequencyDetails: selectedTask?.frequencyDetails,
      frequencyScoring: selectedTask?.frequencyScoring,
      likelihoodScoring: selectedTask?.likelihoodScoring,
      severityScoring: selectedTask?.severityScoring,
      potentialRisk: selectedTask?.potentialRisk,
      humanControlMeasures: selectedTask?.controlMeasures.filter(
        (measure) => measure.type === ControlMeasuresType.Human
      ),
      technicalControlMeasures: selectedTask?.controlMeasures.filter(
        (measure) => measure.type === ControlMeasuresType.Technical
      ),
      organisationalControlMeasures: selectedTask?.controlMeasures.filter(
        (measure) => measure.type === ControlMeasuresType.Organizational
      ),
      modifiedTime: selectedTask?.modifiedTime,
      modifiedFrequencyDetails: selectedTask?.modifiedFrequencyDetails,
      residualFrequencyScoring: selectedTask?.residualFrequencyScoring,
      residualLikelihoodScoring: selectedTask?.residualLikelihoodScoring,
      residualSeverityScoring: selectedTask?.residualSeverityScoring,
      residualRisk: selectedTask?.residualRisk,
      // residualRiskClassification: selectedTask?.residualRiskClassification,
      residualRiskClassificationDisplay:
        selectedTask?.residualRiskClassificationDisplay,
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
  const frequencyScoringWatch = watch("frequencyScoring");
  const residualFrequencyScoringWatch = watch("residualFrequencyScoring");
  const residualRiskWatch = watch("residualRisk");
  const hazardTypeWatch = watch("hazardType");

  //here we are trying to update the potential frequency scoring and residual frequency scoring
  // based on the selected frequency and residual frequency from the drawer element
  const {
    severityRating,
    potentialProbabilityRating,
    residualProbabilityRating,
    setPotentialProbabilityRating,
    setSeverityRating,
    setResidualProbabilityRating,
  } = useRatingStore();

  useEffect(() => {
    setPotentialProbabilityRating(selectedTask?.likelihoodScoring);
    setSeverityRating(selectedTask?.severityScoring);
    setResidualProbabilityRating(selectedTask?.residualLikelihoodScoring);
  }, []);

  // useEffect(() => {
  //   setPotentialProbabilityRating(null);
  //   setSeverityRating(null);
  //   setResidualProbabilityRating(null);
  //   setValue("potentialRisk", null);
  //   setValue("residualRisk", null);
  // }, [hazardTypeWatch]);

  useEffect(() => {}, [timeChange, frequencyChange]);

  //useEffect to update the selected time and residual time,
  // potential frequency scoring and residual frequency scoring
  useEffect(() => {
    if (timeChange) {
      setValue("modifiedTime", timeChange);
    }
    if (frequencyChange) {
      setValue("modifiedFrequencyDetails", frequencyChange);
    }
    setSelectedTime(timeChange);
    setSelectedResidualTime(timeChange);

    if (timeChange > 0 && frequencyChange > 0) {
      const selectedFrequency = frequencyArr.find(
        (frequency) => frequency.value === frequencyChange
      );
      if (selectedFrequency) {
        const frequencyScoring = CalculateFrequencyScoring(
          selectedFrequency.text
        );
        setValue("frequencyScoring", frequencyScoring);
        setValue("residualFrequencyScoring", frequencyScoring);
      }
    }
  }, [timeChange, frequencyChange]);

  //useEffect to calculate the potential risk and residual risk
  useEffect(() => {
    setValue("likelihoodScoring", potentialProbabilityRating);
    setValue("severityScoring", severityRating);
    setValue("residualLikelihoodScoring", residualProbabilityRating);
    setValue("residualSeverityScoring", severityRating);
    if (
      frequencyScoringWatch &&
      frequencyScoringWatch > 0 &&
      potentialProbabilityRating &&
      potentialProbabilityRating > 0 &&
      severityRating &&
      severityRating > 0
    ) {
      const potentialRisk = CalculatePotentialRisk(
        frequencyScoringWatch,
        potentialProbabilityRating,
        severityRating
      );
      console.log(
        frequencyScoringWatch,
        severityRating,
        potentialProbabilityRating
      );
      console.log(potentialRisk, "calculated potential risk");
      potentialRisk && setValue("potentialRisk", potentialRisk);
    }
    if (
      residualFrequencyScoringWatch &&
      residualFrequencyScoringWatch > 0 &&
      potentialProbabilityRating &&
      potentialProbabilityRating > 0 &&
      residualProbabilityRating &&
      severityRating &&
      severityRating > 0
    ) {
      {
        const residualRisk = CalculatePotentialRisk(
          residualFrequencyScoringWatch,
          potentialProbabilityRating + residualProbabilityRating <= 0
            ? 0
            : potentialProbabilityRating + residualProbabilityRating,
          severityRating
        );
        console.log(
          residualFrequencyScoringWatch,
          severityRating,
          potentialProbabilityRating + residualProbabilityRating
        );
        console.log(residualRisk, "calculated residual risk");
        residualRisk && setValue("residualRisk", residualRisk);
      }
    }
  }, [
    severityRating,
    potentialProbabilityRating,
    residualProbabilityRating,
    residualFrequencyScoringWatch,
    frequencyScoringWatch,
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
        "organisationalControlMeasures",
        selectedOrganizationalControlMeasures.length > 0
          ? selectedOrganizationalControlMeasures
          : null
      );
  }, [
    selectedHumanControlMeasures,
    selectedOrganizationalControlMeasures,
    selectedTechnicalControlMeasures,
  ]);

  const updateEditedControlMeasures = () => {
    //this code is to update the deleted control measures and retain others in the task

    //this code is to update the deleted control measures and retain others in the task

    const humanCsFiltered = selectedTask?.controlMeasures.filter(
      (measure) => measure.type === ControlMeasuresType.Human
    );
    const humanCSWithDeleted = humanCsFiltered.map((measure) =>
      selectedHumanControlMeasures.find(
        (selectedMeasure) => selectedMeasure.id === measure.controlMeasureId
      )
        ? {
            isDeleted: false,
            id: measure.id,
            type: measure.type,
            controlMeasure: measure.controlMeasure,
            controlMeasureId: measure.controlMeasureId,
          }
        : {
            isDeleted: true,
            id: measure.id,
            type: measure.type,
            controlMeasure: measure.controlMeasure,
            controlMeasureId: measure.controlMeasureId,
          }
    );
    const technicalCsFiltered = selectedTask?.controlMeasures.filter(
      (measure) => measure.type === ControlMeasuresType.Technical
    );
    const technicalCSWithDeleted = technicalCsFiltered.map((measure) =>
      measure.type === ControlMeasuresType.Technical &&
      selectedTechnicalControlMeasures.find(
        (selectedMeasure) => selectedMeasure.id === measure.controlMeasureId
      )
        ? {
            isDeleted: false,
            id: measure.id,
            type: measure.type,
            controlMeasure: measure.controlMeasure,
            controlMeasureId: measure.controlMeasureId,
          }
        : {
            isDeleted: true,
            id: measure.id,
            type: measure.type,
            controlMeasure: measure.controlMeasure,
            controlMeasureId: measure.controlMeasureId,
          }
    );
    const organizationalCsFiltered = selectedTask?.controlMeasures.filter(
      (measure) => measure.type === ControlMeasuresType.Organizational
    );

    const organizationalCSWithDeleted = organizationalCsFiltered.map(
      (measure) =>
        measure.type === ControlMeasuresType.Organizational &&
        selectedOrganizationalControlMeasures.find(
          (selectedMeasure) => selectedMeasure.id === measure.controlMeasureId
        )
          ? {
              isDeleted: false,
              id: measure.id,
              type: measure.type,
              controlMeasure: measure.controlMeasure,
              controlMeasureId: measure.controlMeasureId,
            }
          : {
              isDeleted: true,
              id: measure.id,
              type: measure.type,
              controlMeasure: measure.controlMeasure,
              controlMeasureId: measure.controlMeasureId,
            }
    );

    //this is to filter only new control measures added while editing to the task
    const newHumanCS = selectedHumanControlMeasures
      .filter(
        (measure) =>
          !selectedTask?.controlMeasures.find(
            (selectedMeasure) =>
              selectedMeasure.controlMeasureId === measure.id &&
              selectedMeasure.type === ControlMeasuresType.Human
          )
      )
      .map((measure) => ({
        id: 0,
        type: ControlMeasuresType.Human as number,
        controlMeasure: measure.title,
        controlMeasureId: measure.id,
        isDeleted: false,
      }));

    const newTechnicalCS = selectedTechnicalControlMeasures
      .filter(
        (measure) =>
          !selectedTask?.controlMeasures.find(
            (selectedMeasure) =>
              selectedMeasure.controlMeasureId === measure.id &&
              selectedMeasure.type === ControlMeasuresType.Technical
          )
      )
      .map((measure) => ({
        id: 0,
        type: ControlMeasuresType.Technical as number,
        controlMeasure: measure.title,
        controlMeasureId: measure.id,
        isDeleted: false,
      }));

    const newOrganizationalCS = selectedOrganizationalControlMeasures
      .filter(
        (measure) =>
          !selectedTask?.controlMeasures.find(
            (selectedMeasure) =>
              selectedMeasure.controlMeasureId === measure.id &&
              selectedMeasure.type === ControlMeasuresType.Organizational
          )
      )
      .map((measure) => ({
        id: 0,
        type: ControlMeasuresType.Organizational as number,
        controlMeasure: measure.title,
        controlMeasureId: measure.id,
        isDeleted: false,
      }));

    const humanCS = [...humanCSWithDeleted, ...newHumanCS];
    const technicalCS = [...technicalCSWithDeleted, ...newTechnicalCS];
    const organizationalCS = [
      ...organizationalCSWithDeleted,
      ...newOrganizationalCS,
    ];

    const controlMeasures = [...humanCS, ...technicalCS, ...organizationalCS];

    return controlMeasures;
  };

  const onTaskFormSubmit = (data: AddTaskFormValues) => {
    // console.log(data);
    const payload: any = data;

    payload.controlMeasures = updateEditedControlMeasures();
    delete payload.humanControlMeasures;
    delete payload.technicalControlMeasures;
    delete payload.organisationalControlMeasures;
    // console.log(payload.controlMeasures);
    // return;
    apiAuth
      .put(
        `/RiskRegister/task/${selectedTask?.riskRegisterId}/${selectedTask?.taskId}`,
        payload
      )
      .then((response) => {
        if (response.data.statusCode === 200) {
          toast.success("Task updated successfully");

          // mutate(`/RiskRegister/task/list/${selectedTask?.riskRegisterId}`);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to update task");
      })
      .finally(() => {
        // setSelectedHumanControlMeasures([]);
        // setSelectedTechnicalControlMeasures([]);
        // setSelectedOrganizationalControlMeasures([]);
        setIsEditTaskClicked(false);
      });
  };
  return (
    <Paper className="flex flex-col p-20">
      <form onSubmit={handleSubmit(onTaskFormSubmit)}>
        <Button
          variant="neutral"
          type="button"
          onClick={() => setIsEditTaskClicked(false)}
        >
          {"<< "}Back
        </Button>

        <div
          className="grid grid-cols-2 w-full gap-20 pr-10 justify-end mx-4 sm:mx-8 py-10"
          // style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <h3 className="col-span-2">Task Details</h3>
          <div className="col-span-2">
            <TextField
              fullWidth
              error={!!errors.taskName}
              // helperText={errors.task?.message}
              label="Task*"
              id="task"
              {...register("taskName")}
            />
            {errors.taskName && (
              <p className="text-red-500 my-2 text-sm">
                {errors.taskName.message}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <TextField
              fullWidth
              error={!!errors.subTaskName}
              // helperText={errors.subTask?.message}
              label="Sub Task*"
              id="subTask"
              {...register("subTaskName")}
            />
            {errors.subTaskName && (
              <p className="text-red-500 my-2 text-sm">
                {errors.subTaskName.message}
              </p>
            )}
          </div>
          <div className="col-span-1 ">
            {hazardLoading && <p>Loading...</p>}
            {!hazardLoading && hazardTypes && (
              <FormControl fullWidth>
                <InputLabel>Hazard Type*</InputLabel>
                <Select
                  error={!!errors.hazardType}
                  {...register("hazardType")}
                  defaultValue={selectedTask?.hazardType}
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
          <div></div>
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
              error={!!errors.consequence}
              {...register("consequence")}
            />
            {errors.consequence && (
              <p className="text-red-500 my-2 text-sm">
                {errors.consequence.message}
              </p>
            )}
          </div>
          <hr className="col-span-2" />
          <div className="col-span-2 flex flex-row gap-20">
            <h3>Potential Risk</h3>

            {hazardTypeWatch && (
              <RatingCalculator
                hazardTypeWatch={hazardTypeWatch}
                hazardTypes={hazardTypes}
              />
            )}
          </div>
          <div>
            {timeLoading && <p>Loading...</p>}
            {!timeLoading && timesArr && (
              <FormControl fullWidth>
                <InputLabel>Time*</InputLabel>
                <Select
                  error={!!errors.time}
                  defaultValue={selectedTask?.time}
                  {...register("time")}
                  label="Time*"
                >
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
                  defaultValue={selectedTask?.frequencyDetails}
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
              <TextField
                fullWidth
                error={!!errors.likelihoodScoring}
                label="Likelyhood Scoring*"
                id="likelihoodScoring"
                value={
                  potentialProbabilityRating || selectedTask?.likelihoodScoring
                }
                InputLabelProps={{
                  shrink:
                    potentialProbabilityRating > 0 ||
                    selectedTask?.likelihoodScoring > 0,
                }}
                disabled
                {...register("likelihoodScoring")}
              />
              {errors.likelihoodScoring && (
                <p className="text-red-500 my-2 text-sm">
                  {errors.likelihoodScoring.message}
                </p>
              )}
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <TextField
                fullWidth
                label="Severity Scoring*"
                id="severityScoring"
                error={!!errors.severityScoring}
                InputLabelProps={{
                  shrink:
                    severityRating > 0 || selectedTask?.severityScoring > 0,
                }}
                value={severityRating || selectedTask?.severityScoring}
                disabled
                {...register("severityScoring")}
              />
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
              value={
                watch("potentialRisk")
                  ? watch("potentialRisk")
                  : selectedTask?.potentialRisk
              }
              InputLabelProps={{
                shrink:
                  watch("potentialRisk") > 0 || selectedTask?.potentialRisk > 0,
              }}
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
              controlMeasureType={ControlMeasuresType.Human}
              selectedValues={selectedHumanControlMeasures}
              setSelectedValues={setSelectedHumanControlMeasures}
            />
          </div>
          <div>
            <AddControlMeasures
              errors={!!errors.technicalControlMeasures}
              controlMeasureType={ControlMeasuresType.Technical}
              selectedValues={selectedTechnicalControlMeasures}
              setSelectedValues={setSelectedTechnicalControlMeasures}
            />
          </div>
          <div>
            <AddControlMeasures
              errors={!!errors.organisationalControlMeasures}
              controlMeasureType={ControlMeasuresType.Organizational}
              selectedValues={selectedOrganizationalControlMeasures}
              setSelectedValues={setSelectedOrganizationalControlMeasures}
            />
          </div>
          <hr className="col-span-2" />
          <div className="col-span-2 flex flex-row gap-20">
            <h3 className="col-span-2">Residual Risk</h3>
            {hazardTypeWatch && (
              <RatingCalculator
                hazardTypeWatch={hazardTypeWatch}
                hazardTypes={hazardTypes}
              />
            )}
          </div>
          <div>
            {timeLoading && (
              <p className="text-red-500 my-2 text-sm">Loading...</p>
            )}
            {!timeLoading && timesArr && (
              <FormControl fullWidth>
                <InputLabel>Time*</InputLabel>
                <Select
                  {...register("modifiedTime")}
                  value={selectedTime}
                  error={!!errors.modifiedTime}
                  disabled
                  label="Time*"
                >
                  {timesArr.map((time) => (
                    <MenuItem key={time.value} value={time.value}>
                      {time.text}
                    </MenuItem>
                  ))}
                </Select>
                <p>{selectedTime}</p>
                <p>{timesArr.map((time) => time.value).join(", ")}</p>
                {errors.modifiedTime && (
                  <p className="text-red-500 my-2 text-sm">
                    {errors.modifiedTime.message}
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
                  error={!!errors.modifiedFrequencyDetails}
                  {...register("modifiedFrequencyDetails")}
                  value={frequencyChange}
                  disabled
                  label="Frequency*"
                >
                  {frequencyArr.map((frequency) => (
                    <MenuItem key={frequency.value} value={frequency.value}>
                      {frequency.text}
                    </MenuItem>
                  ))}
                </Select>
                {errors.modifiedFrequencyDetails && (
                  <p className="text-red-500 my-2 text-sm">
                    {errors.modifiedFrequencyDetails.message}
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
              <TextField
                fullWidth
                label="Likelyhood Scoring*"
                id="residualLikelihoodScoring"
                error={!!errors.residualLikelihoodScoring}
                InputLabelProps={{
                  shrink:
                    residualProbabilityRating != null ||
                    selectedTask?.residualLikelihoodScoring != null,
                }}
                // defaultValue={selectedTask?.residualLikelihoodScoring}
                value={
                  residualProbabilityRating
                    ? potentialProbabilityRating
                      ? potentialProbabilityRating + residualProbabilityRating
                      : residualProbabilityRating
                    : selectedTask?.likelihoodScoring +
                      selectedTask?.residualLikelihoodScoring
                }
                disabled
                {...register("residualLikelihoodScoring")}
              />

              {errors.residualLikelihoodScoring && (
                <p className="text-red-500 my-2 text-sm">
                  {errors.residualLikelihoodScoring.message}
                </p>
              )}
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <TextField
                fullWidth
                label="Severity Scoring*"
                id="residualSeverityScoring"
                defaultValue={selectedTask?.residualSeverityScoring}
                error={!!errors.residualSeverityScoring}
                InputLabelProps={{
                  shrink:
                    severityRating > 0 ||
                    selectedTask?.residualSeverityScoring > 0,
                }}
                value={
                  severityRating
                    ? severityRating
                    : selectedTask?.residualSeverityScoring
                }
                disabled
                {...register("residualSeverityScoring")}
              />
              {errors.residualSeverityScoring && (
                <p className="text-red-500 my-2 text-sm">
                  {errors.residualSeverityScoring.message}
                </p>
              )}
            </FormControl>
          </div>
          <div>
            <FormControl fullWidth>
              <TextField
                fullWidth
                label="Residual Risk*"
                id="residualRisk"
                value={
                  residualRiskWatch
                    ? residualRiskWatch
                    : selectedTask?.residualRisk
                }
                disabled
                error={!!errors.residualRisk}
                InputLabelProps={{
                  shrink:
                    residualRiskWatch > 0 || selectedTask?.residualRisk > 0,
                }}
                {...register("residualRisk")}
              />

              {errors.residualRisk && (
                <p className="text-red-500 my-2 text-sm">
                  {errors.residualRisk.message}
                </p>
              )}
            </FormControl>
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
            <Button
              // onClick={() => setIsOpen(false)}
              variant="neutral"
              type="button"
            >
              Cancel
            </Button>
            <Button variant="approve" type="submit">
              Add Task
            </Button>
          </div>
        </div>
      </form>
    </Paper>
  );
};

export default EditTaskPage;
