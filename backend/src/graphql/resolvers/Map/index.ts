import { authorize } from "./../../../lib/utils/index";
import { ObjectId } from "mongodb";
import { Request } from "express";
import { IResolvers } from "apollo-server-express";
import { Database, User } from "../../../lib/types";
import { Google } from '../../../lib/api'
import { Groups, UserHelpRequests, generateUserLocationArgs, generateUserAddressArgs, generateUserAddressResult } from './types'


export const mapResolvers: IResolvers = {
  Query: {
    getCurrentMapData: async (
      _root: undefined,
      { maxLat, minLat, maxLng, minLng, page, limit, language, typeOfHelp }: { maxLat: number, minLat: number, maxLng: number, minLng: number, page: number, limit: number, language: string, typeOfHelp: string },
      { db }: { db: Database }): Promise<Groups> => {
      try {
        const data: Groups = {
          total: 0,
          result: [],
          helpRequests: {
            total: 0,
            result: []
          },
        }
        //let cursor = await db.users.find({ "geoLocation.lat": { $gt: minLat, $lt: minLat } });
        let cursor = await db.groups.find(
          {
            "geoLocation.lat": { $gt: minLat, $lt: maxLat },
            "geoLocation.lng": { $gt: minLng, $lt: maxLng }
          }
        );
        data.total = await cursor.count();
        data.result = await cursor.toArray();
        let usersResult = await db.users.find(
          {
            "geoLocation.lat": { $gt: minLat, $lt: maxLat },
            "geoLocation.lng": { $gt: minLng, $lt: maxLng }
          }
        );
        let usersData = await usersResult.toArray()
        const usersID = usersData.map(({ _id }) => _id)
        let results = await db.helpRequests.find({
          by: { $in: usersID },
          language,
          type: typeOfHelp
        })
        results = results.skip(page > 0 ? (page - 1) * limit : 0);
        results = results.limit(limit);
        data.helpRequests.total = await results.count()
        data.helpRequests.result = await results.toArray()
        return data;
      } catch (error) {
        throw new Error('try agin later')
      }
    }
  },
  Mutation: {
    generateUserLocation: async (
      _root: undefined,
      { lat, lng }: generateUserLocationArgs,
      { db, req }: { db: Database, req: Request }
    ): Promise<string | null> => {
      try {
        if (!lat || !lng) {
          throw new Error('lat and lng are required')
        }
        const viewer = await authorize(db, req);
        if (!viewer) {
          throw new Error('you are not allowed to change this data')
        }
        const { address, geoLocation } = await Google.placesRadar(lat, lng)
        const updateResult = await db.users.findOneAndUpdate({ _id: viewer._id }, { $set: { address, geoLocation } })
        if (!updateResult.value) {
          throw new Error('something went wrong, try agin later')
        }
        return address;
      } catch (error) {
        throw new Error(error)
      }

    },
    generateUserAddress: async (
      _root: undefined,
      { userAddress }: generateUserAddressArgs,
      { db, req }: { db: Database, req: Request }
    ): Promise<generateUserAddressResult | null> => {
      try {
        if (!userAddress) {
          throw new Error('address is required')
        }
        const viewer = await authorize(db, req);

        if (!viewer) {
          throw new Error('you are not allowed to change this data')
        }
        const { address, geoLocation } = await Google.geocode(userAddress)
        const updateResult = await db.users.findOneAndUpdate({ _id: viewer._id }, { $set: { address, geoLocation } })
        if (!updateResult.value) {
          throw new Error('something went wrong, try agin later')
        }
        return {
          address,
          geoLocation
        };
      } catch (error) {
        throw new Error(error)
      }

    },
    generateGeoAddress: async (
      _root: undefined,
      { userAddress }: generateUserAddressArgs,
      { db, req }: { db: Database, req: Request }
    ): Promise<generateUserAddressResult | null> => {
      try {
        if (!userAddress) {
          throw new Error('address is required')
        }

        const { address, geoLocation } = await Google.geocode(userAddress)
        return {
          address,
          geoLocation
        };
      } catch (error) {
        throw new Error(error)
      }

    },
    autoCompleteAddress: async (_root: undefined, { cityName }: { cityName: string }, { db }: { db: Database }): Promise<string[] | []> => {
      try {
        if (!cityName) {
          return []
        }
        const results = await Google.autoComplete(cityName)
        return results;
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}