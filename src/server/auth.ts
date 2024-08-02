import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

import { env } from "~/env";
import { db } from "~/server/db";
import { AssignmentCommitment } from "~/types/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      creatorId: string;
      learnerId: string;
      unconfirmedTx: string;
      accessTokenMintTx: string;
      hasMintedAccessToken: boolean;
      lessonIds: string[];
      assignmentCommitments: AssignmentCommitment[];
      tncVersion: string;
      // ...other properties
      // role: UserRole;
    };
    sessionId: string;
    role: {
      id: string;
      accessToken: string;
      team: string;
      role: string;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      const _user = await db.user.findUnique({
        where: { id: user.id },
        include: {
          creator: true,
          learner: { select: { id: true, lessons: true, assignments: true } },
          sessions: { select: { id: true, role: true } },
        },
      });

      const sessionId = _user?.sessions?.[0]?.id;
      const role = _user?.sessions?.[0]?.role;

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          creatorId: _user && _user.creator ? _user.creator.id : undefined,
          learnerId: _user && _user.learner ? _user.learner.id : undefined,
          unconfirmedTx: _user?.unconfirmedTx,
          accessTokenMintTx: _user?.accessTokenMintTx,
          hasMintedAccessToken: _user?.hasMintedAccessToken,
          lessonIds:
            _user && _user.learner
              ? _user.learner.lessons.map((l) => l.id)
              : [],
          assignmentCommitments:
            _user && _user.learner
              ? _user.learner.assignments.map((a) => ({
                  assignmentId: a.assignmentId,
                  assignmentCommitmentId: a.id,
                  learnerNotes: a.learnerNotes,
                  status: a.status,
                  archived: a.archived,
                }))
              : [],
          tncVersion: _user?.tncVersion,
        },
        sessionId: sessionId,
        role: role,
      };
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
