// File: apps/web/app/api/prospectos/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Obtener la URL base del sistema desde las variables de entorno
    const systemApiUrl = process.env.SYSTEM_API_URL || 'http://localhost:3001';
    
    // Reenviar la petición al sistema
    const response = await fetch(`${systemApiUrl}/api/prospectos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Error al reenviar petición al sistema:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Obtener la URL base del sistema desde las variables de entorno
    const systemApiUrl = process.env.SYSTEM_API_URL || 'http://localhost:3001';
    
    // Reenviar la petición al sistema
    const response = await fetch(`${systemApiUrl}/api/prospectos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error('Error al reenviar petición al sistema:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 