import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { registerTestUser } from '../../test/setup';

describe('GET /tickets/:id', () => {
  it('returns a 404 if ticket is not found', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    return request(app).get(`/api/tickets/${id}`)
      .send()
      .expect(404);
  });

  it('returns the ticket if it is found', async () => {
    const authCookie = registerTestUser();
    const res = await request(app).post('/api/tickets')
      .set('Cookie', authCookie)
      .send({
        title: 'new-ticket',
        price: 42,
      })
      .expect(201);

    const createdTicket = res.body;

    const ticketRes = await request(app).get(`/api/tickets/${createdTicket.id}`)
      .send()
      .expect(200);

    expect(ticketRes.body.title).toEqual('new-ticket');
    expect(ticketRes.body.price).toEqual(42);
  });
})