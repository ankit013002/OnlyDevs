// src/app/providers.tsx
"use client";

import { ReactNode } from "react";
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <KindeProvider
      clientId={process.env.NEXT_PUBLIC_KINDE_CLIENT_ID!}
      domain={process.env.NEXT_PUBLIC_KINDE_DOMAIN!}
      redirectUri={process.env.NEXT_PUBLIC_KINDE_REDIRECT_URI!}
    >
      {children}
    </KindeProvider>
  );
}
