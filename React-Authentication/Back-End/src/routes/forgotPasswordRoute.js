import { v4 as uuid } from 'uuid';
import { sendEmail } from '../util/sendEmail.js';
import { getDbConnection } from '../db.js';

export const forgotPasswordRoute = {
    path: '/api/forgot-password/:email',
    method: 'put',
    handler: async (req, res) => {
        const { email } = req.params;

        const db = getDbConnection('react-auth-db');
        const passwordResetCode = uuid();

        const { result } = await db.collection('users')
            .updateOne({ email }, { $set: { passwordResetCode } });

        if (result && result.nModified > 0) {
            try {
                await sendEmail({
                    to: email,
                    from: 'upretynikesh123@gmail.com',
                    subject: 'Password Reset',
                    text: `
                        To reset your password, click this link:
                        http://localhost:3000/reset-password/${passwordResetCode}
                    `
                });
            } catch (e) {
                console.log(e);
                res.sendStatus(500);
            }
        }

        res.sendStatus(200);
    }
}