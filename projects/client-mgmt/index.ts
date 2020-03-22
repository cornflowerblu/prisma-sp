import { prisma } from '../../generated/prisma-client'
import datamodelInfo from '../../generated/nexus-prisma'
import * as path from 'path'
import { stringArg, idArg } from 'nexus'
import { prismaObjectType, makePrismaSchema } from 'nexus-prisma'
import { GraphQLServer } from 'graphql-yoga'

const Query = prismaObjectType<'Query'>({
  name: 'Query',
  definition(t) {
    t.prismaFields(['client'])
    t.list.field('allClients', {
      type: 'Client',
      resolve: (_, args, ctx) =>
        ctx.prisma.clients(),
    })
  },
})

const schema = makePrismaSchema({
  types: [Query],

  prisma: {
    datamodelInfo,
    client: prisma,
  },

  outputs: {
    schema: path.join(__dirname, './generated/schema.graphql'),
    typegen: path.join(__dirname, './generated/nexus.ts'),
  },
})

const server = new GraphQLServer({
  schema,
  context: { prisma },
  
})
server.start(() => console.log('Server is running on http://localhost:4000'))