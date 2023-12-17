export abstract class UseCase {
  abstract execute(...args: unknown[]): Promise<unknown> | unknown | void;
}
