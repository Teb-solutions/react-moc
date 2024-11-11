export interface IHiraList {
  id: number;
  hiranumber: string;
  source: number;
  projectName: string;
  projectDescription: string;
  siteId: number;
  siteName: string;
  divisionId: number;
  divisionName: string;
  siteInchargeId: number;
  siteInChargeName: string;
  date: string;
  category: number;
  isActive: boolean;
  highRiskCount?: number;
  taskCount?: number;
  initiatorName?: string;
}

export interface ISite {
  id: number;
  code: string;
  name: string;
  description: string;
  parentId: number;
  lookupType: number;
  parentType: any;
  isActive: boolean;
}

export interface IRiskRegisterDetails {
  id: number;
  hiranumber: string;
  source: number;
  projectName: string;
  projectDescription: string;
  siteId: number;
  siteName: string;
  divisionId: number;
  divisionName: string;
  siteInchargeId: number;
  siteInChargeName: string;
  date: string;
  category: number;
  activities: Activity[];
  isActive: boolean;
  teamList: TeamList[];
}

export interface Activity {
  id: number;
  riskRegisterId: number;
  activityName: string;
  assignedToStaffId: number;
  assignedToStaffName: string;
  startedDate: string;
  completedDate?: string;
  isComplete: boolean;
}

export interface TeamList {
  teamType: number;
  staffId: number;
  staffName: string;
}
