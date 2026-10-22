import type { Metadata } from 'next';
import Image from 'next/image';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = { title: 'Sign in' };

export default async function LoginPage({ searchParams }: PageProps<'/admin/login'>) {
  const { next } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-purple bg-[url('/background.png')] bg-cover bg-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">
        <Image src="/logo-wordmark.svg" width={504} height={165} alt="Nurova" className="h-auto w-32" priority />
        <h1 className="mt-6 text-2xl font-bold">Sign in to the dashboard</h1>
        <p className="mt-1 text-sm text-neutral-500">Edit website content and see newsletter sign-ups.</p>
        <LoginForm next={typeof next === 'string' ? next : '/admin'} />
      </div>
    </main>
  );
}
