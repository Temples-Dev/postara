import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql',
    }),
    
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false, // Set to true in production
        async sendResetPassword(data, request) {
            // TODO: Send an email to the user with a link to reset their password
            console.log('Password reset requested for:', data.user.email);
        },
        // sendVerificationEmail: async (data, request) => {
        //     // TODO: Send verification email
        //     console.log('Verification email for:', data.user.email);
        // }
    },
    
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
                   }
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day (session will be updated if it's older than this)
    },

    advanced: {
        cookiePrefix: 'postara',
        crossSubDomainCookies: {
            enabled: false
        }
    }
});