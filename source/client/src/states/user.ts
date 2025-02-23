import { atom } from "recoil";
import { userData } from "../types/userTypes";

export const selctedUserState = atom<userData | null>({
  key: "userState",
  default: null,
});

export const isEditingState = atom <boolean>({
  key: "isEditingState",
  default: false,
})
