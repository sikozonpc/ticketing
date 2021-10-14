import request from 'supertest';
import { app } from '../../app';
import { registerTestUser } from '../../test/setup';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

describe('POST /tickets', () => {
  it('has a route handler listening to /api/tickets for post requests', async () => {
    const res = await request(app).post('/api/tickets')
      .send();
    
    expect(res.status).not.toEqual(404);
  });

  it('can only be accessed if the user is singed in', async () => {
    return await request(app).post('/api/tickets')
      .send()
      .expect(401);
  });

  it('returns a status other than 401 if the user signed in', async () => {
    const authCookie = registerTestUser();
    const res = await request(app).post('/api/tickets')
      .set('Cookie', authCookie)
      .send();

    expect(res.status).not.toEqual(401);
  });

  it('returns an error if an invalid title is provided', async () => {
    const authCookie = registerTestUser();
    await request(app).post('/api/tickets')
      .set('Cookie', authCookie)
      .send({
        title: '', price: 10,
      })
      .expect(400);
  });

  it('returns an error if an invalid price is provided', async () => {
    const authCookie = registerTestUser();
    await request(app).post('/api/tickets')
      .set('Cookie', authCookie)
      .send({
        title: 'some-valid-title', price: -0,
      })
      .expect(400);
  });

  it('creates a ticket with valid inputs', async () => {
    const authCookie = registerTestUser();

    const tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app).post('/api/tickets')
      .set('Cookie', authCookie)
      .send({
        title: 'some-valid-title', price: 42,
      })
      .expect(201);
  
    const updatedTickets = await Ticket.find({});
    expect(updatedTickets.length).toEqual(1);
    expect(updatedTickets[0].price).toEqual(42);
    expect(updatedTickets[0].title).toEqual('some-valid-title');
  });

  it('publishes an event', async () => {
    const authCookie = registerTestUser();
    await request(app).post('/api/tickets')
      .set('Cookie', authCookie)
      .send({
        title: 'some-valid-title', price: 42,
      })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
  });
})