import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { registerTestUser } from '../../test/setup';

const createdTicket = (
  { title, price }:
    { title: string, price: number }) =>
  request(app).post('/api/tickets')
    .set('Cookie', registerTestUser())
    .send({ title, price })
    .expect(201);

describe('GET /tickets', () => {
  it('returns a list of tickets', async () => {
    await createdTicket({ title: 'sample ticket 1', price: 42 });
    await createdTicket({ title: 'sample ticket 2', price: 420 });
    await createdTicket({ title: 'sample ticket 3', price: 5 });

    const res = await request(app).get('/api/tickets')
      .send()
      .expect(200);

    expect(res.body.length).toEqual(3);
  });
})