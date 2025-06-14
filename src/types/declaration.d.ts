// TypeScript module declaration for JS prismaClient

declare module '../../server/prismaClient' {
	import { PrismaClient } from '@prisma/client';
	const prisma: PrismaClient;
	export default prisma;
}

declare module '../../../server/prismaClient' {
	import { PrismaClient } from '@prisma/client';
	const prisma: PrismaClient;
	export default prisma;
}

declare module '../../../../server/prismaClient' {
	import { PrismaClient } from '@prisma/client';
	const prisma: PrismaClient;
	export default prisma;
}

declare module '../lib/auth' {
  export * from '../lib/auth';
}
