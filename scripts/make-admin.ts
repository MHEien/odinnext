import { PrismaClient } from '@prisma/client'

// Initialize Prisma client
const prisma = new PrismaClient()

async function makeAllUsersAdmin() {
  try {
    console.log('Fetching all users from database...')
    
    // Find all users in the database
    const users = await prisma.user.findMany()
    
    if (users.length === 0) {
      console.error('No users found in the database')
      return
    }
    
    console.log(`Found ${users.length} user(s)`)
    
    // Update all users to ADMIN role
    const updateResults = await prisma.user.updateMany({
      data: { role: 'ADMIN' }
    })
    
    console.log(`Updated ${updateResults.count} user(s) to ADMIN role`)
    
    // Optionally, print the updated users
    const updatedUsers = await prisma.user.findMany()
    updatedUsers.forEach(user => {
      console.log(`User: ${user.name || user.email} (${user.id}) - Role: ${user.role}`)
    })
  } catch (error) {
    console.error('Error updating user roles:', error)
  } finally {
    // Disconnect from the Prisma client
    await prisma.$disconnect()
  }
}

// Run the function
makeAllUsersAdmin().catch(console.error) 