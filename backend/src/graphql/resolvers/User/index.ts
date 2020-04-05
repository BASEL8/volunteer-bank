import { ObjectId } from "mongodb";
import { Request } from "express";
import { IResolvers } from "apollo-server-express";
import { Database, User, HelpRequest, Group } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { UserArgs, CreateHelpRequestArgs, CreateHelpRequestInput, UserHelpRequests } from './types'
import { Google } from '../../../lib/api'
const verifyHelpRequestInput = ({
  title, description, type, language
}: CreateHelpRequestInput) => {
  if (title.length > 100) {
    throw new Error("title must be under 100 characters");
  }
  if (description.length > 5000) {
    throw new Error("description must be under 5000 characters");
  }
  if (!type && type.length < 0) {
    throw new Error("type is required");
  }
  if (!language && language.length < 0) {
    throw new Error("language is required");
  }

}
export const userResolvers: IResolvers = {
  Query: {
    user: async (
      _root: undefined,
      { id }: UserArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<User> => {
      try {
        const user = await db.users.findOne({ _id: id });

        if (!user) {
          throw new Error("user can't be found");
        }

        const viewer = await authorize(db, req);

        if (viewer && viewer._id === user._id) {
          user.authorized = true;
        }
        return user;
      } catch (error) {
        throw new Error(`Failed to query user: ${error}`);
      }
    }
  },
  Mutation: {
    createHelpRequest: async (
      _root: undefined,
      { input }: CreateHelpRequestArgs,
      { db, req }: { db: Database; req: Request }
    ): Promise<HelpRequest> => {
      try {
        verifyHelpRequestInput(input);
        let viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error("user cannot be found");
        }

        const insertRes = await db.helpRequests.insertOne({ ...input, by: viewer._id, _id: new ObjectId() });
        const insertedHelpRequest: HelpRequest = insertRes.ops[0];
        await db.users.updateOne(
          {
            _id: viewer._id
          },
          {
            $push: { helpRequests: insertedHelpRequest._id }
          }
        );
        return insertedHelpRequest;
      } catch (error) {
        throw new Error(`Failed to create a help: ${error}`);
      }
    }
  },
  HelpRequest: {
    id: (helpRequest: HelpRequest) => {
      return helpRequest._id;
    }
  },
  User: {
    id: (user: User): string => {
      return user._id;
    },
    salt: (): null => {
      return null;
    },
    token: (): null => {
      return null;
    },
    helpRequests: async (
      user: User,
      { page, limit }: { page: number, limit: number },
      { db }: { db: Database }
    ): Promise<UserHelpRequests | null> => {
      try {
        if (!user.authorized) {
          return null;
        }

        const data: UserHelpRequests = {
          total: 0,
          result: []
        };

        let cursor = await db.helpRequests.find({
          _id: { $in: user.helpRequests }
        });
        cursor = cursor.skip(page > 0 ? (page - 1) * limit : 0);
        cursor = cursor.limit(limit);
        data.total = await cursor.count();
        data.result = await cursor.toArray();

        return data;
      } catch (error) {
        throw new Error(`Failed to query user bookings: ${error}`);
      }
    },
    memberAtt: async (user: User,
      { },
      { db }: { db: Database }): Promise<Group[] | []> => {
      try {
        if (user.adminAtt) {
          return []
        }
        let result = await db.groups.find({
          'groupMembers.id': { $in: user.memberAtt }
        });
        if (!result) {
          throw new Error('rrrrrr')
        }
        const resultToArray = result.toArray()
        return resultToArray;
      } catch (error) {
        throw new Error(`Failed to query user bookings: ${error}`);
      }
    },
    adminAtt: async (
      user: User,
      { },
      { db }: { db: Database }
    ): Promise<Group | null> => {
      try {
        let result = await db.groups.findOne({
          _id: user.adminAtt
        });
        return result;
      } catch (error) {
        throw new Error(`Failed to query user bookings: ${error}`);
      }
    },
  }
}