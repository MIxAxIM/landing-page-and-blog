import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateAssignmentCommitments() {
  console.log('Starting migration of learnerNotes to privateNotes...')

  try {
    // Get all assignment commitments that have learnerNotes
    const commitments = await prisma.assignmentCommitment.findMany({
      where: {
        learnerNotes: {
          not: null
        }
      },
      select: {
        id: true,
        learnerNotes: true,
        status: true
      }
    })

    console.log(`Found ${commitments.length} commitments with learnerNotes`)

    // Update each commitment
    const updates = commitments.map(commitment =>
      prisma.assignmentCommitment.update({
        where: { id: commitment.id },
        data: {
          privateNotes: commitment.learnerNotes,
          privateStatus: commitment.status,
          // Don't clear learnerNotes yet - we'll do that in a separate migration
          // after verifying the data transfer
        }
      })
    )

    // Execute all updates
    const results = await prisma.$transaction(updates)

    console.log(`Successfully migrated ${results.length} commitments`)

    // Log some stats
    const successful = results.length
    const failed = commitments.length - successful
    console.log('\nMigration Summary:')
    console.log(`Total commitments processed: ${commitments.length}`)
    console.log(`Successful migrations: ${successful}`)
    console.log(`Failed migrations: ${failed}`)

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
migrateAssignmentCommitments()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
