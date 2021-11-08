import { Schema, Document } from "mongoose";

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export type Status = "Pending" | "Success" | "Failed";
export type Schedule = "Regular" | "Emergency" | "Scheduled";

export const MailNotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId, // user -> "-1" will refer to guests only
      ref: "User",
    },
    recipient: {
      type: String,
      trim: true,
      validate: {
        validator: (email) => emailRegex.test(email),
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    subject: {
      type: String,
      required: [true, "Please provide a subject"],
    },
    template: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => {
          if (value == "") return false;
          return true;
        },
        message: (_) => "template cannot be empty",
      },
    },
    context: { type: Object, default: {} },
    process_time: Date,
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      required: true,
      default: "Pending",
    },
    schedule: {
      type: String,
      enum: ["Regular", "Emergency", "Scheduled"],
      required: true,
    },
    sent_logs: [
      {
        status: String,
        process_time: Date,
        message: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export interface MailNotification extends Document {
  user?: string;
  recipient: string;
  subject: string;
  template: string;
  context: object;
  process_time: any;
  status: Status;
  schedule: Schedule;
  sent_logs: Array<{ status: string; process_time: any; message: string }>;
}
