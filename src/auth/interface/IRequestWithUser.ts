import { Request } from 'express';
import { User } from '../../user/user.entity';

interface IRequestWithUser extends Request {
    user: User;
}

export default IRequestWithUser;