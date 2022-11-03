import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Model } from 'mongoose';
import { QuestionDocument } from './question.schema';

@Injectable()
export class QuestionService {
  constructor(
    @InjectModel('Question')
    private readonly QuestionModel: Model<QuestionDocument>,
  ) {}

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionDocument> {
    const newQuestion = await new this.QuestionModel(createQuestionDto);
    return newQuestion.save();
  }

  async getAllQuestions(): Promise<QuestionDocument[]> {
    const QuestionData = await this.QuestionModel.find();
    if (!QuestionData || QuestionData.length == 0) {
      throw new NotFoundException('Question data not found!');
    }
    return QuestionData;
  }

  async getQuestion(QuestionId: string): Promise<QuestionDocument> {
    const existingQuestion = await this.QuestionModel.findById(
      QuestionId,
    ).exec();
    if (!existingQuestion) {
      throw new NotFoundException(`Question #${QuestionId} not found`);
    }
    return existingQuestion;
  }

  async getDifficultyQuestion(
    QuestionDifficulty: string,
  ): Promise<QuestionDocument> {
    const existingQuestions = await this.QuestionModel.find({
      difficulty: QuestionDifficulty,
    }).exec();
    const random = Math.floor(Math.random() * existingQuestions.length);
    const existingQuestion = existingQuestions[random];
    if (!existingQuestion) {
      throw new NotFoundException(`Beginner Questions not found`);
    }
    return existingQuestion;
  }

  async deleteQuestion(QuestionId: string): Promise<QuestionDocument> {
    const deletedQuestion = await this.QuestionModel.findByIdAndDelete(
      QuestionId,
    );
    if (!deletedQuestion) {
      throw new NotFoundException(`Question #${QuestionId} not found`);
    }
    return deletedQuestion;
  }
}
