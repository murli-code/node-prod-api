// auth/dto/register.dto.ts
import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
// Import Role enum to type and validate incoming `roles` values.
import { Role } from '../role/roles.enum';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  firstName!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsNotEmpty()
  @MinLength(6)
  confirmPassword!: string;

  // Optional `roles` field: accepts an array of Role enum values.
  // - `@IsOptional()` makes this field optional in the DTO.
  // - `@IsEnum(Role, { each: true })` validates each array item is a valid Role.
  // NOTE: For security, do NOT allow public registration to set elevated roles
  // (e.g. 'admin') unless you restrict this endpoint to admins only.
  @IsOptional()
  @IsEnum(Role, { each: true })
  roles?: Role[];
}
