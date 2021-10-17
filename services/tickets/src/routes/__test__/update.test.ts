import request from 'supertest';
import { app } from '../../app';
import { registerTestUser } from '../../test/setup';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

describe('PUT /tickets/:id', () => {
  it('returns a 404 if the provided id does not exist', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    const authCookie = registerTestUser();

    return request(app).put(`/api/tickets/${id}`)
      .set('Cookie', authCookie)
      .send({ title: 'adsda', price: 42 })
      .expect(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    const id = mongoose.Types.ObjectId().toHexString();
    return request(app).put(`/api/tickets/${id}`)
      .send()
      .expect(401);
  });
  it('returns 401 if the user does not own the ticket', async () => {
    const res = await request(app).post('/api/tickets')
      .set('Cookie', registerTestUser())
      .send({ title: 'adsda', price: 42 });

    return request(app).put(`/api/tickets/${res.body.id}`)
      .set('Cookie', registerTestUser())
      .send({ title: 'some-new-title', price: 22 })
      .expect(401);
  });
  it('returns 400 if the user provides an invalid payload', async () => {
    const authToken = registerTestUser();
    const res = await request(app).post('/api/tickets')
      .set('Cookie', authToken)
      .send({ title: 'adsda', price: 42 });

    await request(app).put(`/api/tickets/${res.body.id}`)
      .set('Cookie', authToken)
      .send({ title: '', price: 22 })
      .expect(400);

    await request(app).put(`/api/tickets/${res.body.id}`)
      .set('Cookie', authToken)
      .send({ title: 'some-new-title', price: -4 })
      .expect(400);
  });

  it('updates the ticket when provided valid inputs', async () => {
    const authToken = registerTestUser();
    const res = await request(app).post('/api/tickets')
      .set('Cookie', authToken)
      .send({ title: 'adsda', price: 42 });

    const { body: updatedTicket } = await request(app).put(`/api/tickets/${res.body.id}`)
      .set('Cookie', authToken)
      .send({ title: 'some valid title', price: 22 })
      .expect(200);

    expect(updatedTicket.title).toEqual('some valid title');
    expect(updatedTicket.price).toEqual(22);
  });

  it('rejects updates if the ticket is reserved', async () => {
    const authToken = registerTestUser();
    const res1 = await request(app).post('/api/tickets')
      .set('Cookie', authToken)
      .send({ title: 'adsda', price: 420 });

    const createdTicket = await Ticket.findById(res1.body.id);
    if (!createdTicket) {
      throw new Error('no ticket');
    }

    createdTicket.set({
      orderId: mongoose.Types.ObjectId().toHexString()
    });

    await createdTicket.save();

    await request(app).put(`/api/tickets/${res1.body.id}`)
      .set('Cookie', authToken)
      .send({ title: 'some valid title', price: 420 })
      .expect(400);
  })
});
