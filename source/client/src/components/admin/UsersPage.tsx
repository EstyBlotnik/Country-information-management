import EditUserForm from "../user/EditUserForm";
import { AllUsersPage } from "./AllUsersPage";
import { useRecoilValue } from "recoil";
import { isEditingState } from "../../states/user";

export const UsersPage = () => {
  // According to the recall definition, decides whether to return a user edit page or an all users page.
  const isEditing = useRecoilValue(isEditingState);
  if (isEditing) return <EditUserForm editFor="anOtherUser" />;
  else return <AllUsersPage />;
};
