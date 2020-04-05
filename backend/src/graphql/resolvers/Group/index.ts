import { Cloudinary } from "./../../../lib/api/cloudinary";
import { authorize } from "./../../../lib/utils/index";
import { ObjectId, Db } from "mongodb";
import { Request } from "express";
import { IResolvers } from "apollo-server-express";
import { Database, User, Group } from "../../../lib/types";

export const groupsResolvers: IResolvers = {
  Query: {
    //  groupUsers: () => { },
    group: async (_root: undefined, { id }: { id: string }, { db, req }: { db: Database, req: Request }): Promise<Group | null> => {
      try {
        const result = await db.groups.findOne({ _id: id })
        return result
      } catch (error) {
        throw new Error(error)
      }
    }
  },
  Mutation: {
    createGroup: async (_root: undefined, { name, description, avatar }: { name: string, description: string, avatar: string }, { db, req }: { db: Database, req: Request }): Promise<Group> => {

      try {
        const viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error('there is no user with this id ')
        }
        if (!viewer.verifiedAccount) {
          throw new Error('just users with verified account cant create groupe ')
        }
        if (!viewer.address) {
          throw new Error('update your address')
        }
        if (!viewer.geoLocation) {
          throw new Error('update your address')
        }
        if (viewer.adminAtt) {
          throw new Error("Just now you can't create more than one group")
        }
        //cant create two groups with same name
        const { address, geoLocation, _id } = viewer;
        const imageUrl = await Cloudinary.upload(avatar);

        const insertResult = await db.groups.insertOne({ _id: new ObjectId().toHexString(), avatar: imageUrl, name, description, address, geoLocation, admins: [_id], groupMembers: [], by: _id, joinRequests: [] })
        const createdGroup: Group = insertResult.ops[0];
        if (!createdGroup) {
          throw new Error('try again later')
        }
        await db.users.updateOne(
          {
            _id
          },
          {
            $set: { adminAtt: createdGroup._id.toString() }
          }
        );
        return {
          _id: createdGroup._id,
          name: createdGroup.name,
          address: createdGroup.address,
          geoLocation: createdGroup.geoLocation,
          admins: createdGroup.admins,
          groupMembers: createdGroup.groupMembers,
          by: createdGroup.by,
          description: createdGroup.description,
          avatar: createdGroup.avatar,
          joinRequests: createdGroup.joinRequests
        };
      } catch (error) {
        console.log(error)
        throw new Error('try agin later')
      }
    },
    joinGroup: async (_root: undefined, { id, languages }: { id: string, languages: string[] }, { db, req }: { db: Database, req: Request }): Promise<User> => {
      try {
        const viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error('there is no user with this id ')
        }
        console.log(typeof viewer._id)
        var hex = /[0-9A-Fa-f]{6}/g;
        const userID = (hex.test(viewer._id)) ? new ObjectId(viewer._id) : viewer._id;
        // = typeof viewer._id === 'string' ? new ObjectId(viewer._id) : viewer._id
        const isGroupMember = await db.groups.findOne({ _id: id, 'groupMembers.id': { $in: [userID] } })
        if (isGroupMember) {
          throw new Error('you are already member')
        }
        const sentRequest = await db.groups.findOne({ _id: id, joinRequests: { $elemMatch: { id: userID } } })
        console.log(sentRequest)
        if (sentRequest) {
          throw new Error('you are already sent join request, just wait ...')
        }
        const insertResult = await db.groups.findOneAndUpdate({ _id: id },
          { $push: { joinRequests: { id: viewer._id, languages } } }
        )
        if (!insertResult.value) {
          throw new Error('somethings went wrong, try agin later')
        }
        const userUpdate = await db.users.findOneAndUpdate({ _id: viewer._id },
          {
            $push: { joinRequests: id }
          }
        )
        return viewer;
      } catch (error) {
        console.log(error)
        throw new Error(error)
      }
    },
    verifyRequest: async (_root: undefined, { id, groupId }: { id: string, groupId: string }, { db, req }: { db: Database, req: Request }): Promise<Group> => {
      try {

        const viewer = await authorize(db, req)
        if (!viewer) {
          throw new Error("there is no user with this id")
          // throw new Error("you don't have the permission")
        }
        const admin = await db.users.findOne({ _id: viewer._id, adminAtt: groupId })

        const group = await db.groups.findOne({ _id: groupId })

        if (!group || !admin) {
          throw new Error('there is no group with this name, or admin with this name')
        }
        if (admin._id !== group.by) {
          throw new Error("you are not the creator of this group, you don't have the permission")
        }

        const user = await db.users.findOne({ _id: id, joinRequests: { $in: [groupId] } })
        if (!user) {
          throw new Error("there is no user with this id want to join this group")
        }
        const userResult = await db.users.findOneAndUpdate({ _id: id },
          { $push: { memberAtt: groupId }, $pull: { joinRequests: groupId } }
        )
        if (!userResult.value) {
          throw new Error('try agin later')
        }
        const groupUserIndex = group.joinRequests.findIndex(({ id }) => id)
        if (groupUserIndex !== -1) {
          const updateGroup = await db.groups.findOneAndUpdate({ _id: groupId },
            {
              $push: { groupMembers: { ...group.joinRequests[groupUserIndex] } },
              $pull: { joinRequests: { id } }
            }
          )
        }
        return group;
      } catch (error) {
        throw new Error(error)
      }



    }
    // helpSuggestion: () => { },
    // addAdmin: () => { }
  },
  Group: {
    id: (group: Group): string => {
      return group._id;
    },
    groupMembers: async (
      group: Group,
      { },
      { db, req }: { db: Database, req: Request }
    ): Promise<User[]> => {
      try {
        if (req.signedCookies.viewer) {
          const requestsID = group.groupMembers.map(({ id }) => id)
          const result = await db.users.find({ _id: { $in: requestsID } })
          const users = await result.toArray()
          return users
        }

        return []
      } catch (error) {
        throw new Error(error)
      }

    },
    joinRequests: async (
      group: Group,
      { },
      { db, req }: { db: Database, req: Request }
    ): Promise<User[]> => {
      try {
        const requestsID = group.joinRequests.map(({ id }) => id)
        if (req.signedCookies.viewer) {
          if (group.admins.indexOf(req.signedCookies.viewer) !== -1) {
            const result = await db.users.find({ _id: { $in: requestsID } })
            const users = await result.toArray()
            return users
          }
          return []
        }
        return []
      } catch (error) {
        throw new Error(error)
      }
    },
    creatorId: (group: Group): String => {
      return group.by
    },
    by: async (
      group: Group,
      { },
      { db }: { db: Database }
    ): Promise<String | null> => {
      try {
        let result = await db.users.findOne({
          _id: group.by
        });
        if (!result) {
          return null
        }
        return result.name;
      } catch (error) {
        throw new Error(`Failed to query group by: ${error}`);
      }
    }
  }
}