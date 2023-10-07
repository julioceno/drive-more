import { dto } from './dto';
export * from './dto';

import { commomMessages } from './common-messages';
export * from './common-messages';

export const messages = { ...dto, ...commomMessages };
