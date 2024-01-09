import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { environment } from '../environments/environment';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  
  imports: [
    MongooseModule.forRoot(environment.DB_CONNECTION_STRING),
    UserModule, 
    AuthModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
