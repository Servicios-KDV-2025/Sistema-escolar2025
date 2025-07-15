import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

// Configurar el cliente de Convex
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, nombreCorto, email } = body;

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

    // Crear el prospecto en Convex
    const nuevoProspecto = await convex.mutation(api.prospectos.crearProspecto, {
      nombre,
      nombreCorto,
      email,
      // Los campos opcionales se pueden enviar como undefined
      logoUrl: undefined,
      descripcion: undefined,
      direccion: undefined,
      telefono: undefined,
      director: undefined,
    });

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
