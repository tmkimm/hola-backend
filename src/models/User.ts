import { Model, Schema, model, ObjectId } from 'mongoose';
import jwt from 'jsonwebtoken';
import config from '../config/index';

interface IUser {
  idToken: string;
  tokenType: string;
  email: string;
  name: string;
  nickName: string;
  password: string;
  image: string;
  likeLanguages: string[];
  likeStudies: ObjectId[];
  readList: ObjectId[];
}

interface IUserDocument extends IUser, Document {
  generateAccessToken: () => Promise<string>;
  generateRefreshToken: () => Promise<string>;
}

interface IUserModel extends Model<IUserDocument> {
  deleteUser: (id: ObjectId) => void;
  modifyUser: (id: ObjectId, user: IUserDocument) => Promise<IUserDocument>;
  findByIdToken: (idToken: string) => Promise<IUserDocument>;
  findByEmail: (email: string) => Promise<IUserDocument>;
  addLikeStudy: (studyId: ObjectId, userId: ObjectId) => Promise<IUserDocument>;
  deleteLikeStudy: (studyId: ObjectId, userId: ObjectId) => Promise<IUserDocument>;
  addReadList: (studyId: ObjectId, userId: ObjectId) => void;
}

const userSchema = new Schema<IUserDocument>(
  {
    idToken: String,
    tokenType: String,
    email: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      maxlength: 50,
    },
    nickName: {
      type: String,
      maxlength: 100,
    },
    password: {
      type: String,
      minlength: 8,
    },
    image: String,
    likeLanguages: [String],
    likeStudies: [{ type: Schema.Types.ObjectId, ref: 'Study' }],
    readList: [{ type: Schema.Types.ObjectId, ref: 'Study' }],
  },
  {
    timestamps: true,
  },
);

userSchema.statics.deleteUser = async function (id) {
  await this.findByIdAndDelete({ _id: id });
};

userSchema.statics.modifyUser = async function (id, user) {
  const userRecord = await this.findByIdAndUpdate(id, user, {
    new: true,
  });
  return userRecord;
};

userSchema.statics.findByIdToken = async function (idToken) {
  const result = await this.findOne({ idToken });
  return result;
};

userSchema.statics.findByEmail = async function (email) {
  const result = await this.findOne({ email });
  return result;
};

userSchema.statics.findByNickName = async function (nickName) {
  const result = await this.findOne({ nickName });
  return result;
};

userSchema.methods.generateAccessToken = async function () {
  const accessToken = await jwt.sign(
    {
      nickName: this.nickName,
      idToken: this.idToken,
    },
    config.jwtSecretKey,
    {
      expiresIn: '1h',
      issuer: config.issuer,
    },
  );
  return accessToken;
};

userSchema.methods.generateRefreshToken = async function () {
  const refreshToken = await jwt.sign(
    {
      nickName: this.nickName,
    },
    config.jwtSecretKey,
    {
      expiresIn: '2w',
      issuer: config.issuer,
    },
  );
  return refreshToken;
};

userSchema.statics.addLikeStudy = async function (studyId, userId) {
  const result = await this.findByIdAndUpdate(
    { _id: userId },
    {
      $push: {
        likeStudies: {
          _id: studyId,
        },
      },
    },
    {
      new: true,
      upsert: true,
    },
  );
  return result;
};

userSchema.statics.deleteLikeStudy = async function (studyId, userId) {
  const deleteRecord = await this.findOneAndUpdate(
    { _id: userId },
    {
      $pull: { likeStudies: studyId },
    },
  );
  return deleteRecord;
};

userSchema.statics.addReadList = async function (studyId, userId) {
  const isStudyExists = await this.findOne({ _id: userId, readList: studyId });
  if (!isStudyExists) {
    await this.findByIdAndUpdate(
      { _id: userId },
      {
        $push: {
          readList: {
            _id: studyId,
          },
        },
      },
    );
  }
};

const User = model<IUserDocument, IUserModel>('User', userSchema);
export default User;
