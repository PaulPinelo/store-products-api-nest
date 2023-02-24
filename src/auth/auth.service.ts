import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { Model } from 'mongoose';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModule: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerObject: RegisterAuthDto) {
    const { password } = registerObject;
    const plainToHash = await hash(password, 10);
    registerObject = { ...registerObject, password: plainToHash };
    return this.userModule.create(registerObject);
  }

  async login(loginObject: LoginAuthDto) {
    const { email, password } = loginObject;
    const findUser = await this.userModule.findOne({ email });
    if (!findUser) throw new HttpException('User not found', 404);
    const checkPassword = await compare(password, findUser.password);
    if (!checkPassword) throw new HttpException('Incorrect password', 403);
    const payload = { id: findUser._id, name: findUser.name };
    const data = {
      user: findUser,
      token: await this.jwtService.sign(payload),
    };
    return data;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: RegisterAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
