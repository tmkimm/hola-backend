import { Model, Schema, model, Types } from 'mongoose';

export interface ISignOutUser {
  _id: Types.ObjectId;
  idToken: string;
  tokenType: string;
  nickName: string;
  password: string | undefined;
  signInDate: Date;
  signOutDate: Date;
  userId: Types.ObjectId;
}

export interface ISignOutUserDocument extends ISignOutUser, Document {}

export type IUserModel = Model<ISignOutUserDocument>;

const SignOutUserSchema = new Schema<ISignOutUserDocument>(
  {
    idToken: { type: String, required: true },
    tokenType: { type: String, required: true },
    nickName: {
      type: String,
      maxlength: 100,
    },
    password: {
      type: String,
      minlength: 8,
    },
    signInDate: Date,
    signOutDate: Date,
    userId: { type: Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  },
);

const SignOutUser = model<ISignOutUserDocument, IUserModel>('SignOutUser', SignOutUserSchema);
export { SignOutUser };
