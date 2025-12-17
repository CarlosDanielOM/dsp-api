import ioredis from 'ioredis';

let dragonfly = null

export const connectToDragonflydb = async () => {
    dragonfly = new ioredis(process.env.DRAGONFLYDB_URI);

    return dragonfly;
}

export const getDragonfly = () => {
    return dragonfly;
}
