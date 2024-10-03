import { styled } from "@mui/material/styles";
import MocHeader from "./MocHeader";
import FusePageCarded from "@fuse/core/FusePageCarded";
import _ from "lodash";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, useCallback } from "react";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import { apiAuth } from "src/utils/http";
import FuseLoading from "@fuse/core/FuseLoading";
import CourseTable from "./homepage/CourseTable";
import CourseCard from "./homepage/CourseCard";

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

function MocApp() {
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    // Retrieve stored category from localStorage if exists
    return localStorage.getItem("selectedCategory") || "all";
  });
  const [selectedCategoryType, setSelectedCategoryType] = useState(() => {
    // Retrieve stored category type from localStorage if exists
    return localStorage.getItem("selectedCategoryType") || "all";
  });
  const [hideCompleted, setHideCompleted] = useState(false);
  const [viewTable, setViewTable] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [site, setSite] = useState([]);
  const categories = [
    {
      name: "Asset",
      value: "Asset",
    },
    {
      name: "Engg",
      value: "Engg",
    },
    {
      name: "TransportAct",
      value: "TransportAct",
    },
    {
      name: "Document",
      value: "Document",
    },
    {
      name: "Organisation",
      value: "Org",
    },
    {
      name: "Others",
      value: "Others",
    },
  ];
  useEffect(() => {
    function getRecords() {
      apiAuth.get("/ChangeRequest/List").then((resp) => {
        setOriginalData(resp.data.data);
        setIsLoading(false);
      });
      apiAuth.get("/LookupData/Lov/23").then((resp) => {
        setSite(resp.data.data);
      });
    }

    getRecords();
  }, []);
  const handleSelectedCategory = useCallback((event) => {
    const value = event.target.value;
    setSelectedCategory(value);

    // Store selected category in localStorage
    if (value === "all") {
      localStorage.removeItem("selectedCategory");
    } else {
      localStorage.setItem("selectedCategory", value);
    }
  }, []);

  const handleSelectedCategoryType = useCallback((event) => {
    const value = event.target.value;
    setSelectedCategoryType(value);

    // Store selected category type in localStorage
    if (value === "all") {
      localStorage.removeItem("selectedCategoryType");
    } else {
      localStorage.setItem("selectedCategoryType", value);
    }
  }, []);

  const filteredData = useMemo(() => {
    return _.filter(originalData, (item) => {
      if (
        selectedCategory !== "all" &&
        item.siteId !== parseInt(selectedCategory, 10)
      ) {
        return false;
      }

      if (
        selectedCategoryType !== "all" &&
        item.requestTypeName !== selectedCategoryType
      ) {
        return false;
      }

      if (hideCompleted && item.statusName === "Completed") {
        return false;
      }

      return item.requestNo.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [
    originalData,
    hideCompleted,
    searchText,
    selectedCategory,
    selectedCategoryType,
  ]);

  const handleSearchText = (event) => {
    setSearchText(event.target.value);
  };

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <Root
      header={<MocHeader nothing={"nothing"} type={"MOC Requests"} />}
      content={
        <div className="flex flex-col flex-1 w-full mx-auto px-24 pt-24 sm:p-30">
          <div className="flex flex-col shrink-0 md:flex-row items-center justify-between space-y-16 sm:space-y-0">
            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
              <FormControl className="flex w-full sm:w-136" variant="outlined">
                <InputLabel id="category-select-label">Site</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  label="Category"
                  value={selectedCategory}
                  onChange={handleSelectedCategory}
                >
                  <MenuItem value="all">
                    <em>All</em>
                  </MenuItem>
                  {site?.map((category) => (
                    <MenuItem value={category.value} key={category.value}>
                      {category.text}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl className="flex w-full sm:w-136" variant="outlined">
                <InputLabel id="category-select-label">Type</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  label="Category"
                  value={selectedCategoryType}
                  onChange={handleSelectedCategoryType}
                >
                  <MenuItem value="all">
                    <em>All</em>
                  </MenuItem>
                  {categories?.map((category) => (
                    <MenuItem value={category.value} key={category.value}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Request No"
                placeholder="Request No"
                className="flex w-full sm:w-256 mx-8"
                value={searchText}
                inputProps={{
                  "aria-label": "Search",
                }}
                onChange={handleSearchText}
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
              <FormControlLabel
                label="View as table"
                control={
                  <Switch
                    onChange={(ev) => setViewTable(ev.target.checked)}
                    checked={viewTable}
                    name="viewTable"
                  />
                }
              />
              {!viewTable && (
                <FormControlLabel
                  label="Hide completed"
                  control={
                    <Switch
                      onChange={(ev) => setHideCompleted(ev.target.checked)}
                      checked={hideCompleted}
                      name="hideCompleted"
                    />
                  }
                />
              )}
            </div>
          </div>
          <div className="mt-10 p-4">
            <Typography variant="body2" color="textSecondary">
              <b>MOC Requests count:</b> {filteredData.length}
            </Typography>
          </div>
          {viewTable && filteredData.length != 0 && (
            <CourseTable
              filteredDatas={filteredData}
              setOriginalData={setOriginalData}
            />
          )}
          {filteredData.length == 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-32 mt-32 sm:mt-20"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <div className="mt-10 p-4">
                <Typography variant="body2" color="textSecondary">
                  <h2 className="text-center">No Data Found</h2>
                </Typography>
              </div>
            </motion.div>
          )}

          {!viewTable && filteredData.length != 0 && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 mt-32 sm:mt-20"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredData.map((course) => (
                <motion.div variants={item} key={course.id}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      }
    />
  );
}

export default MocApp;
