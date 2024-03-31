import { ComparisonEvent, EventBus, IEventBus } from './event-bus';

jest.mock('inversify', () => ({
  injectable: jest.fn()
}))

class MockEvent1 implements ComparisonEvent {
  static readonly type = 'mock-event-1';

  constructor(
    public data: number[],
  ) {}

  get type() {
    return MockEvent1.type;
  }
}

class MockEvent2 implements ComparisonEvent {
  static readonly type = 'mock-event-2';

  constructor(
    public data: string,
  ) {}

  get type() {
    return MockEvent2.type;
  }
}

describe('EventBus', () => {
  let bus: IEventBus;

  beforeEach(() => {
    bus = new EventBus();
  });

  it('should subscribe and emit events', () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();

    const unsub1 = bus.subscribe<MockEvent1>(MockEvent1.type, spy1);
    const unsub2 = bus.subscribe<MockEvent2>(MockEvent2.type, spy2);

    bus.emit(new MockEvent1([1, 2, 3]));

    expect(spy1).toHaveBeenLastCalledWith([1, 2, 3]);

    bus.emit(new MockEvent1([4, 5, 6]));

    expect(spy1).toHaveBeenLastCalledWith([4, 5, 6]);

    bus.emit(new MockEvent2('a'));

    expect(spy2).toHaveBeenLastCalledWith('a');

    bus.emit(new MockEvent1([7]));

    expect(spy1).toHaveBeenLastCalledWith([7]);

    bus.emit(new MockEvent2('b'));

    expect(spy2).toHaveBeenLastCalledWith('b');

    unsub1();

    bus.emit(new MockEvent1([8]));

    expect(spy1).not.toHaveBeenLastCalledWith([8]);
  });
});
