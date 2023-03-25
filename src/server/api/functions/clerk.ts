import { clerkClient } from "@clerk/nextjs/server";
import type { SerializedAuthor } from "../types";

/**
 * Fetches a list of users matching the provided ids
 * @param ids The List of IDs to fetch users
 * @returns a list of users
 */
export const getUsers = async (ids: string[]): Promise<SerializedAuthor[]> => {
  const users = await clerkClient.users.getUserList({
    userId: ids,
  });

  return users.map((user) => {
    return {
      id: user.id,
      username: user.username ?? "", // TODO: UserName should never be empty
      profileImage: user.profileImageUrl,
    };
  });
};

/**
 *  Gets a single user from clerk
 * @param id The ID of the User being queried for
 * @returns the serialized user
 */
export const getUser = async (id: string): Promise<SerializedAuthor | null> => {
  try {
    const user = await clerkClient.users.getUser(id);
    return {
      id: user.id,
      username: user.username ?? "",
      profileImage: user.profileImageUrl,
    };
  } catch {
    return null;
  }
};
