const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const email = process.argv[2];

if (!email) {
    console.log('❌ Error: Por favor proporciona un email.');
    console.log('Uso: node scripts/set-admin.js <email>');
    process.exit(1);
}

async function main() {
    try {
        const user = await prisma.user.update({
            where: { email },
            data: { isAdmin: true },
        });
        console.log(`✅ ¡Éxito! El usuario ${user.email} ahora es Administrador.`);
    } catch (e) {
        if (e.code === 'P2025') {
            console.error(`❌ Error: No se encontró ningún usuario con el email "${email}".`);
        } else {
            console.error('❌ Error inesperado:', e.message);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
