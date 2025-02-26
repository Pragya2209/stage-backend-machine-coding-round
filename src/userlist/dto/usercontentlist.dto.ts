import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ContentType } from 'src/constants/constants';

export class UserContentListDto {
  @IsString()
  @IsNotEmpty()
  readonly userId: string;

  @IsString()
  @IsNotEmpty()
  readonly contentId: string;

  @Transform(({ value }) => {
    switch (value) {
      case 'movie':
        return ContentType.Movie;
        break;
      case 'tvshow':
        return ContentType.TVShow;
        break;
      default:
        return null; 
    }
  })
  @IsEnum(ContentType, { message: 'Content type must be either "movie" or "tvshow"' })
  @IsNotEmpty()
  readonly contentType: number;
}