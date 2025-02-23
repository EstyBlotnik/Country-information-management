export interface RequestData {
  requestDate: Date;
  responseDate?: Date;
  userId: string;
  requestedRole: "Add" | "Delete" | "Edit";
  status: "Approved" | "Denied" | "Pending";
  _id?: string;
}
