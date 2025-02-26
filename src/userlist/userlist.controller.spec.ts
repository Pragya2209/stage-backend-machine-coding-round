import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { UserContentListService } from './userlist.service';

describe('UserContentListController (e2e)', () => {
  let app: INestApplication;
  let userContentListService: UserContentListService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userContentListService = moduleFixture.get<UserContentListService>(UserContentListService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/usercontentlist/add (POST)', () => {
    it('should add content to the user list', () => {
      const addContentDto = {
        userId: 'user1',
        contentId: 'content1',
        contentType: 'movie',
      };

      return request(app.getHttpServer())
        .post('/usercontentlist/add')
        .send(addContentDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(expect.objectContaining(addContentDto));
        });
    });
  });

  describe('/usercontentlist (GET)', () => {
    it('should get content from the user list', () => {
      return request(app.getHttpServer())
        .get('/usercontentlist')
        .query({ userId: 'user1', limit: 10, offset: 0 })
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array);
        });
    });
  });

  describe('/usercontentlist/remove (DELETE)', () => {
    it('should remove content from the user list', () => {
      const removeContentDto = {
        userId: 'user1',
        contentId: 'content1',
        contentType: 'movie',
      };

      return request(app.getHttpServer())
        .delete('/usercontentlist/remove')
        .send(removeContentDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual({ message: 'Content successfully removed' });
        });
    });
  });
});