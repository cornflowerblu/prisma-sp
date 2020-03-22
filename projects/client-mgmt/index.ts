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
      nullable: true,
      resolve: (_, args, ctx) =>
        ctx.prisma.clients(),
    })
    t.prismaFields(['client'])
    t.list.field('activeClients', {
      type: 'Client',
      resolve: (_, args, ctx) =>
        ctx.prisma.clients({where: {active: true } }),
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

const port = process.env.PORT || 3001
server.start({port: port})
console.log('Client server running on', port)