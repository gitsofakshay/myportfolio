// types/certification.d.ts
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  credentialUrl?: string;
}
