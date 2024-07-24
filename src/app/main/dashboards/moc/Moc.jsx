import { styled } from "@mui/material/styles";
import MocHeader from "./MocHeader";
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
import { FormControlLabel } from "@mui/material";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import {
  useGetAcademyCategoriesQuery,
  useGetAcademyCoursesQuery,
} from "./evaluation/AcademyApi";
import CourseCard from "./CourseCard";
import { apiAuth } from "src/utils/http";
import Loader from "../../loader/Loader";
import FuseLoading from "@fuse/core/FuseLoading";

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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCategoryType, setSelectedCategoryType] = useState("all");

  const [hideCompleted, setHideCompleted] = useState(false);
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
  const handleSelectedCategory = (event) => {
    setSelectedCategory(event.target.value);
  };
  const handleSelectedCategoryType = (event) => {
    setSelectedCategoryType(event.target.value);
  };

  const filteredData = useMemo(() => {
    return _.filter(originalData, (item) => {
      console.log("Selected Category:", selectedCategory);

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

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  if (isLoading) {
    return <FuseLoading />;
  }

  return (
    <Root
      header={<MocHeader />}
      content={
       
          <div className="flex flex-col flex-1 w-full mx-auto px-24 pt-24 sm:p-30">
            <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
              <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
                <FormControl className="flex w-full sm:w-136" variant="outlined">
                  <InputLabel id="category-select-label">Site</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    label="Category"
                    value={selectedCategory}
                    onChange={(event) => handleSelectedCategory(event)}
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
                      <MenuItem value={category.value} key={category.id}>
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
            {filteredData &&
              (filteredData.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 mt-32 sm:mt-20"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {filteredData.map((course) => {
                    return (
                      <motion.div variants={item} key={course.id}>
                        <CourseCard course={course} />
                      </motion.div>
                    );
                  })}
                </motion.div>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <Typography color="text.secondary" className="text-24 my-24">
                    No courses found!
                  </Typography>
                </div>
              ))}
          </div>
        
      }
    />
  );
}

export default MocApp;
