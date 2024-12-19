import React from "react";
import MocHeader from "../moc/MocHeader";
import { styled } from "@mui/material/styles";
import FusePageCarded from "@fuse/core/FusePageCarded";
import _ from "@lodash";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import Switch from "@mui/material/Switch";
import { FormControlLabel, Menu } from "@mui/material";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";

import { apiAuth } from "src/utils/http";
import FuseLoading from "@fuse/core/FuseLoading";
import RiskCard from "./dashboard/RiskCard";
import { use } from "i18next";
import { IHiraList, ISite, TeamList } from "./helpers/type";
import { set } from "lodash";
import RiskHeader from "./common/RiskHeader";
import { useTaskStore } from "./riskEvaluation/_componests/common/taskStore";

// import RiskCard from "./riskCard";

const Root = styled(FusePageCarded)({
  "& .FusePageCarded-header": {},
  "& .FusePageCarded-toolbar": {},
  "& .FusePageCarded-content": {},
  "& .FusePageCarded-sidebarHeader": {},
  "& .FusePageCarded-sidebarContent": {},
});

const container = {
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};
const item = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  show: {
    opacity: 1,
    y: 0,
  },
};

const RiskApp = () => {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [searchText, setSearchText] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState(0);
  const [isSiteLoading, setIsSiteLoading] = useState(true);
  const [site, setSite] = useState<ISite[]>([]);
  const [data, setData] = useState<IHiraList[]>([]);
  const { selectedTask, setSelectedTask } = useTaskStore();
  // setSelectedTask(null);
  useEffect(() => {
    apiAuth
      .get("/RiskRegister/List")
      .then((res) => {
        setData(res.data.data);
        setIsLoading(false);

        // console.log(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    apiAuth
      .get("/LookupData/List/site")
      .then((res) => {
        setSite(res.data.data);
        setIsSiteLoading(false);
        // console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      {isLoading && <FuseLoading />}
      {!isLoading && (
        <Root
          header={
            <RiskHeader
              risk="risk"
              home={true}
              // type={"Risk Register"}
              setLeftSidebarOpen={() => {}}
              leftSidebarOpen={false}
            />
          }
          content={
            <div className="flex flex-col flex-1 w-full mx-auto px-24 pt-24 sm:p-30">
              <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
                <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
                  <FormControl
                    className="flex w-full sm:w-136"
                    variant="outlined"
                  >
                    <InputLabel id="category-select-label">Site</InputLabel>
                    {isSiteLoading && <p>Loading...</p>}
                    {!isSiteLoading && site && (
                      <Select
                        labelId="category-select-label"
                        id="category-select"
                        label="Category"
                        value={selectedSite}
                        onChange={(event) =>
                          setSelectedSite(event.target.value as number)
                        }
                      >
                        <MenuItem value={0}>All</MenuItem>
                        {site &&
                          site.length > 0 &&
                          site?.map((site) => (
                            <MenuItem value={site.id} key={site.id}>
                              {site.description}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                  </FormControl>

                  <TextField
                    label="Request No"
                    placeholder="Request No"
                    className="flex w-full sm:w-256 mx-8"
                    value={searchText}
                    inputProps={{
                      "aria-label": "Search",
                    }}
                    // onChange={handleSearchText}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>

                <FormControlLabel
                  label="Hide completed"
                  control={
                    <Switch
                      onChange={(ev) => {
                        setHideCompleted(ev.target.checked);
                      }}
                      checked={hideCompleted}
                      name="hideCompleted"
                    />
                  }
                />
              </div>
              {!isLoading && data.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-24 my-24"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {data.map((risk) => {
                    return (
                      <motion.div variants={item} key={risk.id}>
                        <RiskCard risk={risk} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <Typography color="text.secondary" className="text-24 my-24">
                    No risk registers found!
                  </Typography>
                </div>
              )}
            </div>
          }
        />
      )}
    </>
  );
};

export default RiskApp;
