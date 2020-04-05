import { Request } from "express";
import { Database, User } from "../types";

export const authorize = async (
  db: Database,
  req: Request
): Promise<User | null> => {
  try {
    const token = req.get("X-CSRF-TOKEN");
    const viewer = await db.users.findOne({
      _id: req.signedCookies.viewer
    });
    return viewer;
  } catch (error) {
    throw new Error(error)
  }
};
