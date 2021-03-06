import Joi, { ValidationResult } from "joi";
import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { keys } from "../config/keys";
import { BadRequestError } from "../config/errors/BadRequestError";

interface IUserAttr {
  email: string;
  password: string;
  name: string;
}

interface IUser {
  email: string;
  password: string;
}

export interface IUserDocument extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  getAuthToken(): string;
}

interface IUserModel extends Model<IUserDocument> {
  build(data: IUserAttr): IUserDocument;
  validateRegister(data: IUserAttr): ValidationResult;
  validateLogin(data: IUser): ValidationResult;
  getUser(data: IUser): Promise<IUserDocument>;
}

const userSchema = new mongoose.Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
      },
    },
  }
);

userSchema.statics.validateRegister = (data: IUserAttr) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(12),
  });

  return schema.validate(data);
};

userSchema.statics.validateLogin = (data: IUser) => {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string(),
  });

  return schema.validate(data);
};

userSchema.statics.getUser = async (data: IUser) => {
  const user = await User.findOne({ email: data.email });
  console.log(user);
  if (!user) {
    throw new BadRequestError("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new BadRequestError("Invalid email or password");
  }

  return user;
};

userSchema.statics.build = (data: IUserAttr) => {
  return new User(data);
};

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

userSchema.methods.getAuthToken = function () {
  return jwt.sign({ id: this._id }, keys.jwtSecret!, {
    expiresIn: keys.jwtExpire,
  });
};

const User = mongoose.model<IUserDocument, IUserModel>("User", userSchema);

export { User };
