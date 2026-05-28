import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const roles = await prisma.role.createMany({
        data: [
            { name: 'USER' },
            { name: 'ADMIN' },
        ],
    })
    const avatar = await prisma.userAvatar.create({
        data: {
            url: 'https://cdn.sakuraocean.app/avatar/icono.png'
        }
    })
    console.log({ roles, avatar })
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