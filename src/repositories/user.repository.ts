import db from "../db";
import config from 'config';
import User from "../models/user.model";
import DatabaseError from "../models/errors/database.error.model";

const authenticationCryptKey = config.get<string>('authentication.cryptKey');

class UserRepository {

    async create(user: User): Promise<string> {
        try {
            const script = `
                INSERT INTO application_user (
                    username, 
                    password
                ) 
                VALUES ($1, crypt($2, '${authenticationCryptKey}')) 
                RETURNING uuid
            `;

            const values = [user.username, user.password];
            const queryResult = await db.query<{ uuid: string }>(script, values);

            const [row] = queryResult.rows;
            return row.uuid;
        } catch (error) {
            throw new DatabaseError('Erro ao inserir usuário', error);
        }
    }

    async update(user: User): Promise<void> {
        try {
            const script = `
                UPDATE application_user
                SET
                    username = $2,
                    password = crypt($3, '${authenticationCryptKey}')
                WHERE uuid = $1            
            `;

            const values = [user.uuid, user.username, user.password];
            await db.query(script, values);
        } catch (error) {
            throw new DatabaseError('Erro ao atualizar usuário', error);
        }
    }

    async remove(uuid: string): Promise<void> {
        try {
            const script = `
                DELETE 
                FROM application_user 
                WHERE uuid = $1
            `;

            const values = [uuid];
            await db.query(script, values);
        } catch (error) {
            throw new DatabaseError('Erro ao deletar usuário', error);
        }
    }

    async findByUuid(uuid: string): Promise<User | null> {
        try {
            const query = `
                SELECT 
                    uuid, 
                    username
                FROM application_user
                WHERE uuid = $1
            `;
            const queryResult = await db.query<User>(query, [uuid]);
            const [row] = queryResult.rows;
            return !row ? null : row;
        } catch (error) {
            throw new DatabaseError('Erro ao buscar usuário por uuid', error);
        }
    }

    async findByUsernameAndPassword(username: string, password: string): Promise<User | null> {
        try {
            const query = `
                SELECT 
                    uuid, 
                    username
                FROM application_user
                WHERE username = $1
                AND password = crypt($2, '${authenticationCryptKey}')
            `;
            const queryResult = await db.query(query, [username, password]);
            const [row] = queryResult.rows;
            return !row ? null : row;
        } catch (error) {
            throw new DatabaseError('Erro ao buscar usuário por username e password', error);
        }
    }
}

export default new UserRepository();
