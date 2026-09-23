// Estructura de un usuario tal como la devuelve la API
export interface User {
  id: number;
  name: string;
  email: string;
}

// Datos que se envían al crear o editar (el id lo asigna la base de datos)
export type UserInput = Omit<User, 'id'>;
