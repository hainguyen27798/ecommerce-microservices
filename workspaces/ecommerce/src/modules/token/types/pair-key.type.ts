export type PairKey = {
    publicKey: string;
    privateKey: string;
};

export type PairSecretToken = {
    accessToken: string;
    refreshToken: string;
};

export type TToken = PairKey & {
    user: string;
    session: string;
    refreshToken: string;
};

export type PairSecretTokenType = PairSecretToken | null;
