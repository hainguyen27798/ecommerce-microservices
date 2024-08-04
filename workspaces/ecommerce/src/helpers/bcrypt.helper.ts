import * as bcrypt from 'bcrypt';

export class BcryptHelper {
    // hash password by bcrypt
    static async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 14);
    }

    // verify pass
    static async validatePassword(ownPassword: string, password: string): Promise<boolean> {
        return bcrypt.compare(ownPassword, password);
    }
}
