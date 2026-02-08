import { prisma } from './src/lib/prisma';

async function main() {
    const settings = await prisma.settings.findMany();
    console.log(JSON.stringify(settings, null, 2));
}

main().catch(console.error);
