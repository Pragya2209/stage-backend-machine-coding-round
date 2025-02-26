import { Module } from '@nestjs/common';
import { UserContentListController } from './userlist.controller';
import { UserContentListService } from './userlist.service';
import { MongooseModule } from '@nestjs/mongoose';
import UserContentListSchema, { UserContentList } from 'src/models/usercontentlist.schema';
import { Movie, MovieSchema } from 'src/models/movie.schema';
import { TVShow, TVShowSchema } from 'src/models/tvshow.schema';
import { User, UserSchema } from 'src/models/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserContentList.name, schema: UserContentListSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: TVShow.name, schema: TVShowSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [UserContentListController],
  providers: [UserContentListService]
})
export class UserlistModule {}
