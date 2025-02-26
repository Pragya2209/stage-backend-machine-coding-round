import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { env } from './utils/env';
import { UserlistModule } from './userlist/userlist.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
    }),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongodb'),
    }),
    inject: [ConfigService],
    }),
    MoviesModule,
    TvshowsModule,
    UserlistModule,
    SeedModule
  ],
})
export class AppModule {}
