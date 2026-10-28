import { useEffect, useRef, useState } from 'react';
import { TOAST_AVATAR_URL } from '../components/ui/Toast.jsx';

const TOAST_DURATION_MS = 2500;

export function useToast() {
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const avatar = new Image();
    avatar.src = TOAST_AVATAR_URL;
    return () => window.clearTimeout(toastTimer.current);
  }, []);

  function showToast(title, message, tone = 'info') {
    setToast({ title, message, tone });
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }

  function dismissToast() {
    setToast(null);
  }

  return { toast, showToast, dismissToast };
}
