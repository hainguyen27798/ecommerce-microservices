import crypto from 'crypto';

export const codeGeneratorHelper = () => crypto.randomBytes(48).toString('hex');
