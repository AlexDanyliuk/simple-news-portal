import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { access } from 'fs';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,private jwt: JwtService) {}   

    async register(dto: RegisterDto){
        const hashed = await bcrypt.hash(dto.password,10);
        const user = await this.prisma.user.create ({
            data:{
                name: dto.name,
                email: dto.email,
                password: hashed,
                role: 'USER',

            },
        });
        return {message: 'User registered successfully', user};
    }


    async login(dto: LoginDto){
        const user = await this.prisma.user.findUnique({where: {email:dto.email}});
        if (!user) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        const payload = {sub: user.id, email: user.email, role: user.role};
        const token = await this.jwt.signAsync(payload);
        return {access_token:token};


    };
}
