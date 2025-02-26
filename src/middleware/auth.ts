import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model, Types } from 'mongoose';
import { User } from '../models/user.schema';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // const authHeader = request.headers['authorization'];
    // if (!authHeader) {
    //   throw new UnauthorizedException('Authorization header is missing');
    // }

    // const token = authHeader.split(' ')[1];
    // if (!token) {
    //   throw new UnauthorizedException('Token is missing');
    // }

    try {
      // Verify the token (this is just an example, use a proper JWT library)
      // const decoded = jwt.verify(token, 'your-secret-key');
      // request.user = decoded;

      const userId = request.headers['userid'];

      if (!userId) {
        throw new UnauthorizedException('userId header is missing');
      }

      const userObjectId = new Types.ObjectId(userId);

      if(!isValidObjectId(userObjectId)) {
        throw new UnauthorizedException('Invalid userId');
      }
      const user = await this.userModel.findOne({ _id: userObjectId }).exec();
      if (!user) {
        throw new UnauthorizedException('Invalid userId');
      }

      request.body.userId = userId;
      return true;
    } catch (error) {
        if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid token');
    }
  }
}