import { IPostDocument } from '../../../models/Post';
import request from 'supertest';
import 'regenerator-runtime/runtime';
import mongoose from 'mongoose';
import server from '../../../app';
import 'dotenv/config';
import mockData from '../../mockData';

let accessToken: string;
let newCommentId: string;
let commentData: any;

const getCommentBody = async (): Promise<any> => {
  const result = await request(server).get('/api/posts?language=react').type('application/json');
  return {
    postId: result.body[0]._id,
    content: mockData.CommentContent,
  };
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
  commentData = await getCommentBody();
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
      .send(commentData)
      .set('Authorization', mockData.InvalidAccessToken);
    expect(res.status).toBe(401);
  });

  it('댓글 등록 성공 시 201 응답', async () => {
    const res = await request(server)
      .post('/api/posts/comments')
      .type('application/json')
      .send(commentData)
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
      .send(commentData)
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

describe('GET /api/posts/comments/:id', () => {
  it('정상 조회 시 200번 응답', async () => {
    const result = await request(server).get(`/api/posts/comments/${commentData.postId}`);
    expect(result.status).toBe(200);
  });
  it('댓글 필수 필드 확인', async () => {
    const result = await request(server).get(`/api/posts/comments/${commentData.postId}`);
    const requiredField = [`author`, `nickName`, `image`];
    result.body.comments.forEach((v: IPostDocument) => {
      requiredField.forEach((field) => {
        expect(v).toHaveProperty(field);
      });
    });
  });
});
