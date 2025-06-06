import { darken, lighten } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import _ from "@lodash";
import { useGetAcademyCategoriesQuery } from "./evaluation/AcademyApi";

/**
 * The CourseCategory component.
 */
function CourseCategory(props) {
  const { slug } = props;
  const { data: categories } = useGetAcademyCategoriesQuery();
  const category = _.find(categories, { slug });

  if (!category) {
    return null;
  }

  return (
    <Chip
      className="font-semibold text-12"
      // label={slug?.requestTypeName}
      sx={{
        color: (theme) =>
          theme.palette.mode === "light"
            ? darken(category?.color, 0.4)
            : lighten(category?.color, 0.8),
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? lighten(category?.color, 0.8)
            : darken(category?.color, 0.1),
      }}
      size="small"
    />
  );
}

export default CourseCategory;
