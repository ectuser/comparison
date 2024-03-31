import { injectable } from 'inversify';

type Listener<E extends ComparisonEvent> = (data: E['data']) => void;

export interface IEventBus {
  subscribe<E extends ComparisonEvent>(eventType: string, listener: Listener<E>): () => void;
  emit(event: ComparisonEvent): void;
}

export interface ComparisonEvent {
  data: unknown;
  type: string;
}

@injectable()
export class EventBus implements IEventBus {
  private observers: Record<string, {listener: Listener<ComparisonEvent>, id: string}[]> = {};

  subscribe<E extends ComparisonEvent>(
    eventType: string,
    listener: (data: E['data']) => void,
  ): () => void {
    const id = Math.random().toString(16).slice(2);

    const el = {id, listener};

    if (!this.observers[eventType]) {
      this.observers[eventType] = [el];
    } else {
      this.observers[eventType].push(el);
    }

    const unsubscribe = () => {
      const index = this.observers[eventType].findIndex((element) => element.id === id);
      this.observers[eventType].splice(index, 1);
    };

    return unsubscribe;
  }

  emit(event: ComparisonEvent): void {
    const subscribers = this.observers[event.type];

    if (!subscribers) {
      return;
    }

    subscribers.forEach((observer) => {
      observer.listener(event.data);
    });
  }

}

// eventBus.subscribe<IsinsChanged>(IsinsChanged.type, (data) => {});
