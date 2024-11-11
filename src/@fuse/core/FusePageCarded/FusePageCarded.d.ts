// src/@fuse/core/FusePageCarded/FusePageCarded.d.ts
import { ReactNode } from "react";

interface FusePageCardedProps {
  scroll?: "page" | "content";
  className?: string;
  header?: ReactNode;
  content?: ReactNode;
  leftSidebarContent?: ReactNode;
  rightSidebarContent?: ReactNode;
  leftSidebarOpen?: boolean;
  rightSidebarOpen?: boolean;
  rightSidebarWidth?: number;
  leftSidebarWidth?: number;
  leftSidebarVariant?: "permanent" | "temporary";
  rightSidebarVariant?: "permanent" | "temporary";
  rightSidebarOnClose?: () => void;
  leftSidebarOnClose?: () => void;
}

declare const FusePageCarded: React.FC<FusePageCardedProps>;

export default FusePageCarded;
