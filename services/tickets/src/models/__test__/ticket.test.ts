import { Ticket } from '../ticket';

describe('Ticket mode', () => {
  it('implements Optimistic concurrency control', async () => {
    const ticket = Ticket.build({ userId: '123', title: 'concert', price: 5 });

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();

    // save the second fetched ticket and expect an error
    try {
      await secondInstance!.save();
    } catch (err) {
      return;
    }

    throw new Error('should not reach this point, OCC might not be working');
  });

  it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({ userId: '123', title: 'concert', price: 5 });
    await ticket.save();

    expect(ticket.version).toEqual(0);

    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
  });
});