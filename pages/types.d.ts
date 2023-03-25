export type Country =
  | { border: number[][][][]; countryISO: string; countryName: string; capitalName: string }
  | {
      border: number[][][][];
      countryISO: string;
      countryName: string;
      capitalLocation: { lng: number; lat: number };
    };

export type Countries = Country[];
