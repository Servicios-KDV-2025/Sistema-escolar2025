
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);


export async function getSubdomainData(subdomain: string) {
    return await convex.query(api.subdomains.getSubdomainData, { subdomain });
}

export async function getAllSubdomains() {
    return await convex.query(api.subdomains.getAllSubdomains);
  }
