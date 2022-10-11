import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsString()
  @IsNotEmpty()
  question: string;
}