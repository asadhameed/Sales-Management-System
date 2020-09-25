require("dotenv").config()
// function dotEnvConfig(params) {
//     const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env'
//     dotenv.config({ path: envFile })   
// }
// module.exports.dotEnvConfig= dotEnvConfig;
module.exports = function () {
    if (!process.env.JWT_PRIVATE_KEY)
        throw new Error("FATAl Error: JwtPrivateKey is not define ")
    if (!process.env.DB_URL)
        throw new Error("FATAl Error: database uri  is not define ")
}