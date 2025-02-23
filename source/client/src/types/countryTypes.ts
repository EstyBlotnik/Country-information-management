export type CountryData = {
  _id: string;
  name: string;
  flag: string;
  population: number;
  region: string;
  cities: CityData[];
};
export type CountryWithoutID = {
  name: string;
  flag: string;
  population: number;
  region: string;
  cities: CityData[];
};

export type CityData = {
  _id?: string;
  name: string;
};
