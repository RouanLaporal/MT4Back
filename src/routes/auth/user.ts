import { CrudOperations, CrudRouter } from '../../classes/CrudRouter';
import { IUserCreate, IUserRO, IUserUpdate } from '../../types/tables/user/IUser';
import { UserCreateValidator, UserUpdateValidator } from '../../types/tables/user/user.validator';


export const ROUTES_USER = CrudRouter<IUserRO, IUserCreate, IUserUpdate>({
  table: 'user',
  primaryKey: 'userId',
  operations: CrudOperations.Index | CrudOperations.Create | CrudOperations.Read | CrudOperations.Update | CrudOperations.Delete,
  readColumns: ['userId', 'firstName', 'lastName', 'email', 'roleId'],
  validators: {
    create: UserCreateValidator,
    update: UserUpdateValidator
  }
});