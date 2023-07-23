// Thiết lập truy vấn người dùng thông qua email
export const getUserQuery = `
    query GetUser($email: String!) {
        user(by: {email: $email}) {
            id
            name
            email
            avatarUrl
            description
            githubUrl
            linkedinUrl
        }
    }
`

// Thiết lập điều chỉnh tạo người dùng mới trong server thông qua input
export const createUserMulation = `
   mulation CreateUser($input: UserCreateInput!){
    user {
        name
        email
        avatarUrl
        description
        githubUrl
        linkedinUrl
    } 
   }
`