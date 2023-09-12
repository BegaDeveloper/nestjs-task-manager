import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authCredsDTO: AuthCredentialsDTO): Promise<void> {
    return this.authService.signUp(authCredsDTO);
  }

  @Post('/signin')
  signIn(
    @Body() authCredsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredsDTO);
  }
}
