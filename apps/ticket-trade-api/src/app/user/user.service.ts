/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException, Injectable } from '@nestjs/common';
import { User as UserDocument} from '../schemas/user.schema';
import { Model } from 'mongoose';
  
export type User = any;

@Injectable()
export class UserService {

    constructor(
      //Injecting usermodel from MongooseDB
      private readonly userModel: Model<UserDocument>
    ) {}

    async findUserByEmail(email: string): Promise<any> {
      const lowerCaseEmail = email.toLowerCase();
      const user = await this.userModel.findOne({ email: lowerCaseEmail }).lean();
      if (!user) {
        throw new HttpException('User not found', 404);
      }
      return user;
    }
}
