import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { UserSchema } from "./user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Employee,', schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }