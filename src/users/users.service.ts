import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { PutUserDto } from './dto/put-user.dto';
import * as bcrypt from 'bcrypt';
import {
  UserDeleteResponse,
  UserListResponse,
  UserMutationResponse,
  UserResponse,
} from './types/user-response.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  private async findUserByIdOrFail(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findAll(): Promise<UserListResponse> {
    const users = await this.userRepository.find();
    return {
      msg: 'Users retrieved successfully',
      type: 'success',
      code: 200,
      data: users,
    };
  }

  async findOne(id: number): Promise<UserResponse> {
    const user = await this.findUserByIdOrFail(id);
    return {
      msg: 'User retrieved successfully',
      type: 'success',
      code: 200,
      data: user,
    };
  }

  // Implement other methods like create, update, delete as needed

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<UserMutationResponse> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.confirmPassword = await bcrypt.hash(
      createUserDto.confirmPassword,
      10,
    );
    const user = this.userRepository.create(createUserDto);
    const createdUser = await this.userRepository.save(user);
    return {
      msg: 'User created successfully',
      type: 'success',
      code: 201,
      data: createdUser,
    };
  }

  async updateUser(
    id: number,
    updateUserDto: Partial<CreateUserDto>,
  ): Promise<UserMutationResponse> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.confirmPassword) {
      updateUserDto.confirmPassword = await bcrypt.hash(
        updateUserDto.confirmPassword,
        10,
      );
    }
    const user = await this.findUserByIdOrFail(id);
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return {
      msg: 'User updated successfully',
      type: 'success',
      code: 200,
      data: updatedUser,
    };
  }
  async replaceUser(
    id: number,
    putUserDto: PutUserDto,
  ): Promise<UserMutationResponse> {
    putUserDto.password = await bcrypt.hash(putUserDto.password, 10);
    putUserDto.confirmPassword = await bcrypt.hash(
      putUserDto.confirmPassword,
      10,
    );
    const user = await this.findUserByIdOrFail(id);
    const replacedUser = this.userRepository.create({
      ...putUserDto,
      id: user.id, // Ensure the ID remains the same
    } as Partial<User>);

    const savedUser = await this.userRepository.save(replacedUser);
    return {
      msg: 'User replaced successfully',
      type: 'success',
      code: 200,
      data: savedUser,
    };
  }

  async deleteUser(id: number): Promise<UserDeleteResponse> {
    const user = await this.findUserByIdOrFail(id);
    await this.userRepository.delete(id);
    return {
      msg: 'User has been deleted successfully',
      type: 'success',
      code: 200,
      data: {
        id: user.id,
        email: user.email,
      },
    };
  }
}
