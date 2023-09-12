import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private userRepo: UserRepository,
    private jwt: JwtService,
  ) {}

  async signUp(authCredsDTO: AuthCredentialsDTO): Promise<void> {
    return this.userRepo.signUp(authCredsDTO);
  }

  async signIn(
    authCredsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepo.validateUserPassword(authCredsDTO);
    if (!username) {
      throw new UnauthorizedException('Invalid credentials!');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwt.sign(payload);

    return { accessToken };
  }
}
