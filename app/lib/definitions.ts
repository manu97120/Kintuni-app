export type NatalchartSchema = {
    addressQuery: string;
    longitude: number;
    lattitude: number;
    date: Date;
    time: Date;
    unknown_time: 'on' | null;
    day: 'on' | null;
    nite: 'on' | null;

  };