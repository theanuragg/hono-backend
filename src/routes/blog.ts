import { PrismaClient, User } from "@prisma/client/edge";
import { warnEnvConflicts } from "@prisma/client/runtime/library";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify, jwt } from "hono/jwt";

export const blogRoute = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

blogRoute.use('/*', async (c, next) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())
  const authheader = c.req.header("Authorization") 
  const user  = await verify(authheader || "", c.env.JWT_SECRET)

   if (user){
   c.set("userId", user)
   next()
  }
  
  else {
    c.status(403)
    return c.json({message: "you need to  login"})

  }
});


blogRoute.post("/create", async (c) => {
  const authorId = c.get("userId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const post = await prisma.story.create({
    data: {
      title: body.title,
      content: body.content,
      authorId:  authorId
    },

    
  });
  return c.json({
    message:"jdjid"
})
});

blogRoute.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  prisma.story.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content,
    },
  });
  return c.text("updted post");
});

blogRoute.get("/", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const post = await prisma.story.findFirst({
    where: {
      id: body.id,
    },
  });
  return c.json(post);
});

//pagination

blogRoute.get("/bulk", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const posts = await prisma.story.findMany({});

  return c.json(posts);
});
