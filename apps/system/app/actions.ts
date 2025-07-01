'use server';

import { api } from '@/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { rootDomain, protocol } from '@/lib/utils';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function createSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;

  if (!subdomain) {
    return { success: false, error: 'Subdomain is required' };
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  if (sanitizedSubdomain !== subdomain) {
    return {
      subdomain,
      success: false,
      error:
        'Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.'
    };
  }

  try {
    // Verificar si el subdominio ya existe
    const existingSubdomain = await convex.query(api.subdomains.getSubdomainData, {
      subdomain: sanitizedSubdomain
    });

    if (existingSubdomain) {
      return {
        subdomain,
        success: false,
        error: 'This subdomain is already taken'
      };
    }

    // Crear el nuevo subdominio
    await convex.mutation(api.subdomains.createSubdomain, {
      subdomain: sanitizedSubdomain
    });

    redirect(`${protocol}://${sanitizedSubdomain}.${rootDomain}`);
  } catch (error) {
    return {
      subdomain,
      success: false,
      error: 'Failed to create subdomain. Please try again.'
    };
  }
}

export async function deleteSubdomainAction(
  prevState: any,
  formData: FormData
) {
  const subdomain = formData.get('subdomain') as string;
  
  try {
    await convex.mutation(api.subdomains.deleteSubdomain, {
      subdomain: subdomain
    });
    
    revalidatePath('/admin');
    return { success: 'Domain deleted successfully' };
  } catch (error) {
    return { 
      success: false, 
      error: 'Failed to delete subdomain. Please try again.' 
    };
  }
}