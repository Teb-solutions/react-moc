import React, { useState } from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { ControlMeasuresType } from "../../../helpers/enum";
import useFetchControlMeasureOptions from "./useFetchControlMeasureOptions";
import { ISelectedControlMeasures } from "../../../helpers/type";

interface AddControlMeasuresProps {
  errors: boolean;
  controlMeasureType: number;
  selectedValues: ISelectedControlMeasures[];
  setSelectedValues: (values: ISelectedControlMeasures[]) => void;
}

const AddControlMeasures: React.FC<AddControlMeasuresProps> = ({
  controlMeasureType,
  selectedValues,
  setSelectedValues,
  errors,
}) => {
  const { options, loading, error } =
    useFetchControlMeasureOptions(controlMeasureType);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      {!loading && options && (
        <Autocomplete
          multiple
          fullWidth
          id="tags-filled"
          options={options as ISelectedControlMeasures[]}
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option.title
          }
          getOptionKey={(option) =>
            typeof option === "string" ? option : option.id
          }
          defaultValue={selectedValues || []}
          freeSolo
          onChange={(event, newValue) => {
            const updatedValues = newValue.map((item) => {
              if (typeof item == "string") {
                return { id: 0, title: item };
              }
              return item;
            });
            console.log(updatedValues);
            setSelectedValues(updatedValues as ISelectedControlMeasures[]);
          }}
          renderTags={(value: readonly any[], getTagProps) =>
            value.map((option: ISelectedControlMeasures, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });

              return (
                <Chip
                  variant="outlined"
                  label={typeof option === "string" ? option : option.title}
                  key={key}
                  {...tagProps}
                />
              );
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              error={errors}
              variant="outlined"
              label={ControlMeasuresType[controlMeasureType]}
              placeholder={
                ControlMeasuresType[controlMeasureType] + " Control Measures"
              }
            />
          )}
        />
      )}
    </>
  );
};

export default AddControlMeasures;
