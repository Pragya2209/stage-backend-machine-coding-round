import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { UserContentList, UserContentListDocument } from '../models/usercontentlist.schema';
import { UserContentListDto } from './dto/usercontentlist.dto';
import { Movie, MovieDocument } from 'src/models/movie.schema';
import { TVShow, TVShowDocument } from 'src/models/tvshow.schema';
import { ContentType } from 'src/constants/constants';

@Injectable()
export class UserContentListService {
    private readonly logger = new Logger(UserContentListService.name);

    constructor(
        @InjectModel(UserContentList.name) private readonly userContentListModel: Model<UserContentListDocument>,
        @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
        @InjectModel(TVShow.name) private readonly tvShowModel: Model<TVShowDocument>
    ) { }

    async addContent(addContentDto: UserContentListDto): Promise<UserContentList> {
        const { userId, contentId, contentType } = addContentDto;
        try {
            const existingItem = await this.userContentListModel.findOne({ userId, contentId, contentType }).exec();
            if (existingItem) {
                throw new BadRequestException('Content already in list');
            }
            const contentExists = await this.checkContentExists(userId, contentId, contentType);
            if (!contentExists) {
                throw new BadRequestException('Content does not exist');
            }
            const createdContent = new this.userContentListModel(addContentDto);
            return await createdContent.save();
        } catch (error) {
            this.logger.error('Failed to add content to user list', error.stack);
            throw error;
        }
    }

    private async checkContentExists(userId: string, contentId: string, contentType: ContentType): Promise<boolean> {
        try {
            if (!isValidObjectId(contentId)) {
                throw new BadRequestException('Invalid content ID');
            }
            if (contentType === ContentType.Movie) {
                const movie = await this.movieModel.findById(contentId).exec();
                return !!movie;
            } else if (contentType === ContentType.TVShow) {
                const tvShow = await this.tvShowModel.findById(contentId).exec();
                return !!tvShow;
            }
            return false;
        }
       catch(error) {
        throw error;
       }
    }

    async getContent(userId: string, limit: number, offset: number): Promise<UserContentList[]> {
        try {
            return await this.userContentListModel.find({ userId })
            .skip(offset)
            .limit(limit)
            .exec();        
        } catch (error) {
            this.logger.error('Failed to fetch user content list', error.stack);
            throw error;
        }

    }

    async removeContent(removeContentDto: UserContentListDto): Promise<{ message: string }> {
        const { userId, contentId, contentType } = removeContentDto;
        try {
            const existingItem = await this.userContentListModel.findOne({ userId, contentId, contentType }).exec();
            if (!existingItem) {
                throw new NotFoundException('Content not found in list');
            }
            const result = await this.userContentListModel.deleteOne({ userId, contentId, contentType }).exec();
            if (result.deletedCount === 0) {
                throw new BadRequestException('Failed to remove content from list');
            }
            return { message: 'Content successfully removed' };
        } catch (error) {
            this.logger.error('Failed to remove content from user list', error.stack);
            throw error;
        }
    }
}