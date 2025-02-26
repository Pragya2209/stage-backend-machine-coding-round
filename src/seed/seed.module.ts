import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.schema';
import { Movie, MovieSchema } from 'src/models/movie.schema';
import { TVShow, TVShowSchema } from 'src/models/tvshow.schema';

@Module({
    imports: [
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]), 
      MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]), 
      MongooseModule.forFeature([{ name: TVShow.name, schema: TVShowSchema }]), 
    
    ],
    controllers: [SeedController],
    providers: [SeedService]
  
})
export class SeedModule {}
