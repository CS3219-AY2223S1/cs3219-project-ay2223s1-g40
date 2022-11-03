import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type QuestionDocument = Question & Document;

@Schema()
export class Question {
  @Prop({ required: true })
  difficulty: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
