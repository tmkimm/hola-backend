import request from 'supertest';
import 'regenerator-runtime/runtime';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import server from '../../../app';
import config from '../../../config/index';
import mockData from '../../mockData';

let accessToken: string;
const isAccessTokenValid = async (token: string): Promise<boolean> => {
  try {
    const decodedUser = await jwt.verify(token, config.jwtSecretKey);
    return true;
  } catch (error) {
    return false;
  }
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

describe('POST /api/users/sign', () => {
  it('s3 pre-sign url 정상 발급', async () => {
    const res = await request(server)
      .post('/api/users/sign')
      .type('application/json')
      .send({ fileName: mockData.DuplicateNickname });
    expect(res.status).toBe(200);
    expect(res.body.preSignUrl).toBeDefined();
  });
});

describe('PATCH /api/users/:id', () => {
  it('사용자 id가 존재하지 않으면 404 응답', async () => {
    const res = await request(server).patch(`/api/users/${mockData.InvalidUserId}`).type('application/json');
    expect(res.status).toBe(404);
  });

  it('access token이 유효하지 않으면 401 응답', async () => {
    const res = await request(server)
      .patch('/api/users/61442c0e97ce44432e9d5f2d')
      .type('application/json')
      .set('Authorization', mockData.InvalidAccessToken);
    expect(res.status).toBe(401);
  });

  it('닉네임이 중복되었을 경우 200 응답', async () => {
    const res = await request(server)
      .patch('/api/users/61442c0e97ce44432e9d5f2d')
      .type('application/json')
      .send({ nickName: 'Hola' })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.isExists).toEqual(true);
  });

  it('내 정보 수정 완료 시 새로 발급된 Access Token이 유효한지 체크', async () => {
    const res = await request(server)
      .patch('/api/users/61442c0e97ce44432e9d5f2d')
      .type('application/json')
      .send({ likeLanguages: mockData.PostLanguage })
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    await expect(await isAccessTokenValid(res.body.accessToken)).toEqual(true);
  });
});

describe('DELETE /api/users/:id', () => {
  it('회원 탈퇴 시 access token이 유효하지 않으면 401 응답', async () => {
    const res = await request(server)
      .delete('/api/users/61442c0e97ce44432e9d5f2d')
      .type('application/json')
      .set('Authorization', mockData.InvalidAccessToken);
    expect(res.status).toBe(401);
  });
});

describe('GET /api/users/likes/:id', () => {
  it('정상적으로 조회', async () => {
    const res = await request(server)
      .get('/api/users/likes/61442c0e97ce44432e9d5f2d')
      .type('application/json')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.likePosts).toBeDefined();
  });
});

describe('GET /api/users/read-list/:id', () => {
  it('정상적으로 조회', async () => {
    const res = await request(server)
      .get('/api/users/read-list/61442c0e97ce44432e9d5f2d')
      .type('application/json')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.readList).toBeDefined();
  });
});

describe('GET /api/users/myposts/:id', () => {
  it('정상적으로 조회', async () => {
    const res = await request(server)
      .get('/api/users/myposts/61442c0e97ce44432e9d5f2d')
      .type('application/json')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
  });
});
