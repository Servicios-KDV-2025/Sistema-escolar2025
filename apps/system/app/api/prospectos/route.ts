// File: apps/system/app/api/prospectos/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

// Configurar el cliente de Convex
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, nombreCorto, email, activarEscuela } = body;

    // Validar que los campos requeridos estén presentes
    if (!nombre || !nombreCorto || !email) {
      return NextResponse.json(
        { error: 'Los campos nombre, nombreCorto y email son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    // Verificar si ya existe un prospecto con este email
    const prospectoExistente = await convex.query(api.prospectos.obtenerProspectoPorEmail, {
      email
    });

    if (prospectoExistente) {
      return NextResponse.json(
        { error: 'Ya existe un prospecto con este email' },
        { status: 409 }
      );
    }

    // Crear el prospecto en Convex
    const nuevoProspecto = await convex.mutation(api.prospectos.crearProspecto, {
      nombre,
      nombreCorto,
      email,
      logoUrl: undefined,
      descripcion: undefined,
      direccion: undefined,
      telefono: undefined,
      director: undefined,
    });

    // Si se solicita activar la escuela directamente (simular pago completado)
    if (activarEscuela && nuevoProspecto) {
      const resultado = await convex.mutation(api.prospectos.transferirProspectoAEscuela, {
        prospectoId: nuevoProspecto._id
      });

      return NextResponse.json(
        { 
          success: true, 
          message: 'Prospecto creado y escuela activada exitosamente',
          prospecto: nuevoProspecto,
          escuela: resultado.escuela
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Prospecto creado exitosamente',
        prospecto: nuevoProspecto 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error al crear prospecto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Obtener todos los prospectos
    const prospectos = await convex.query(api.prospectos.obtenerProspectos);
    
    return NextResponse.json(
      { 
        success: true, 
        prospectos 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al obtener prospectos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Ruta adicional para activar escuela de prospecto existente
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      );
    }

    // Buscar el prospecto por email
    const prospecto = await convex.query(api.prospectos.obtenerProspectoPorEmail, {
      email
    });

    if (!prospecto) {
      return NextResponse.json(
        { error: 'No se encontró un prospecto con ese email' },
        { status: 404 }
      );
    }

    // Simular pago completado y transferir a escuela
    const resultado = await convex.mutation(api.prospectos.transferirProspectoAEscuela, {
      prospectoId: prospecto._id
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Escuela activada exitosamente',
        escuela: resultado.escuela
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al activar escuela:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}