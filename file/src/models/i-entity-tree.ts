import { IEntity } from './i-entity';

export interface IEntityTree {
  entity: IEntity;
  children?: IEntityTree[];
}
