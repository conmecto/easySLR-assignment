import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const organizationRouter = createTRPCRouter({
  createOrganization: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        domain: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingOrg = await ctx.db.organization.findUnique({
        where: { domain: input.domain },
      });

      if (existingOrg) {
        throw new Error("Organization with this domain already exists");
      }

      const organization = await ctx.db.organization.create({
        data: {
          name: input.name,
          domain: input.domain,
          users: {
            connect: {
              id: ctx.session.user.id
            }
          }
        },
        include: {
          users: true
        }
      });

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { 
          role: "ADMIN",
          organizationId: organization.id
        }
      });

      return organization;
    }),

  getOrganizationMembers: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { organization: true }
      });

      if (!user?.organization) {
        throw new Error("User is not part of any organization");
      }

      const members = await ctx.db.user.findMany({
        where: {
          organizationId: user.organization.id,
          deletedAt: null
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return members;
    }),
});