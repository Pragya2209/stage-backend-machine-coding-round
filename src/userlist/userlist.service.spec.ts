import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserContentListService } from './userlist.service';
import { UserContentList } from '../models/usercontentlist.schema';
import { Movie } from '../models/movie.schema';
import { TVShow } from '../models/tvshow.schema';
import { AddContentDto } from './dto/usercontentlist.dto';
import { RemoveContentDto } from './dto/remove-content.dto';
import { ContentType } from 'src/constants/constants';

describe('UserContentListService', () => {
  let service: UserContentListService;
  let userContentListModel: any;
  let movieModel: any;
  let tvShowModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserContentListService,
        {
          provide: getModelToken(UserContentList.name),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            deleteOne: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: getModelToken(Movie.name),
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: getModelToken(TVShow.name),
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserContentListService>(UserContentListService);
    userContentListModel = module.get(getModelToken(UserContentList.name));
    movieModel = module.get(getModelToken(Movie.name));
    tvShowModel = module.get(getModelToken(TVShow.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addContent', () => {
    it('should add content to the user list', async () => {
      const addContentDto: AddContentDto = {
        userId: 'user1',
        contentId: 'content1',
        contentType: ContentType.Movie,
      };

      userContentListModel.findOne.mockResolvedValue(null);
      movieModel.findById.mockResolvedValue(true);
      userContentListModel.create.mockResolvedValue(addContentDto);

      const result = await service.addContent(addContentDto);
      expect(result).toEqual(addContentDto);
    });

    it('should throw an error if content already exists', async () => {
      const addContentDto: AddContentDto = {
        userId: 'user1',
        contentId: 'content1',
        contentType: ContentType.Movie,
      };

      userContentListModel.findOne.mockResolvedValue(addContentDto);

      await expect(service.addContent(addContentDto)).rejects.toThrow('Content already in list');
    });

    it('should throw an error if content does not exist', async () => {
      const addContentDto: AddContentDto = {
        userId: 'user1',
        contentId: 'content1',
        contentType: ContentType.Movie,
      };

      userContentListModel.findOne.mockResolvedValue(null);
      movieModel.findById.mockResolvedValue(null);

      await expect(service.addContent(addContentDto)).rejects.toThrow('Content does not exist');
    });
  });

  describe('removeContent', () => {
    it('should remove content from the user list', async () => {
      const removeContentDto: RemoveContentDto = {
        userId: 'user1',
        contentId: 'content1',
        contentType: ContentType.Movie,
      };

      userContentListModel.findOne.mockResolvedValue(removeContentDto);
      userContentListModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      const result = await service.removeContent(removeContentDto);
      expect(result).toEqual({ message: 'Content successfully removed' });
    });

    it('should throw an error if content not found in list', async () => {
      const removeContentDto: RemoveContentDto = {
        userId: 'user1',
        contentId: 'content1',
        contentType: ContentType.Movie,
      };

      userContentListModel.findOne.mockResolvedValue(null);

      await expect(service.removeContent(removeContentDto)).rejects.toThrow('Content not found in list');
    });

    it('should throw an error if failed to remove content from list', async () => {
      const removeContentDto: RemoveContentDto = {
        userId: 'user1',
        contentId: 'content1',
        contentType: ContentType.Movie,
      };

      userContentListModel.findOne.mockResolvedValue(removeContentDto);
      userContentListModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.removeContent(removeContentDto)).rejects.toThrow('Failed to remove content from list');
    });
  });
});