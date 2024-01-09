import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from '@ticket-trade-workspace/domain';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => {
        // Check if the value matches the email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: 'Invalid email address',
    },
    maxlength: 100,
  })
  email: string;

  @Prop({
    required: true,
    validate: {
      validator: (value: string) => {
        // Check if the value matches the password format
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[a-zA-Z\d\W]{8,}$/.test(
          value
        );
      },
      message:
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character, and a minimum of 8 and maximum of 30 characters',
    },
    maxlength: 30,
  })
  password: string;

  @Prop({
    required: true,
    validate: {
      validator: (value: string) => {
        // Check if the value contains only letters, spaces, hyphens, and apostrophes
        return /^[\p{L}\s'-]+$/u.test(value);
      },
      message: 'First name should contain only letters, spaces, hyphens, and apostrophes',
    },
    maxlength: 50,
  })
  firstName: string;

  @Prop({
    required: true,
    validate: {
      validator: (value: string) => {
        // Check if the value contains only letters, spaces, hyphens, and apostrophes
        return /^[\p{L}\s'-]+$/u.test(value);
      },
      message: 'Last name should contain only letters, spaces, hyphens, and apostrophes',
    },
    maxlength: 50,
  })
  lastName: string;

  @Prop({
    required: true,
    validate: {
      validator: (value: Date) => {
        // Check if the value is a valid date and not a future date
        if (isNaN(value.getTime()) || value > new Date() || value < getMinDate()) {
          return false;
        }
        return true;
      },
      message: 'Birthdate should be a valid date and cannot be a future date or earlier than 100 years from now',
    },
  })
  birthdate: Date;

  @Prop({
    required: false,
    type: [String],
    enum: Object.values(Role),
    default: [Role.USER],
  })
  roles: Role[];

  @Prop({ required: false })
  metricUnits: boolean;

  @Prop({ required: false })
  profilePicture: string;

}

export const UserSchema = SchemaFactory.createForClass(User);

//pre save hook to hash the password
UserSchema.pre<User>('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;

    return next();
  } catch (err) {
    return next(err);
  }
});


// Helper function to get the minimum date allowed for the birth date
function getMinDate(): Date {
  const currentDate = new Date();
  currentDate.setFullYear(currentDate.getFullYear() - 100);
  return currentDate;
}