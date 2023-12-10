export type Country = {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
    svg: string;
  };
  population: number;
  area: number;
  region: string;
  unMember: boolean;
  independent: boolean;
  capital: string;
  subregion: string;
  languages: Record<string, string>;
  currencies: Record<string, { name: string; symbol: string }>;
  continents: string[];
  borders?: string[];
};
