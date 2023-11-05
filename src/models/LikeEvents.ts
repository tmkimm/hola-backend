import { Model, Schema, Types, model } from 'mongoose';

export interface ILikeEvents {
  viewDate: Date;
  userId: Types.ObjectId;
  eventId: Types.ObjectId;
}

export interface ILikeEventsDocument extends ILikeEvents, Document {}

export interface ILikeEventsModel extends Model<ILikeEventsDocument> {
  add: (eventId: Types.ObjectId, userId: Types.ObjectId) => void;
  delete: (eventId: Types.ObjectId, userId: Types.ObjectId) => void;
}

const LikeEventsSchema = new Schema<ILikeEventsDocument>(
  {
    userId: { type: Types.ObjectId, ref: 'Event' },
    eventId: { type: Types.ObjectId, ref: 'Event' },
  },
  {
    timestamps: true,
  }
);

LikeEventsSchema.statics.add = async function (eventId, userId) {
  await this.create({
    userId,
    eventId,
  });
};

LikeEventsSchema.statics.delete = async function (eventId, userId) {
  await this.deleteOne({ userId, eventId });
};

const LikeEvents = model<ILikeEventsDocument, ILikeEventsModel>('LikeEvents', LikeEventsSchema);
export { LikeEvents };
