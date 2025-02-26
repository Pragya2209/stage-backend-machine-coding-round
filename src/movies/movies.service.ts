import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from '../models/movie.schema';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(
    @InjectModel(Movie.name) private readonly movieModel: Model<MovieDocument>,
  ) {}

  async findAll(): Promise<Movie[]> {
    try {
      return await this.movieModel.find().exec();
    } catch (error) {
      this.logger.error('Failed to fetch movies', error.stack);
      throw error;
    }
  }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    try {
      const createdMovie = new this.movieModel(createMovieDto);
      return await createdMovie.save();
    } catch (error) {
      this.logger.error('Failed to create movie', error.stack);
      throw error;
    }
  }
}