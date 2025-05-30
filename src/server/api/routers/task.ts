import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
        dueDate: z.date().optional(),
        assigneeIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { organization: true }
      });

      if (!user?.organization) {
        throw new Error("User is not part of any organization");
      }

      const task = await ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          organizationId: user.organization.id,
          createdById: ctx.session.user.id,
          assignments: input.assigneeIds ? {
            create: input.assigneeIds.map(assigneeId => ({
              assigneeId,
              assignedById: ctx.session.user.id
            }))
          } : undefined
        },
        include: {
          assignments: {
            include: {
              assignee: true
            }
          }
        }
      });

      return task;
    }),

  getAll: protectedProcedure
    .input(
      z.object({
        status: z.enum(["TODO", "IN_PROGRESS", "DONE", "BLOCKED", "ARCHIVED"]).optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
        sortBy: z.enum(["createdAt", "dueDate", "priority"]).optional(),
        sortOrder: z.enum(["asc", "desc"]).optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { organization: true }
      });

      if (!user?.organization) {
        throw new Error("User is not part of any organization");
      }

      const tasks = await ctx.db.task.findMany({
        where: {
          organizationId: user.organization.id,
          deletedAt: null,
          ...(input?.status && { status: input.status }),
          ...(input?.priority && { priority: input.priority }),
        },
        include: {
          assignments: {
            include: {
              assignee: true
            }
          },
          createdBy: true
        },
        orderBy: input?.sortBy ? {
          [input.sortBy]: input.sortOrder || "desc"
        } : {
          createdAt: "desc"
        }
      });

      return tasks;
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE", "BLOCKED", "ARCHIVED"])
      })
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.update({
        where: { id: input.taskId },
        data: { status: input.status },
        include: {
          assignments: {
            include: {
              assignee: true
            }
          }
        }
      });

      return task;
    }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: taskId }) => {
      const task = await ctx.db.task.findUnique({
        where: { id: taskId },
        include: {
          createdBy: true,
          assignments: {
            include: {
              assignee: true,
              assignedBy: true,
            },
          },
        },
      });

      if (!task) {
        throw new Error("Task not found");
      }

      // Verify user has access to this task
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: { organization: true }
      });

      if (!user?.organization || task.organizationId !== user.organization.id) {
        throw new Error("Unauthorized");
      }

      return task;
    }),

  update: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        title: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE", "BLOCKED", "ARCHIVED"]),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
        dueDate: z.date().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.update({
        where: { id: input.taskId },
        data: {
          title: input.title,
          description: input.description,
          status: input.status,
          priority: input.priority,
          dueDate: input.dueDate,
        },
        include: {
          createdBy: true,
          assignments: {
            include: {
              assignee: true,
              assignedBy: true,
            },
          },
        },
      });

      return task;
    }),

  assignUser: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        assigneeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const assignment = await ctx.db.taskAssignment.create({
        data: {
          taskId: input.taskId,
          assigneeId: input.assigneeId,
          assignedById: ctx.session.user.id,
        },
        include: {
          assignee: true,
          assignedBy: true,
        },
      });

      return assignment;
    }),

  removeAssignment: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        assigneeId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.taskAssignment.delete({
        where: {
          taskId_assigneeId: {
            taskId: input.taskId,
            assigneeId: input.assigneeId,
          },
        },
      });

      return { success: true };
    }),
});