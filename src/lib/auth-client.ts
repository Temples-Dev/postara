import { useEffect, useState } from "react";

import { getMockUser, mockSignIn, mockSignOut, mockSignUp } from "./mock/auth";
import type { MockUser } from "./mock/types";

// Local auth client backed by the mock session store.
// Keeps the same call shapes the sign-in/up components already use so the
// NestJS backend can take over these entry points later without UI churn.
interface AuthHookContext {
  [key: string]: unknown;
}

interface AuthCallbacks {
  onRequest?: (ctx?: AuthHookContext) => void;
  onResponse?: (ctx?: AuthHookContext) => void;
  onSuccess?: () => void;
  onError?: (ctx: { error: { message: string } }) => void;
}

async function runWithCallbacks<T>(
  work: () => Promise<T>,
  callbacks?: AuthCallbacks,
): Promise<T> {
  callbacks?.onRequest?.();
  try {
    const result = await work();
    callbacks?.onSuccess?.();
    return result;
  } finally {
    callbacks?.onResponse?.();
  }
}

function failure(message: string, callbacks?: AuthCallbacks) {
  callbacks?.onError?.({ error: { message } });
  return { error: message };
}

export const signIn = {
  email: async (
    credentials: { email: string; password: string; callbackURL?: string },
    callbacks?: AuthCallbacks,
  ) => {
    return runWithCallbacks(async () => {
      const result = await mockSignIn(credentials.email, credentials.password);
      if ("error" in result) {
        return failure(result.error, callbacks);
      }
      return { data: result };
    }, callbacks);
  },
  social: async (
    _options: { provider: string; callbackURL?: string },
    callbacks?: AuthCallbacks,
  ) => {
    return runWithCallbacks(
      async () => failure("Social sign-in is not wired up yet", callbacks),
      callbacks,
    );
  },
};

export const signUp = {
  email: async (
    details: { email: string; password: string; name?: string; image?: string; callbackURL?: string },
    callbacks?: AuthCallbacks,
  ) => {
    return runWithCallbacks(async () => {
      const result = await mockSignUp(details.email, details.password);
      if ("error" in result) {
        return failure(result.error, callbacks);
      }
      return { data: result };
    }, callbacks);
  },
};

export const signOut = async () => {
  await mockSignOut();
};

export const authClient = { signIn, signUp, signOut };

export function useSession() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    let alive = true;
    getMockUser().then((current) => {
      if (alive) {
        setUser(current);
        setIsPending(false);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return { data: user ? { user } : null, isPending, error: null as null };
}
