import { PrismaClient } from '@prisma/client'
import { hash } from "bcrypt";
const prisma = new PrismaClient()
async function main() {
  const a = await prisma.user.upsert({
    where: { email: 'a@a.com' },
    update: {},
    create: {
      email: 'a@a.com',
      username: "A_A",
      password: await hash("a", 12),
      profilePicture: "https://i.chzbgr.com/full/9578395904/h8D57C6EF/isnt-it-cute",
    }, include: {
      followers: {},
      following: {}
    }
  })
  const b = await prisma.user.upsert({
    where: { email: 'b@b.com' },
    update: {},
    create: {
      email: 'b@b.com',
      username: "B_B",
      password: await hash("b", 12),
      profilePicture: "https://static.wikia.nocookie.net/character-catalogue/images/c/c2/Takoyaki_Cat.png/revision/latest?cb=20230810135739",
    },
  })
  const c = await prisma.user.upsert({
    where: { email: 'c@c.com' },
    update: {},
    create: {
      email: 'c@c.com',
      username: "C_C",
      password: await hash("c", 12),
      profilePicture: "https://i.pinimg.com/550x/0a/b8/6d/0ab86dfd4bc698ce4f57a8e06a6ca6d1.jpg",
    },
  })
  await prisma.follows.create({
    data: {
      followerName: a.username,
      followingName: c.username
    },
  })

  await prisma.follows.create({
    data: {
      followerName: b.username,
      followingName: a.username
    },
  })

  console.log({ a, b, c })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })