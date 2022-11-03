import { Document } from 'mongoose';

export interface IQuestion extends Document {
  readonly id: string;
  readonly question: string;
}
