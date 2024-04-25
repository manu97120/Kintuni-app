import { Schema, model } from 'mongoose';
export type NatalChartSchema = {
    addressQuery: string;
    longitude: string;
    lattitude: string;
    date: Date;
    time: Date;
    unknown_time: 'on' | null;
    day: 'on' | null;
    nite: 'on' | null;

  };

// 1. Create an interface representing a document in MongoDB.
export interface NatalChartUserSchema = {
  addressQuery: string;
  longitude: string;
  lattitude: string;
  date: Date;
  time: Date;
  unknown_time: enum;
  day: enum;
  nite: enum;

};

// 2. Create a Schema corresponding to the document interface.
const natalChartUserSchema = new Schema<NatalChartSchema>({
  // name: { type: String, required: true },
  addressQuery: String,
  longitude: String,
  lattitude: String,
  date: Date,
  time: Date,
  unknown_time: 'on' | null,
  day: 'on' | null,
  nite: 'on' | null,
});