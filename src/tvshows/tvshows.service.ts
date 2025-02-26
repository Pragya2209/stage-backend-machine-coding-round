import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TVShow, TVShowDocument } from '../models/tvshow.schema';
import { CreateTVshowDto } from './dto/create-tvshow.dto';

@Injectable()
export class TVShowsService {
  private readonly logger = new Logger(TVShowsService.name);

  constructor(
    @InjectModel(TVShow.name)
    private readonly tvShowModel: Model<TVShowDocument>,
  ) {}

  async findAll(): Promise<TVShow[]> {
    try {
      return await this.tvShowModel.find().exec();
    } catch (error) {
      this.logger.error('Failed to fetch TV shows', error.stack);
      throw error;
    }
  }

  async create(createTVShowDto: CreateTVshowDto): Promise<TVShow> {
    try {
      const createdTVShow = new this.tvShowModel(createTVShowDto);
      return await createdTVShow.save();
    } catch (error) {
      this.logger.error('Failed to create TV show', error.stack);
      throw error;
    }
  }
}