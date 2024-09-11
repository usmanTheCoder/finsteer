import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { prisma } from "~/server/db/client";

const settingsRouter = createTRPCRouter({
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const settings = await prisma.settings.findUnique({
      where: { userId: ctx.session.user.id },
    });
    return settings;
  }),

  updateSettings: protectedProcedure
    .input(
      z.object({
        currency: z.string().optional(),
        language: z.string().optional(),
        theme: z.string().optional(),
        notifications: z
          .object({
            email: z.boolean().optional(),
            push: z.boolean().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const settings = await prisma.settings.upsert({
        where: { userId: ctx.session.user.id },
        create: {
          userId: ctx.session.user.id,
          ...input,
        },
        update: {
          ...input,
        },
      });
      return settings;
    }),
});

export default settingsRouter;