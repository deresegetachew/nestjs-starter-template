import { SetMetadata } from '@nestjs/common';

enum keyType {
    global = 'global',
    objectKey = 'field'
}

type MsgVar = {
    key: string,
    type: keyType
}

interface ISuccessMsg {
    msg: string,
    variables: { [k: string]: keyType }
}


export function SuccessMsg(...obj: any) {
    return SetMetadata('successMsg', obj);
}