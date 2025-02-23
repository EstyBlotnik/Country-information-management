import { atom } from "recoil";
import { CountryData } from "../types/countryTypes";

export const countryState = atom<CountryData | null>({
    key: "countryState",
    default: null,
  });