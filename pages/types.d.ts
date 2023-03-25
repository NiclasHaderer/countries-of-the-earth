export type Country =
  | {
      border: [number, number][][][];
      countryISO: string;
      countryName: string;
      capitalName: string;
      bbox: [[number, number], [number, number]];
      center: {
        lat: number;
        lng: number;
      };
    }
  | {
      border: [number, number][][][];
      countryISO: string;
      countryName: string;
      capitalName: string;
      capitalLocation: { lng: number; lat: number };
      bbox: [[number, number], [number, number]];
      center: {
        lat: number;
        lng: number;
      };
    };

export type Countries = Country[];
