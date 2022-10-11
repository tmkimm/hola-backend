import 'dotenv/config';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  port: process.env.PORT! as string,

  /* MongoDB URL */
  databaseURL: process.env.MONGODB_URI! as string,
  /* API configs */
  api: {
    prefix: '/api',
  },
  /* Google OAuth2.0 */
  googleClientID: process.env.GOOGLE_CLIENT_ID! as string,
  /* GitHub OAuth2.0 */
  githubClientID: process.env.GITHUB_CLIENT_ID! as string,
  githubClientSecret: process.env.GITHUB_CLIENT_SECRET! as string,
  /* JWT Secret */
  jwtSecretKey: process.env.JWT_SECRET_KEY! as string,
  issuer: 'Hola'! as string,
  /* S3 */
  S3AccessKeyId: process.env.S3_ACCESS_KEY_ID! as string,
  S3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY! as string,
  S3BucketName: process.env.S3_BUCKET_NAME! as string,
  S3BucketRegion: process.env.S3_BUCKET_REGION! as string,
  /* Sentry DSN */
  SentryDsn: process.env.SENTRY_DSN! as string,
  // Slack
  SlackWebhook: process.env.SLACK_WEBHOOK! as string,
  AdminId: process.env.ADMIN_ID! as string,
  AdminPassword: process.env.ADMIN_PASSWORD! as string,
};
