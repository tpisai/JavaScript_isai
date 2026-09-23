// Tests de la API sin base de datos: se reemplazan los métodos del modelo por dobles en memoria. 
const { test, beforeEach, after } = require('node:test'); 
const assert = require('node:assert/strict'); 
const request = require('supertest'); 
  
const User = require('../models/userModel'); 
const db = require('../db'); 
const app = require('../app'); 
  
let users; 
beforeEach(() => { 
  users = [{ id: 1, name: 'Ana', email: 'ana@mail.com' }]; 
  User.getAll = async () => users; 
  User.getById = async (id) => users.find((u) => u.id === id) || null; 
  User.create = async (data) => {
const id = users.length + 1; 
    users.push({ id, ...data }); 
    return id; 
  }; 
  User.update = async (id, data) => { 
    const u = users.find((x) => x.id === id); 
    if (u) Object.assign(u, data); 
    return Boolean(u); 
  }; 
  User.delete = async (id) => { 
    const before = users.length; 
    users = users.filter((u) => u.id !== id); 
    return users.length < before; 
  }; 
}); 
after(() => db.end()); 
  
test('GET /api/users lista usuarios', async () => { 
  const res = await request(app).get('/api/users').expect(200); 
  assert.equal(res.body.length, 1); 
}); 
  
test('GET /api/users/:id devuelve 404 si no existe', async () => { 
  await request(app).get('/api/users/99').expect(404); 
}); 
  
// TODO: escribe aquí tus propias pruebas (ver instrucciones) 