// src/components/FuseSvgIcon.d.ts
import { BoxProps } from "@mui/system";
import { ForwardRefExoticComponent, RefAttributes } from "react";

interface FuseSvgIconProps extends BoxProps {
  children: string;
  className?: string;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "warning"
    | "action"
    | "error"
    | "disabled";
  size?: number;
}

declare const FuseSvgIcon: ForwardRefExoticComponent<FuseSvgIconProps>;

export default FuseSvgIcon;
