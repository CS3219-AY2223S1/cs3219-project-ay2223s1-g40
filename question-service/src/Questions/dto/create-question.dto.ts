import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;
}