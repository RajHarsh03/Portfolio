export const TOAST_AVATAR_URL = 'https://github.com/RajHarsh03.png?size=96';

export default function Toast({ toast, onDismiss }) {
  if (!toast) return null;
  return (
    <div className={`guestbook-toast is-${toast.tone}`} role="status" aria-live="polite">
      <img src={TOAST_AVATAR_URL} alt="Harsh Raj" loading="eager" fetchPriority="high" decoding="async" />
      <strong>{toast.title}</strong>
      <span>{toast.message}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss notification">×</button>
    </div>
  );
}
