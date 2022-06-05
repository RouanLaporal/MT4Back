import { CrudOperations, CrudRouter } from "../../classes/CrudRouter";
import { ISshCreate, ISshUpdate, ISshRO } from "../../types/tables/ssh/ISsh";
import { SshCreateValidator, SshUpdateValidator } from "../../types/tables/ssh/ssh.validator";

export const ROUTES_SSH = CrudRouter<ISshRO, ISshCreate, ISshUpdate>({
    table: 'ssh',
    primaryKey: 'sshId',
    operations: CrudOperations.Index | CrudOperations.Create | CrudOperations.Read | CrudOperations.Update | CrudOperations.Delete,
    readColumns: ['sshId', 'Username', 'IpAddress'],
    validators: {
        create: SshCreateValidator,
        update: SshUpdateValidator
    }
});