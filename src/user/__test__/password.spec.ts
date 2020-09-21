import { Test, TestingModule } from '@nestjs/testing';
import crypto from 'crypto';
import { PasswordCipher } from '../cipher/password';

describe('passwordCipher', () => {
    let cryptoRandomBytesSpy: jest.SpyInstance;

    let salt: string;
    const userSecret = "dummy123";
    let hashedPasswordAndSalt;
    let passwordCipher: PasswordCipher;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                PasswordCipher
            ]
        }).compile();
        passwordCipher = moduleRef.get<PasswordCipher>(PasswordCipher);
    });

    beforeEach((done) => {
        cryptoRandomBytesSpy = jest.spyOn(crypto, 'randomBytes');

        salt = crypto.randomBytes(8).toString("hex");
        cryptoRandomBytesSpy.mockReturnValue(salt);

        crypto.scrypt(userSecret, salt, 64, (err, derivedKey) => {
            hashedPasswordAndSalt = salt + ":" + derivedKey.toString('hex');
            done();
        });
    });

    afterEach(() => {
        cryptoRandomBytesSpy.mockRestore();
    })

    it('hash\'s user secret as expected', async () => {
        await expect(passwordCipher.hash(userSecret)).resolves.toBe(hashedPasswordAndSalt);
    });

    it('check password against hashedPassword work\'s as expected', async () => {
        await expect(passwordCipher.check(userSecret, hashedPasswordAndSalt)).resolves.toBe(true);
    });

});

//what are we testing 
//if hash works properly


jest.spyOn(crypto, 'randomBytes');