import request from 'supertest';
import 'regenerator-runtime/runtime';
import mongoose from 'mongoose';
import server from '../../../app';
import 'dotenv/config';

let accessToken: string;
let newCommentId: string;
const createCommentData = {
  postId: '6147620306514b21115b81d0',
  content: '참여하고 싶습니다!',
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

describe('POST /api/posts/comments', () => {
  it('access token이 유효하지 않을 경우 401 응답', async () => {
    const res = await request(server)
      .post('/api/posts/comments')
      .type('application/json')
      .send(createCommentData)
      .set('Authorization', `Bearer ${accessToken}123`);
    expect(res.status).toBe(401);
  });

  it('댓글 등록 성공 시 201 응답', async () => {
    const res = await request(server)
      .post('/api/posts/comments')
      .type('application/json')
      .send(createCommentData)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(201);
    newCommentId = res.body.comments[res.body.comments.length - 1]._id;
  });
});

describe("PATCH /api/posts/comments'", () => {
  it('댓글 수정 성공 시 201 응답', async () => {
    const res = await request(server)
      .patch(`/api/posts/comments/${newCommentId}`)
      .type('application/json')
      .send(createCommentData)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });
});

describe('DELETE /api/posts/comments/:id', () => {
  it('정상 삭제 시 204 응답', async () => {
    const result = await request(server)
      .delete(`/api/posts/comments/${newCommentId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(result.status).toBe(204);
  });
});
