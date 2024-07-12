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
import { useEffect, useState } from "react";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import useThemeMediaQuery from "@fuse/hooks/useThemeMediaQuery";
import {
  useGetAcademyCategoriesQuery,
  useGetAcademyCoursesQuery,
} from "./evaluation/AcademyApi";
import CourseCard from "./CourseCard";
import { apiAuth } from "src/utils/http";

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
  const { data: courses } = useGetAcademyCoursesQuery();
  const { data: categories } = useGetAcademyCategoriesQuery();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hideCompleted, setHideCompleted] = useState(false);

  useEffect(() => {
    function getFilteredArray(data) {
      return _.filter(data, (item) => {
        if (selectedCategory !== "all" && item.category !== selectedCategory) {
          return false;
        }

        if (hideCompleted && item.statusName === "Completed") {
          return false;
        }

        return item.requestNo.toLowerCase().includes(searchText.toLowerCase());
      });
    }

    function getRecords() {
      apiAuth.get("/ChangeRequest/List").then((resp) => {
        const data = resp.data.data;
        setFilteredData(getFilteredArray(data));
      });
    }

    getRecords();
  }, [hideCompleted, searchText, selectedCategory]);

  function handleSelectedCategory(event) {
    setSelectedCategory(event.target.value);
  }

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  return (
    <Root
      header={<MocHeader />}
      content={
        <div className="flex flex-col flex-1 w-full mx-auto px-24 pt-24 sm:p-40">
          <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0">
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
                  {categories?.map((category) => (
                    <MenuItem value={category.slug} key={category.id}>
                      {category.title}
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
                  value={selectedCategory}
                  onChange={handleSelectedCategory}
                >
                  <MenuItem value="all">
                    <em>All</em>
                  </MenuItem>
                  {categories?.map((category) => (
                    <MenuItem value={category.slug} key={category.id}>
                      {category.title}
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 mt-32 sm:mt-40"
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
