/**
 * User service: get or create user, increment command usage, update skill score/badges.
 * All user data is stored in MongoDB via the User model.
 */

import { User } from '../database';
import type { IUser } from '../database';

type CommandName = keyof IUser['commandUsage'];

export async function getOrCreateUser(
  discordId: string,
  username: string
): Promise<IUser> {
  let user = await User.findOne({ discordId });
  if (!user) {
    user = await User.create({ discordId, username });
  } else if (user.username !== username) {
    user.username = username;
    await user.save();
  }
  return user;
}

export async function incrementCommandUsage(
  discordId: string,
  username: string,
  command: CommandName
): Promise<void> {
  await getOrCreateUser(discordId, username);
  await User.findOneAndUpdate(
    { discordId },
    {
      $inc: {
        skillScore: 1,
        [`commandUsage.${command}`]: 1,
      },
    }
  );
}
