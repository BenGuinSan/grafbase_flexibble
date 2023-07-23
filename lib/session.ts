// Lưu trữ data của các tài khoảng đang login
import { getServerSession } from "next-auth/next";
import { NextAuthOptions,User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from 'jsonwebtoken';
import { JWT } from "next-auth/jwt";
import { SessionInterface } from "@/common.types";
import { getUser, createUser } from "./actions";
import { UserProfile } from "@/common.types";

// Cấu trúc liên quan đến provider
export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    jwt: {
        encode: ({ secret, token }) => {
            const encodedToken = jsonwebtoken.sign(
              {
                ...token,
                iss: "grafbase",
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
              },
              secret
            );
            
            return encodedToken;
          },
          decode: async ({ secret, token }) => {
            const decodedToken = jsonwebtoken.verify(token!, secret);
            return decodedToken as JWT;
          },
    },
    theme: {
        colorScheme: 'light',
        logo: '/logo.png',
    },
    callbacks: {
        async session({session}){
            const email = session?.user?.email as string
            try {
              const data = await getUser(email) as {user?: UserProfile};
            // Mở rộng session (session mặc định từ google chỉ có name, email và iamge nên tạo thêm những thuộc tính 
            // mới cho session dựa trên cấu trúc user cấu trúc từ UserProfile)   
              const newSession = { 
                ...session,
                user: {
                    ...session.user,
                    ...data?.user
                }
            }
                return newSession;
            } catch (error) {
             console.log('Error retrieving user data', error);
             return session;   
            }
        },
        async signIn({user}:{user: AdapterUser | User} ){
            try {

                // get the user if they exist
                const userExists = await getUser(user?.email as string) as {user?: UserProfile};

                // If they don't exist, create them
                if(!userExists.user) {
                    await createUser(
                        user.name as string, 
                        user.email as string, 
                        user.image as string
                    );
                }

                return true
            } catch (error: any) {
                console.log(error);
                return false;
            }
        },
    }
}

// Thông tin người dùng sẽ được lưu vào session
export async function getCurrentUser() {
   const session = await getServerSession(authOptions) as SessionInterface; 

   return session;
}