import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { PutUserDto } from './dto/put-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth() // Add this to indicate that endpoints require authentication
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Define your endpoints here, e.g., GET /users, POST /users, etc.
  @Get()
  // @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard) // Protect this route with JWT authentication
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // Protect this route with JWT authentication
  findOne(@Param('id') id: string) {
    // Implement logic to find a user by ID
    return this.usersService.findOne(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    return this.usersService.updateUser(Number(id), updateUserDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async replace(@Param('id') id: string, @Body() putUserDto: PutUserDto) {
    return this.usersService.replaceUser(Number(id), putUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard) // Protect this route with JWT authentication
  delete(@Param('id') id: string) {
    // Implement logic to delete a user by ID
    return this.usersService.deleteUser(Number(id));
  }
}
