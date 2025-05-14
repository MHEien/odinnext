'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import { useSearchParams } from 'next/navigation';

// Add interface to extend the Window type

interface Data {
  session: Session;
  sessionToken: string;
}

declare global {
  interface Window {
    flutter_inappwebview?: {
      callHandler: (handlerName: string, data?: Data) => void;
    };
  }
}

export default function ClientSessionPage() {
  const [sessionSent, setSessionSent] = useState(false);
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const sessionToken = searchParams.get('token');

  useEffect(() => {
    if (status === 'authenticated' && sessionToken && !sessionSent) {
      if (window.flutter_inappwebview) {
        const sessionData = {
          session: session,
          sessionToken: sessionToken,
        }
        window.flutter_inappwebview.callHandler('mobileSessionHandler', sessionData);
        setSessionSent(true);
      }
    }
  }, [status, sessionToken, sessionSent, session]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-9 h-9 border-4 border-gray-300 border-t-4 border-t-[#9c27b0] rounded-full animate-spin"></div>
    </div>
  );
}