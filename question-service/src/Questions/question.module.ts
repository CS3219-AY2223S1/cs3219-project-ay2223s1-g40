import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { QuestionSchema } from './question.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Question,', schema: QuestionSchema }]),
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
