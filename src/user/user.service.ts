import { Injectable, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { registerDto } from 'src/authentication/dtos/requests/register.dto';
import { Repository } from 'typeorm';
import { generateHash } from 'src/common/utils/authentication/bcrypt.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { AcessTokenGuard } from 'src/authentication/guards/access-token.guard';
@UseGuards(AcessTokenGuard)
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async createUser(data: registerDto): Promise<User> {
    const hashedPassword = await generateHash(data.password);
    const newUser = this.userRepository.create({
      ...data,
      password: hashedPassword,
      isMailVerified: false,
    });
    return this.userRepository.save(newUser);
  }
  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  updateUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
