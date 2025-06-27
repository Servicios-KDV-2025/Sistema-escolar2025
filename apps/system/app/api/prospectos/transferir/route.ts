import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

// Configurar el cliente de Convex
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prospectoId, direccion, telefono, director } = body;

    // Validar que el prospectoId esté presente
    if (!prospectoId) {
      return NextResponse.json(
        { error: 'El ID del prospecto es requerido' },
        { status: 400 }
      );
    }

    // Transferir el prospecto a escuela
    const resultado = await convex.mutation(api.prospectos.transferirProspectoAEscuela, {
      prospectoId,
      direccion,
      telefono,
      director,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Prospecto transferido exitosamente a escuela',
        data: resultado
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error al transferir prospecto:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 