const { generatePassword, comparePassword}=require('../../../src/models/user/password-util')
describe('password-utils.generatePassword and password-utils.comparePassword',  ()=>{
    it('If the password will same then return true  ', async()=>{
         const password='abcd1234';
         const encryptPassword= await generatePassword(password);
         const result= await comparePassword(encryptPassword, password);
         expect(result).toBe(true);
    })

    it('If the password will different then return false  ', async()=>{
        const password='abcd1234';
        const differentPassword='abcd12'
        const encryptPassword= await generatePassword(password);
        const result= await comparePassword(encryptPassword, differentPassword);
        expect(result).toBe(false);
   })
})