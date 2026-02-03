/**
 * User model for skill scoring and command usage tracking.
 * Matches the schema described in README (discordId, username, skillScore, badges, commandUsage).
 */

import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserCommandUsage {
  analyzeCode: number;
  generateDocs: number;
  githubAnalyze: number;
  errorExplain: number;
  explain: number;
  projectHealth: number;
}

export interface IUser extends Document {
  discordId: string;
  username: string;
  skillScore: number;
  badges: string[];
  commandUsage: IUserCommandUsage;
  createdAt: Date;
  updatedAt: Date;
}

const commandUsageSchema = new Schema<IUserCommandUsage>(
  {
    analyzeCode: { type: Number, default: 0 },
    generateDocs: { type: Number, default: 0 },
    githubAnalyze: { type: Number, default: 0 },
    errorExplain: { type: Number, default: 0 },
    explain: { type: Number, default: 0 },
    projectHealth: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    skillScore: { type: Number, default: 0 },
    badges: { type: [String], default: [] },
    commandUsage: { type: commandUsageSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>('User', userSchema);
