import mongoose from 'mongoose';
import { PasswordService } from '../services/password';

interface UserAttributes {
  email: string;
  password: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
  build: (attrs: UserAttributes) => UserDocument;
}

interface UserDocument extends mongoose.Document, UserAttributes { }

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  toJSON: {
    versionKey: false,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.password;
    },
  },
})

userSchema.statics.build = (attrs: UserAttributes) => new User(attrs);

userSchema.pre('save', async function (done) {
  if (!this.isModified('password')) return;

  const hashedPassword = await PasswordService.toHash(this.get('password'));
  this.set('password', hashedPassword);

  done();
});

export const User = mongoose.model<UserDocument, UserModel>('User', userSchema);
