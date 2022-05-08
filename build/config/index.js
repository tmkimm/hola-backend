"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
exports.default = {
    port: process.env.PORT,
    /* MongoDB URL */
    databaseURL: process.env.MONGODB_URI,
    /* API configs */
    api: {
        prefix: '/api',
    },
    /* Google OAuth2.0 */
    googleClientID: process.env.GOOGLE_CLIENT_ID,
    /* GitHub OAuth2.0 */
    githubClientID: process.env.GITHUB_CLIENT_ID,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    /* JWT Secret */
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    issuer: 'Hola',
    /* S3 */
    S3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
    S3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    S3BucketName: process.env.S3_BUCKET_NAME,
    S3BucketRegion: process.env.S3_BUCKET_REGION,
    /* Sentry DSN */
    SentryDsn: process.env.SENTRY_DSN,
    // Slack
    SlackWebhook: process.env.SLACK_WEBHOOK,
};
//# sourceMappingURL=index.js.map