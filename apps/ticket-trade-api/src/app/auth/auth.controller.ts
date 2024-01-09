import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from './auth.guard';
  import { AuthService } from './auth.service';
  import { SignInDto, CreateUserDto } from '@ticket-trade-workspace/domain';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    //Register user
    @HttpCode(HttpStatus.CREATED)
    @Post('register')
    registerNewUser(@Body() createNewUser: CreateUserDto){
      return this.authService.register(createNewUser);
    }

    //Login user
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: SignInDto) {
        return this.authService.signIn(signInDto.username, signInDto.password)
    }

    //Profile user
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
    return req.user;
    }
  }
