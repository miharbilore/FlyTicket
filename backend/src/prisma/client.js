/**
 * prisma/client.js
 * 
 * Bu dosya, tüm uygulama boyunca kullanılacak olan tek bir PrismaClient örneğini (instance) oluşturur.
 * Veritabanı bağlantılarını verimli yönetmek için (Connection Pooling) tek bir instance kullanmak en iyi yöntemdir.
 */

const { PrismaClient } = require('@prisma/client');

// Uygulama genelinde kullanılacak database istemcisi
const prisma = new PrismaClient();

module.exports = prisma;
