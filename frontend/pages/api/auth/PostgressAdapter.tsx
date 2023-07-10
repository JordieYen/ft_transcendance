import { Awaitable } from "next-auth";
import { Adapter, AdapterAccount, AdapterSession, AdapterUser } from "next-auth/adapters";
import { Pool } from "pg";


export const PostgresAdapter = (pool: Pool): Adapter<any> => {

    const createUser = async (profile: any): Promise<AdapterUser> => {
        const user = null;
        return profile;
    };

    const updateUser = async (user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> => {
        const client = await pool.connect();
        try {
            const updatedUser = await client.query(
                `UPDATE users SET name = $1, email = $2, image = $3 WHERE id = $4 RETURNING *`,
                [user.name, user.email, user.image, user.id]
            );
            if (updatedUser.rows.length) return updatedUser.rows[0];
        } finally {
            client.release();
        }
        return undefined as any;
    }

    const getSessionAndUser = async (sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser}> => {
        const client = await pool.connect();
        try {
            const session = await client.query(
                `SELECT * FROM sessions WHERE id = $1`,
                [sessionToken]
            );
            if (session.rows.length) {
                const sessionData = session.rows[0];
                const user = await client.query(
                    `SELECT * FROM users WHERE id = $1`,
                    [session.rows[0].user_id]
                );
                if (user.rows.length) return { session: session.rows[0], user: user.rows[0] };
            }
            return null as any;
        } finally {
            client.release();
        }
    };

    const createSession = async (session: { sessionToken: string; userId: string; expires: Date; }): Promise<AdapterSession> => {
        // Implementation code
        const client = await pool.connect();
        try {
            const newSession = await client.query(
                `INSERT INTO sessions (id, user_id, expires) VALUES ($1, $2, $3) RETURNING *`,
                [session.sessionToken, session.userId, session.expires]
            );
            if (newSession.rows.length) return newSession.rows[0];
        } finally {
            client.release();
        }
        return undefined as any;
    };
      

    const unlinkAccount = async (
        // userId: string,
        providerAccountId: Pick<AdapterAccount, "provider" | "providerAccountId">
    ): Promise<void> => {
        // Implementation code
    };

    return {
        getSessionAndUser,
        createUser,
        getUser: async () => null,
        getUserByEmail: async () => null,
        getUserByAccount: async () => null,
        updateUser,
        deleteUser: async () => {},
        linkAccount: async () => null,
        unlinkAccount,
        createSession,
        updateSession: async () => null,
        deleteSession: async () => {},
        useVerificationToken: async () => null,
    };

};
