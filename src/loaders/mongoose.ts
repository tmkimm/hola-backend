import mongoose from 'mongoose';
import config from '../config/index';

export default () => {
  // configure mongoose(MongoDB)
  if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(config.databaseURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      autoIndex: false,
    });
  }
};
