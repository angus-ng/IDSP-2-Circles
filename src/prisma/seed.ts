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
    },
  })

  console.log({ a })
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