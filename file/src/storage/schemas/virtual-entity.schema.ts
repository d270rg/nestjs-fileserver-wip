import { randomUUID } from 'node:crypto';
import { IEntity } from '@src/models/i-entity';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const VirtualEntity = new Schema<IEntity>({
  id: {
    type: String,
    default: () => randomUUID(),
    unique: true,
    index: true,
    required: true,
  },
  name: String,
  parentFolderId: {
    type: String,
    ref: 'VirtualFolder',
  },
  ownerId: { type: String, required: true },
  isFile: Boolean,
  meta: { type: Schema.Types.Mixed, required: true },
  permissionList: { type: Schema.Types.Mixed, required: true },
});

/**
 * _id and __v fields disabled manually to have more control
 * over `id` field and ensure types consistency
 */
VirtualEntity.set('toObject', {
  transform: function (_doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

VirtualEntity.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (_doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

export const VirtualEntityModel = mongoose.model<IEntity>(
  'VirtualEntity',
  VirtualEntity,
);
