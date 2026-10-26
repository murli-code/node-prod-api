import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// token secret validation and extraction logic
// Import Role enum to describe the `roles` claim included in the JWT payload
import { Role } from '../role/roles.enum';

interface JwtPayload {
  sub: number; // subject (user id)
  email: string; // user email
  roles: Role[]; // roles assigned to the user (e.g. ['user','admin'])
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'default_secret',
      ignoreExpiration: false,
    });
  }

  // `validate` is called by Passport after verifying the token signature.
  // Returning an object here becomes `req.user` in request handlers and guards.
  validate(payload: JwtPayload) {
    // expose user id, email and roles to the request so guards can enforce RBAC
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}
