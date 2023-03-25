export interface Capitals {
  StatusMsg: string;
  Results: { [key: string]: Result };
  StatusCode: number;
}

export interface Result {
  Name: string;
  Capital: Capital | null;
  GeoRectangle: GeoRectangle;
  SeqID: number;
  GeoPt: number[];
  TelPref: null | string;
  CountryCodes: CountryCodes;
  CountryInfo: string;
}

export interface Capital {
  DLST: DLSTEnum | number;
  TD: number;
  Flg: number;
  Name: string;
  GeoPt: number[];
}

export enum DLSTEnum {
  Null = "null",
}

export interface CountryCodes {
  tld: string;
  iso3: string;
  iso2: string;
  fips: string;
  isoN: number;
}

export interface GeoRectangle {
  West: number;
  East: number;
  North: number;
  South: number;
}
