import mongoose, { Document, Schema } from 'mongoose';

export interface IRegister {
  name: string;
  address: number;
  length: number;
  scaleFactor?: number;
  decimalPoint?: number;
  byteOrder?: string;
  unit?: string;
}

export interface IDevice extends Document {
  name: string;
  ip: string;
  port: number;
  slaveId: number;
  enabled: boolean;
  registers: IRegister[];
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RegisterSchema = new Schema<IRegister>({
  name: { type: String, required: true },
  address: { type: Number, required: true },
  length: { type: Number, default: 2 },
  scaleFactor: { type: Number, default: 1 },
  decimalPoint: { type: Number, default: 0 },
  byteOrder: { type: String, default: 'AB CD' },
  unit: { type: String },
});

const DeviceSchema = new Schema<IDevice>({
  name: { type: String, required: true },
  ip: { type: String, required: true },
  port: { type: Number, default: 502 },
  slaveId: { type: Number, required: true, default: 1 },
  enabled: { type: Boolean, default: true },
  registers: [RegisterSchema],
  lastSeen: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt timestamp on save
DeviceSchema.pre(
  'save',
  function (this: IDevice, next: mongoose.CallbackWithoutResult) {
    this.updatedAt = new Date();
    next(undefined); // Call next with undefined to indicate no error
  }
);

export default mongoose.model<IDevice>('Device', DeviceSchema);
