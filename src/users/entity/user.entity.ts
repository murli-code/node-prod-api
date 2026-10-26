// users/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

// Import Role enum so the entity can type the `roles` property
// and use the canonical role string values (e.g. 'user', 'admin').
import { Role } from '../../auth/role/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  @Exclude()
  password!: string;

  @Column()
  @Exclude()
  confirmPassword!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // `roles` property stores the roles assigned to the user.
  // - `@Column('simple-array')` tells TypeORM to persist the array
  //   as a comma-separated string in a single column (good for small lists).
  // - `default: Role.User` sets new users to have the `user` role by default.
  // - `roles: Role[]` types the property as an array of `Role` enum values.
  @Column('simple-array', { default: Role.User })
  roles!: Role[];
}
