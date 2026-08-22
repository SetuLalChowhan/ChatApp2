'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';
import { LoginRequest } from '@/types/auth';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    defaultValues: {
      phone: '',
      name: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    setServerError(null);
    try {
      await login(data.phone.trim(), data.name.trim());
    } catch (err: any) {
      setServerError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 p-8 shadow-xl backdrop-blur-md transition-colors">
      {/* Header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/60 shadow-inner">
          <MessageSquare className="h-6 w-6 stroke-[1.75]" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Welcome to Chat
        </h1>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Enter your phone number & name to get started. New numbers register automatically.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-300">
            {serverError}
          </div>
        )}

        <Input
          label="Phone Number"
          type="tel"
          placeholder="+1 555 123 4567"
          autoComplete="tel"
          disabled={isSubmitting}
          error={errors.phone?.message}
          {...register('phone', {
            required: 'Phone number is required',
            minLength: { value: 3, message: 'Phone number is too short' },
          })}
        />

        <Input
          label="Full Name"
          type="text"
          placeholder="Ada Lovelace"
          autoComplete="name"
          disabled={isSubmitting}
          error={errors.name?.message}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'Name must be at least 2 characters' },
          })}
        />

        <Button
          type="submit"
          className="w-full mt-2"
          size="md"
          isLoading={isSubmitting}
        >
          <span>Continue</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>

        <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Secure direct JWT session</span>
        </div>
      </form>
    </div>
  );
};
