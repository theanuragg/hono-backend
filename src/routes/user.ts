import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  variables: {
    userId: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: body.password,
      },
    });
    
    const prettyJSON =  await sign({user: user.id }, c.env.JWT_SECRET);
    return c.json({ prettyJSON });
  } catch (e) {
    console.log(e);
    c.status(403);
    return c.json({ error: "CAN'T SIGNUP" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password
      },
    });
    if (!user) {
      c.status(403);
      return c.json({
        error: "user not found",
      });
    }

    const prettyJSON =  await sign({user: user.id }, c.env.JWT_SECRET);
    return c.json({ prettyJSON });
  } catch (e) {
    c.status(401);
    console.log(e);
    return c.json({ error: "CAN'T SIGNIN" });
  }
});
