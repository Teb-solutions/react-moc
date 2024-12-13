import { Icon } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { ISelectedControlMeasures, ITask } from "../../../helpers/type";
import { ControlMeasuresType } from "../../../helpers/enum";
import { useEffect, useMemo, useState } from "react";
import { useTaskStore } from "../common/taskStore";
import CommonModal from "../../../common/CommonModal";
import { Add } from "@mui/icons-material";
import AddControlMeasures from "../common/AddControlMeasures";
import { set } from "lodash";
import Button from "../../../common/Button";
import { useControlMeasureStore } from "../common/controlMeasureStore";
import { toast } from "react-toastify";

const EditControlMeasures = () => {
  const { selectedTask } = useTaskStore();
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
  const [humanError, setHumanError] = useState<boolean>(false);
  const [technicalError, setTechnicalError] = useState<boolean>(false);
  const [organizationalError, setOrganizationalError] =
    useState<boolean>(false);

  const controlMeasuresDisplay = useMemo(() => {
    const humanControlMeasures = selectedTask.controlMeasures.filter(
      (measure) => measure.type === ControlMeasuresType.Human
    );
    const technicalControlMeasures = selectedTask.controlMeasures.filter(
      (measure) => measure.type === ControlMeasuresType.Technical
    );
    const organizationalControlMeasures = selectedTask.controlMeasures.filter(
      (measure) => measure.type === ControlMeasuresType.Organizational
    );
    const controlMeasuresDisplay = [
      {
        label: "Human",
        value: ControlMeasuresType.Human,
        measures: humanControlMeasures.map((measure) => ({
          id: measure.controlMeasureId,
          title: measure.controlMeasure,
        })),
      },
      {
        label: "Technical",
        value: ControlMeasuresType.Technical,
        measures: technicalControlMeasures.map((measure) => ({
          id: measure.controlMeasureId,
          title: measure.controlMeasure,
        })),
      },
      {
        label: "Organizational",
        value: ControlMeasuresType.Organizational,
        measures: organizationalControlMeasures.map((measure) => ({
          id: measure.controlMeasureId,
          title: measure.controlMeasure,
        })),
      },
    ];
    setSelectedHumanControlMeasures(
      humanControlMeasures.map((measure) => ({
        id: measure.controlMeasureId,
        title: measure.controlMeasure,
      }))
    );
    setSelectedTechnicalControlMeasures(
      technicalControlMeasures.map((measure) => ({
        id: measure.controlMeasureId,
        title: measure.controlMeasure,
      }))
    );
    setSelectedOrganizationalControlMeasures(
      organizationalControlMeasures.map((measure) => ({
        id: measure.controlMeasureId,
        title: measure.controlMeasure,
      }))
    );
    return controlMeasuresDisplay;
  }, [selectedTask]);

  const { setEditedControlMeasure } = useControlMeasureStore();

  const handleControlMeasuresChange = () => {
    if (
      selectedHumanControlMeasures.length > 0 &&
      selectedTechnicalControlMeasures.length > 0 &&
      selectedOrganizationalControlMeasures.length > 0
    ) {
      setHumanError(false);
      setTechnicalError(false);
      setOrganizationalError(false);

      //this code is to update the deleted control measures and retain others in the task

      const humanCsFiltered = selectedTask.controlMeasures.filter(
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
      const technicalCsFiltered = selectedTask.controlMeasures.filter(
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
      const organizationalCsFiltered = selectedTask.controlMeasures.filter(
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
            !selectedTask.controlMeasures.find(
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
            !selectedTask.controlMeasures.find(
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
            !selectedTask.controlMeasures.find(
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
      setEditedControlMeasure(controlMeasures);
      // toast.error("Control Measures updated successfully");
      // setIsOpen(false);
    }

    if (selectedHumanControlMeasures.length === 0) {
      setHumanError(true);
    }
    if (selectedTechnicalControlMeasures.length === 0) {
      setTechnicalError(true);
    }
    if (selectedOrganizationalControlMeasures.length === 0) {
      setOrganizationalError(true);
    }
  };

  useEffect(() => {
    handleControlMeasuresChange();
  }, [
    selectedHumanControlMeasures,
    selectedTechnicalControlMeasures,
    selectedOrganizationalControlMeasures,
  ]);

  return (
    // <CommonModal
    //   open={isOpen}
    //   handleClose={() => setIsOpen(false)}
    //   title={"Edit Control Measures"}
    // >
    //   <section className="flex flex-col mt-8 w-full">
    //     <div className="flex flex-row justify-between items-center w-full">
    //       <p className="text-lg my-10">
    //         You can edit the control measures by changing the values below. If
    //         you dont approve the task your changes will not be saved.
    //       </p>
    //     </div>

    <div className="flex flex-col mt-6 w-full text-sm">
      <div className="flex flex-col gap-20 mt-10 justify-between items-start w-full">
        <AddControlMeasures
          controlMeasureType={ControlMeasuresType.Human}
          errors={humanError}
          setSelectedValues={setSelectedHumanControlMeasures}
          selectedValues={selectedHumanControlMeasures}
        />

        <AddControlMeasures
          controlMeasureType={ControlMeasuresType.Technical}
          errors={technicalError}
          setSelectedValues={setSelectedTechnicalControlMeasures}
          selectedValues={selectedTechnicalControlMeasures}
        />

        <AddControlMeasures
          controlMeasureType={ControlMeasuresType.Organizational}
          errors={!!organizationalError}
          setSelectedValues={setSelectedOrganizationalControlMeasures}
          selectedValues={selectedOrganizationalControlMeasures}
        />
      </div>
      {/* <div className="flex my-20 flex-row gap-10 w-full text-right justify-end">
        <Button
          onClick={() => {
            setIsOpen(false);
          }}
          type="button"
          variant="neutral"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            handleControlMeasuresChange();
          }}
          type="button"
          variant="approve"
        >
          Save
        </Button>
      </div> */}
    </div>
    //   </section>
    // </CommonModal>
  );
};

export default EditControlMeasures;
