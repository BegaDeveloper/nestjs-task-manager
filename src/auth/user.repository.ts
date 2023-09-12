import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Injectable()
export class UserRepository {
  public repo: Repository<User>;

  constructor(@InjectEntityManager() private entityManager: EntityManager) {
    this.repo = entityManager.getRepository(User);
  }

  async signUp(authCredsDTO: AuthCredentialsDTO): Promise<void> {
    const { username, password } = authCredsDTO;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        //duplicate user
        throw new ConflictException('User already exists!');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(
    authCredsDTO: AuthCredentialsDTO,
  ): Promise<string> {
    const { username, password } = authCredsDTO;
    const user = await this.repo.findOne({ where: { username: username } });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
