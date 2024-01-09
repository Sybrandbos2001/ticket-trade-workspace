/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../schemas/user.schema';
 

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        //Inject model from MongoDB
        @InjectModel('User') private readonly userModel: Model<UserDocument>
        ){}
    
    async signIn(email: string, pass: string): Promise<any> {
        const user = await this.userService.findUserByEmail(email);
        const isPasswordMatch = await bcrypt.compare(pass, user.password);
        if (!isPasswordMatch) {
          throw new UnauthorizedException();
        }
        const payload = { sub: user.userId, username: user.firstName };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }

      async register(user: User): Promise<any> {
        try {
          // lowercase all relevant fields
          user.email = user.email.toLowerCase();
          user.firstName = user.firstName.toLowerCase();
          user.lastName = user.lastName.toLowerCase();
    
          // Saving user to DB
          const newUser = new this.userModel(user);
          const savedUser = await newUser.save();
    
          // Exclude password field from the returned user object
          const { password, ...userWithoutPassword } = savedUser.toObject();
          return userWithoutPassword;
        } catch (error) {
          console.log(
            'Error | Register() | API | auth.service.ts | message: ' + error
          );
          if (error.code === 11000) {
            throw new HttpException(
              'Email already in use.',
              HttpStatus.BAD_REQUEST
            );
          }
          throw new HttpException(`Registration failed: ${error.message}`, HttpStatus.BAD_REQUEST);
        }
      }
}
