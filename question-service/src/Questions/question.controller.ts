import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly QuestionService: QuestionService) {}

  @Post()
  async createQuestion(
    @Res() response,
    @Body() createQuestionDto: CreateQuestionDto,
  ) {
    try {
      const newQuestion = await this.QuestionService.createQuestion(
        createQuestionDto,
      );
      return response.status(HttpStatus.CREATED).json({
        message: 'Question has been created successfully',
        newQuestion: newQuestion,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Question not created!',
        error: 'Bad Request',
      });
    }
  }

  @Get()
  async getQuestions(@Res() response) {
    try {
      const QuestionData = await this.QuestionService.getAllQuestions();
      return response.status(HttpStatus.OK).json({
        message: 'All Questions data found successfully',
        QuestionData,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/:id')
  async getQuestion(@Res() response, @Param('id') QuestionId: string) {
    try {
      const existingQuestion = await this.QuestionService.getQuestion(
        QuestionId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Question found successfully',
        existingQuestion,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Get('/Difficulty/:difficulty')
  async getDiffQuestion(
    @Res() response,
    @Param('difficulty') QuestionId: string,
  ) {
    try {
      const existingQuestion = await this.QuestionService.getDifficultyQuestion(
        QuestionId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Question found successfully',
        existingQuestion,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @Delete('/:id')
  async deleteQuestion(@Res() response, @Param('id') QuestionId: string) {
    try {
      const deletedQuestion = await this.QuestionService.deleteQuestion(
        QuestionId,
      );
      return response.status(HttpStatus.OK).json({
        message: 'Question deleted successfully',
        deletedQuestion,
      });
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
