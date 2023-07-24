// Liên kết Client với API GRAPHP DATABASE
import { createUserMulation, getUserQuery } from "@/graphql";
import { GraphQLClient } from "graphql-request";

const isProduction = process.env.NODE_ENV === "production";
// Nếu là môi trường production thì apiUrl và apiKey sẽ được hiển thị công khai người dùng có nhìn và truy cập còn nếu là mt dev
// apiUrl và apiKey là đường dẫn chỉ duy nhất máy server nhìn thấy
const apiUrl = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_URL! : '' || 'http://127.0.0.1:4000/graphql';
const apiKey = isProduction ? process.env.NEXT_PUBLIC_GRAFBASE_API_KEY! : '' || 'letmein';
// Đây là url khi mà mình deplooy website
const serverUrl = isProduction ? process.env.NEXT_PUBLIC_SERVER_URL! : 'http://localhost:3000/';

const client = new GraphQLClient(apiUrl);

const makeGraphQLRequest = async (query: string, variables = {}) => {
    try {
        return await client.request(query, variables)
    } catch (error) {
       throw error; 
    }
}

// Hàm gọi truy vấn trả về người dùng
export const getUser = (email: string) => {
    // Việc gán api key vào header request như là 1 cách ủy quyền cho request đó lên sv
    client.setHeader('x-api-key', apiKey)
    return makeGraphQLRequest(getUserQuery, {email})
}

// Hàm điều chỉnh tạo người dùng mới
export const createUser = (name:string ,email: string, avatarUrl: string) => {
    client.setHeader('x-api-key', apiKey)
    const variables = {
        input: {
            name,
            email,
            avatarUrl,
        }
    }
   
    return makeGraphQLRequest(createUserMulation, variables)
}