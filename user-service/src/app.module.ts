import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserService } from "./user/user.service";
import { UserController } from "./user/user.controller";
import { UserSchema } from "./user/user.schema";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({ uri: 'mongodb+srv://cs3219-KL:JSJvoagKsBHhIGMT@cs3219team40.gaxbfpm.mongodb.net/test'})}),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule { }