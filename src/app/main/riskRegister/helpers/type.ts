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

export interface SessionList {
  id: number;
  riskRegisterId: number;
  riskRegisterEvaluationId: number;
  startedAt: string;
  endedAt: any;
  timeoutMin: number;
  responsewaitTime: number;
  startedByStaffId: number;
  startedByStaffName: string;
  comments: any;
  isSessionEnded: boolean;
  isExpired: boolean;
  status: number;
  teamList: SessionTeamList[];
  isActive: boolean;
}

export interface SessionTeamList {
  teamType: number;
  staffId: number;
  staffName: string;
  approvalStatus: number;
  updatedAt: null | string;
  comments: null | string;
}

export interface LabelValue {
  label: string;
  value: string;
}

export interface LookUpType {
  value: number;
  text: string;
  isReadOnly: boolean;
}

export type ISelectedControlMeasures = {
  id: number;
  title: string;
};

export interface ITask {
  riskId: number;
  riskRegisterId?: number;
  id?: number;
  task: string;
  subTask: string;
  hazardousSituation: string;
  consequences: string;
  hazardType: number;
  time: number;
  frequencyDetails: number;
  frequencyScoring: number;
  likelyhoodScoring: number;
  severityScoring: number;
  potentialRisk: number;
  humanControlMeasures: ISelectedControlMeasures[];
  technicalControlMeasures: ISelectedControlMeasures[];
  organizationalControlMeasures: ISelectedControlMeasures[];
  residualTime: number;
  residualFrequency: number;
  residualFrequencyScoring: number;
  residualLikelyhoodScoring: number;
  residualSeverityScoring: number;
  residualRisk: number;
  residualRiskClassification: number;
  residualRiskClassificationDisplay: string;
}
