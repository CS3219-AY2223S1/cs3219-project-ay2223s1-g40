import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { QuestionService } from './Questions/question.service';
import { QuestionController } from './Questions/question.controller';
import { QuestionSchema } from './Questions/question.schema';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DB_CLOUD_URI,
      }),
    }),
    MongooseModule.forFeature([{ name: 'Question', schema: QuestionSchema }]),
  ],
  controllers: [AppController, QuestionController],
  providers: [AppService, QuestionService],
})
export class AppModule {}
