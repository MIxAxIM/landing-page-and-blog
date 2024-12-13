import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Update COMMITMENT_MADE and COMMITMENT_DENIED to ON_CHAIN
  await prisma.task.updateMany({
    where: {
      status: {
        in: []
      }
    },
    data: {
      status: 'ON_CHAIN'
    }
  })

  // Update COMMITMENT_ACCEPTED to ARCHIVED
  await prisma.task.updateMany({
    where: {
      status: 'BACKLOG'
    },
    data: {
      status: 'ARCHIVED'
    }
  })

  console.log('Updated task statuses successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
