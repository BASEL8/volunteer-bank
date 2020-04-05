import crypto from "crypto";
import { ObjectId } from "mongodb";
import { Request, Response } from "express";
import { IResolvers } from "apollo-server-express";
import { Google, Cloudinary } from "../../../lib/api";
import { Viewer, Database, User } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { LogInArgs, SignupArgs, SignupInputs, LoginEmailArgs } from "./types";

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true
};

const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database,
  res: Response
): Promise<User | null> => {
  const { user } = await Google.logIn(code);

  if (!user) {
    throw new Error("Google login error");
  }
  // Name/Photo/Email Lists
  const userNamesList = user.names && user.names.length ? user.names : null;
  const userPhotosList = user.photos && user.photos.length ? user.photos : null;
  const userEmailsList =
    user.emailAddresses && user.emailAddresses.length ? user.emailAddresses : null;

  // User Display Name
  const userName = userNamesList ? userNamesList[0].displayName : null;

  // User Id
  const userId =
    userNamesList && userNamesList[0].metadata && userNamesList[0].metadata.source
      ? userNamesList[0].metadata.source.id
      : null;

  // User Avatar
  const userAvatar =
    userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;

  // User Email
  const userEmail =
    userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google login error");
  }
  // if there is an account with google update
  // if there is an account with email update
  const updateRes = await db.users.findOneAndUpdate(
    { contact: userEmail },
    {
      $set: {
        name: userName,
        contact: userEmail,
      }
    },
    { returnOriginal: false }
  );

  let viewer = updateRes.value;

  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      helpRequests: [],
      wantToHelp: [],
      verifiedAccount: false,
      memberAtt: [],
      joinRequests: []
    });

    viewer = insertResult.ops[0];
  }

  res.cookie("viewer", userId, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000
  });

  return viewer;
};
const logInViaCookie = async (
  token: string,
  db: Database,
  req: Request,
  res: Response
): Promise<User | null> => {
  const viewer = await db.users.findOne({ _id: req.signedCookies.viewer })
  if (!viewer) {
    res.clearCookie("viewer", cookieOptions);
  }
  if (viewer && !viewer.salt) {
    const updateRes = await db.users.findOneAndUpdate(
      { _id: req.signedCookies.viewer },
      { $set: { token } },
      { returnOriginal: false }
    );
    if (!updateRes.value) {
      res.clearCookie("viewer", cookieOptions);
    }
    return viewer;
  }
  return viewer;
};
const verifyUser = (input: SignupInputs) => {
  const { name, password, contact, avatar } = input;
  if (!name && name.length < 5) {
    throw new Error("name is required and must be longer than 5 characters")
  }
  if (!password && password.length < 6) {
    throw new Error("password is required and must be longer than 6 characters")
  }
  if (!contact) {
    throw new Error("email is required ")
  }
  if (!avatar) {
    throw new Error("avatar is required ")
  }
}
export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    }
  },
  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db, req, res }: { db: Database; req: Request; res: Response }
    ): Promise<Viewer | null> => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex");
        const viewer: User | null = code
          ? await logInViaGoogle(code, token, db, res)
          : await logInViaCookie(token, db, req, res);

        if (!viewer) {
          return { didRequest: true };
        }
        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          didRequest: true,
          address: viewer.address,
          adminAtt: !!viewer.adminAtt
        };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
    signup: async (_root, { input }: SignupArgs, { db, }: { db: Database }): Promise<Viewer | undefined> => {
      try {
        verifyUser(input)
        const { name, password, contact, avatar } = input;
        const user = await db.users.findOne({ contact })
        if (user && user.salt) {
          throw new Error('user with the same email is already exist, try to reset your password')
        }
        const imageUrl = await Cloudinary.upload(avatar);
        const salt = crypto.randomBytes(16).toString('hex')
        const token = crypto.pbkdf2Sync(password, salt,
          1000, 64, `sha512`).toString(`hex`);

        if (user && !user.salt) {
          const insertUser = await db.users.findOneAndUpdate({ contact },
            {
              $set: {
                token,
                name,
                avatar: imageUrl,
                salt,
              }
            },
            { returnOriginal: false }
          )
          return {
            _id: user._id,
            token: token,
            avatar: user.avatar,
            didRequest: true
          }

        } else {
          const insertUser = await db.users.insertOne({
            _id: new ObjectId().toHexString(),
            token,
            name,
            avatar: imageUrl,
            contact,
            salt,
            helpRequests: [],
            wantToHelp: [],
            verifiedAccount: false,
            memberAtt: [],
            joinRequests: []
          })
          let viewer = insertUser.ops[0]
          return {
            _id: viewer._id,
            token: viewer.token,
            avatar: viewer.avatar,
            didRequest: true
          };
        }
      } catch (error) {
        throw new Error(`signup error : ${error}`)
      }

    },
    loginEmail: async (_root: undefined, { input }: LoginEmailArgs, { db, res, req }: { db: Database, req: Request, res: Response }): Promise<Viewer> => {
      try {
        const { contact, password } = input;
        const viewer = await db.users.findOne({ contact })
        if (!viewer) {
          throw new Error('something went wrong, User with this email dose not exist, Please signup')
        }
        if (!viewer.salt) {
          throw new Error('something went wrong, try signin with google or facebook')
        }
        let validatePassword = crypto.pbkdf2Sync(password,
          viewer.salt, 1000, 64, `sha512`).toString(`hex`) === viewer.token
        if (!validatePassword) {
          throw new Error('Email and Password do not match')
        }
        res.cookie("viewer", viewer._id, {
          ...cookieOptions,
          maxAge: 365 * 24 * 60 * 60 * 1000
        });
        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          didRequest: true,
          address: viewer.address,
          adminAtt: !!viewer.adminAtt
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    logOut: (_root: undefined, _args: {}, { res }: { res: Response }): Viewer => {
      try {
        res.clearCookie("viewer", cookieOptions);
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
      }
    }
  },
  Viewer: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id;
    }
  }
};