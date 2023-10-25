import mongoose from 'mongoose';
import 'regenerator-runtime/runtime';
import request from 'supertest';
import server from '../../../app';
import { IPostDocument } from '../../../models/Post';
import mockData from '../../mockData';

let accessToken: string;
let newPostId: string;
const createPostData = {
  language: mockData.PostLanguage,
  title: mockData.PostTitle,
  content: mockData.PostContent,
};

const getAccessToken = async (): Promise<string> => {
  const result = await request(server).post('/api/login').type('application/json').send({ loginType: 'guest' });
  return result.body.accessToken;
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI! as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false,
  });

  // accessToken 발급
  accessToken = await getAccessToken();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoose.connection.close();
  await server.close();
});

describe('POST /api/posts', () => {
  it('access token이 유효하지 않을 경우 401 응답', async () => {
    const res = await request(server)
      .post('/api/posts')
      .type('application/json')
      .send(createPostData)
      .set('Authorization', mockData.InvalidAccessToken);
    expect(res.status).toBe(401);
  });

  it('글 등록 성공 시 201 응답', async () => {
    const res = await request(server)
      .post('/api/posts')
      .type('application/json')
      .send(createPostData)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(201);
    newPostId = res.body._id;
  });
});

describe('PATCH /api/posts', () => {
  it('글 수정 성공 시 201 응답', async () => {
    const res = await request(server)
      .patch(`/api/posts/${newPostId}`)
      .type('application/json')
      .send(createPostData)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });
});

describe('GET /api/posts/:id', () => {
  it('글 id가 존재하지 않을 경우 404 응답', async () => {
    const result = await request(server).get(`/api/posts/${mockData.InvalidPostId}`);
    expect(result.status).toBe(404);
  });

  it('신규 등록한 글 상세 정상 조회', async () => {
    const post = await request(server).get(`/api/posts/${newPostId}`);
    expect(post.status).toBe(200);
  });

  it('글 필수 필드 존재하는지 확인', async () => {
    const post = await request(server).get(`/api/posts/${newPostId}`);
    const requiredField = [`title`, `content`, `language`, `isClosed`, `createdAt`, `likes`, `views`, `_id`];
    requiredField.forEach((v) => {
      expect(post.body).toHaveProperty(v);
    });
  });
});

describe('POST /api/posts/likes', () => {
  it('좋아요 추가 성공 시 201 응답', async () => {
    const res = await request(server)
      .post('/api/posts/likes')
      .type('application/json')
      .send({ postId: newPostId })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(201);
    expect(res.body.likeUsers).toBeDefined();
  });
});

describe('DELETE /api/posts/likes', () => {
  it('좋아요 삭제 성공 시 201 응답', async () => {
    const res = await request(server)
      .delete(`/api/posts/likes/${newPostId}`)
      .type('application/json')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(201);
    expect(res.body.likeUsers).toBeDefined();
  });
});

describe('DELETE /api/posts/:id', () => {
  it('글 id가 존재하지 않을 경우 404 응답', async () => {
    const result = await request(server).delete(`/api/posts/${mockData.InvalidPostId}`);
    expect(result.status).toBe(404);
  });
  it('정상 삭제 시 204 응답', async () => {
    const result = await request(server)
      .delete(`/api/posts/${newPostId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.status).toBe(204);
  });
});

describe('GET /api/posts', () => {
  it('글 리스트 정상 조회 시 200 응답', async () => {
    const result = await request(server).get('/api/posts');
    expect(result.status).toBe(200);
  });

  it('필수 필드 존재하는지 확인', async () => {
    const post = await request(server).get(`/api/posts`);
    const requiredField: string[] = [`title`, `language`, `isClosed`, `likes`, `views`, `_id`];
    post.body.forEach((v: IPostDocument) => {
      requiredField.forEach((field) => {
        expect(v).toHaveProperty(field);
      });
    });
  });
});
