import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { User } from './entities/user.entity';
import { registerDto } from 'src/authentication/dtos/requests/register.dto';
import { Repository } from 'typeorm';
import { generateHash } from 'src/common/utils/authentication/bcrypt.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { AcessTokenGuard } from 'src/authentication/guards/access-token.guard';
import { UpdateUserInputType } from './dtos/update-user.input-type';
import { NotFoundError } from 'rxjs';
import { UserInsurance } from 'src/insurrance_company/entities/user-insurance.entity';
import { KycDetails } from './entities/kyc-details.entity';
import { InsurranceCompanyService } from 'src/insurrance_company/insurrance_company.service';
@UseGuards(AcessTokenGuard)
@Injectable()
export class UserService {
  getUserInsurances(id: string) {
    return this.userInsuranceRepository.find({ where: { userId: id } });
  }
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInsurance)
    private readonly userInsuranceRepository: Repository<UserInsurance>,
    @InjectRepository(KycDetails)
    private readonly kycDetailsRepository: Repository<KycDetails>,
    private readonly cloudinaryService: CloudinaryService,
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
  async markUserAsVerified(userId: string, details: KycDetails): Promise<User> {
    //TODO: put this in a transaction
    const res = await this.userRepository.update(userId, {
      isKycVerified: true,
      kycDetails: details,
    });
    if (!res.affected || res.affected === 0) {
      throw new NotFoundException('User not found');
    }
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: { kycDetails: true },
    });
    if (!updatedUser) {
      throw new NotFoundException('User not found after update');
    }
    return updatedUser;
  }
  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
  findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
      relations: {
        insuranceCompany: true,
      },
    });
  }

  async updateUser(user: UpdateUserInputType, userId: string): Promise<User> {
    const result = await this.userRepository.update(userId, { ...user });
    if (!result.affected || result.affected === 0) {
      throw new Error('User not found or no changes made');
    }
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!foundUser) {
      throw new Error('User not found after update');
    }
    return foundUser;
  }
  async findUserKycDetails(userId: string) {
    return this.kycDetailsRepository.findOne({ where: { userId } });
  }
  deleteUser(id: string) {
    return this.userRepository.delete(id);
  }
  async updateKycDetails(
    userId: number,
    kycDetails: Partial<KycDetails>,
  ): Promise<KycDetails> {
    const user = await this.userRepository.findOne({
      where: { id: userId.toString() },
      relations: ['kycDetails'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.kycDetails) {
      Object.assign(user.kycDetails, kycDetails);
      return this.kycDetailsRepository.save(user.kycDetails);
    } else {
      const newKycDetails = this.kycDetailsRepository.create({
        ...kycDetails,
        user,
      });
      return this.kycDetailsRepository.save(newKycDetails);
    }
  }
}
