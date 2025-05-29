import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const inviteRouter = createTRPCRouter({
  checkInvite: protectedProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const invite = await ctx.db.organizationInvite.findFirst({
        where: {
          email: input.email,
          accepted: false
        },
        include: {
          invitedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      return invite;
    }),

  inviteMember: protectedProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { organization: true }
      });

      if (!user?.organization) {
        throw new Error("You must be part of an organization to invite members");
      }

      if (user.role !== "ADMIN") {
        throw new Error("Only organization admins can invite members");
      }

      const existingUser = await ctx.db.user.findUnique({
        where: { email: input.email }
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const existingInvite = await ctx.db.organizationInvite.findFirst({
        where: {
          email: input.email,
          organizationId: user.organization.id,
          accepted: false
        }
      });

      if (existingInvite) {
        throw new Error("Invitation already sent to this email");
      }

      const invite = await ctx.db.organizationInvite.create({
        data: {
          email: input.email,
          organizationId: user.organization.id,
          invitedById: ctx.session.user.id
        }
      });

      return invite;
    }),

  getInvites: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { organization: true }
      });

      if (!user?.organization) {
        throw new Error("User is not part of any organization");
      }

      const invites = await ctx.db.organizationInvite.findMany({
        where: {
          organizationId: user.organization.id,
          accepted: false
        },
        include: {
          invitedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return invites;
    }),
});