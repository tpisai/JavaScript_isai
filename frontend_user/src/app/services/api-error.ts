import { HttpErrorResponse } from '@angular/common/http';

const SIN_CONEXION = 'No se pudo conectar con la API. Verifica que esté corriendo en el puerto 3000.';

// Convierte cualquier error HTTP en un mensaje legible para el usuario.
// La API responde { error: '...' } o { errors: ['...', '...'] }.
export function apiErrorMessage(err: unknown): string {
  if (!(err instanceof HttpErrorResponse)) return 'Ocurrió un error inesperado.';

  // status 0: el navegador no llegó al servidor.
  // 502-504: el proxy de desarrollo (ng serve) no pudo contactar a la API.
  if (err.status === 0 || (err.status >= 502 && err.status <= 504)) return SIN_CONEXION;

  const body = typeof err.error === 'object' ? err.error : null;
  if (body?.errors?.length) return body.errors.join('. ');
  if (body?.error) return body.error;

  // Un 500 sin cuerpo JSON viene del proxy, no de nuestra API
  if (err.status >= 500) return SIN_CONEXION;

  return `Error ${err.status}: ${err.statusText}`;
}
