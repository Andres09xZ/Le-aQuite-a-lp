import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const app = express();
const port = Number(process.env.PORT || 3001);
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL no esta definida en el archivo .env');
}

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
const prisma = new PrismaClient({ adapter });

const allowedOrigins = new Set([
  'https://lenaquitena-lp-latest.onrender.com',
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter((v): v is string => Boolean(v)));

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests and same-origin requests without Origin header.
    if (!origin) {
      callback(null, true);
      return;
    }
    if (allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

type ReservationStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';

const isValidReservationStatus = (value: string): value is ReservationStatus =>
  ['pending', 'confirmed', 'rejected', 'cancelled'].includes(value);

// ==================== ENDPOINTS ====================

app.get('/api/menu', async (_req, res) => {
  try {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        items: { orderBy: { order: 'asc' } }
      }
    });
    console.log("Categories encontradas:", categories.length);
    res.json(categories);
  } catch (error) {
    console.error("Error completo:", error);
    res.status(500).json({ error: 'Error al obtener el menú' });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    const newMenu = req.body;
    if (!Array.isArray(newMenu)) {
      return res.status(400).json({ error: 'El body debe ser un arreglo de categorías' });
    }

    console.log("📥 Recibido:", newMenu.length, "categorías");

    await prisma.menuItem.deleteMany();
    await prisma.menuCategory.deleteMany();
    console.log("🗑️ Tablas limpiadas");

    for (let catIndex = 0; catIndex < newMenu.length; catIndex++) {
      const cat = newMenu[catIndex];
      const created = await prisma.menuCategory.create({
        data: {
          title: cat.title,
          order: catIndex,
          items: {
            create: (cat.items ?? []).map((item: any, itemIndex: number) => ({
              name: item.name,
              desc: item.desc ?? null,
              price: item.price,
              badge: item.badge ?? null,
              order: itemIndex,
            }))
          }
        }
      });
      console.log(`✅ Creada categoría: ${cat.title} | ID: ${created.id}`);
    }

    const total = await prisma.menuCategory.count();
    console.log(`📊 Total en base de datos: ${total}`);

    // Verificación extra
    const allCategories = await prisma.menuCategory.findMany();
    console.log("🔍 Categorías en DB:", JSON.stringify(allCategories, null, 2));

    res.json({ 
      message: 'Intento terminado',
      totalSaved: total 
    });

  } catch (error: any) {
    console.error("❌ ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/reservations', async (_req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(reservations);
  } catch (error: any) {
    console.error('Error al obtener reservas:', error?.message ?? error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

app.post('/api/reservations', async (req, res) => {
  try {
    const { locale, date, time, guests, name, phone, notes, source } = req.body ?? {};

    if (!locale || !date || !time || !guests || !name || !phone) {
      return res.status(400).json({
        error: 'Campos requeridos: locale, date, time, guests, name, phone',
      });
    }

    const reservation = await prisma.reservation.create({
      data: {
        locale: String(locale).trim(),
        date: String(date).trim(),
        time: String(time).trim(),
        guests: String(guests).trim(),
        contactName: String(name).trim(),
        contactPhone: String(phone).trim(),
        notes: notes ? String(notes).trim() : null,
        source: source ? String(source).trim() : 'chatbot',
        status: 'pending',
      },
    });

    res.status(201).json(reservation);
  } catch (error: any) {
    console.error('Error al guardar reserva:', error?.message ?? error);
    res.status(500).json({ error: 'Error al guardar reserva' });
  }
});

app.patch('/api/reservations/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body ?? {};

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID invalido' });
    }

    if (typeof status !== 'string' || !isValidReservationStatus(status)) {
      return res.status(400).json({ error: 'Estado invalido' });
    }

    const reservation = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    res.json(reservation);
  } catch (error: any) {
    console.error('Error al actualizar estado de reserva:', error?.message ?? error);
    res.status(500).json({ error: 'Error al actualizar estado de reserva' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
});