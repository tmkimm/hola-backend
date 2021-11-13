import request from 'supertest';
import 'regenerator-runtime/runtime';
import mongoose from 'mongoose';
import server from '../../../app';

let accessToken: string;
let newPostId: string;
const createPostData = {
  language: ['react'],
  title: '같이 사이드 프로젝트 하실분!',
  content: '댓글 달아주세요 :)',
};
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI! as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false,
  });

  // 테스트를 위한 accessToken 발급
  const res = await request(server).post('/api/login').type('application/json').send({ loginType: 'guest' });
  accessToken = res.body.accessToken;
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
      .set('Authorization', `Bearer ${accessToken}123`);
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
  it('스터디 id가 존재하지 않을 경우 404 응답', async () => {
    const result = await request(server).get('/api/posts/6103fca959c4001f004943b9');
    expect(result.status).toBe(404);
  });

  it('신규 등록한 스터디 상세 정상 조회', async () => {
    const result = await request(server).get(`/api/posts/${newPostId}`);
    expect(result.status).toBe(200);
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
  it('스터디 id가 존재하지 않을 경우 404 응답', async () => {
    const result = await request(server).delete(`/api/posts/6103fca959c4001f004943b9`);
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
  it('스터디 리스트 정상 조회 시 200 응답', async () => {
    const result = await request(server).get('/api/posts');
    expect(result.status).toBe(200);
  });
});
