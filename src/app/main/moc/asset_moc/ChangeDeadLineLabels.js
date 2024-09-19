export const ChangeDeadline = {
  rfq: 1,
  vendorfinalization: 2,
  mobilization: 3,
  closeout: 4,
  handover: 5,
};

export const ChangeDeadlineLabel = new Map([
  [ChangeDeadline.rfq, "RFQ"],
  [ChangeDeadline.vendorfinalization, "Vendor Finalization"],
  [ChangeDeadline.mobilization, "Mobilization"],
  [ChangeDeadline.closeout, "Closeout"],
  [ChangeDeadline.handover, "Handover"],
]);
