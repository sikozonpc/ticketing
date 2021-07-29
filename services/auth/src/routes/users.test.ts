import request from 'supertest';
import { app } from '../app';
import { registerTestUser } from '../test/setup';

describe('user routes /api/users', () => {
  describe('POST /register', () => {
    it('should return a 201 on successful register', () => {
      return request(app).post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(201)
    })

    it('should return a 400 with an invalid email', () => {
      return request(app).post('/api/users/register')
        .send({
          email: 'invalid-email.com',
          password: 'password',
        })
        .expect(400)
    })

    it('should return a 400 with an invalid password', () => {
      return request(app).post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 's',
        })
        .expect(400)
    })

    it('should return a 400 with no password nor email', async () => {
      await request(app).post('/api/users/register')
        .send({})
        .expect(400)

      return request(app).post('/api/users/register')
        .send({ password: '', email: '' })
        .expect(400)
    })

    it('should disallows duplicate emails', async () => {
      await request(app).post('/api/users/register')
        .send({ password: 'password', email: 'test@test.com' })
        .expect(201)

      return request(app).post('/api/users/register')
        .send({ password: 'password', email: 'test@test.com' })
        .expect(400)
    })

    it('should set the cookie after successfull register', async () => {
      const response = await request(app).post('/api/users/register')
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(201)

      expect(response.get('Set-Cookie')).toBeDefined();
    })
  })

  describe('POST /login', () => {
    it('should return a 401 on invalid login', () => {
      return request(app).post('/api/users/login')
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(401)
    })

    it('should return a 200 on a valid login', async () => {
      const { sessionCookie } = await registerTestUser()

      const response = await request(app).post('/api/users/login')
        .set('Cookie', sessionCookie)
        .send({
          email: 'test@test.com',
          password: 'password',
        })
        .expect(200)

      expect(response.get('Set-Cookie')).toBeDefined();
    })
  })

  describe('POST /logout', () => {
    it('should clear the cookie after logging out', async () => {
      const { sessionCookie } = await registerTestUser()

      const logoutResponse = await request(app).post('/api/users/logout')
        .set('Cookie', sessionCookie)
        .send({})
        .expect(200)

      expect(logoutResponse.get('Set-Cookie')[0]).toBe("express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly");
    })
  })

  describe('GET /currentuser', () => {
    it('should get the details of the logged user', async () => {
      const { sessionCookie, user } = await registerTestUser()

      const response = await request(app).get('/api/users/currentuser')
        .set('Cookie', sessionCookie)
        .send({
          email: user.email,
          password: user.password,
        })
        .expect(200)

      const { currentUser } = response.body;
      expect(currentUser.email).toEqual(user.email);
      expect(currentUser.id).toBeDefined();
    })

    it('should return null if not autheticated', async () => {

      const response = await request(app).get('/api/users/currentuser')
        .send()
        .expect(200)

      expect(response.body.currentUser).toBeNull();
    })
  })
});
