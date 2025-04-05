import knex from 'knex';

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: './ft.db'
    },
    useNullAsDefault: true,
});

export default db;

