import crypto from "crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PasswordCipher {
    hash(userSecret: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(8).toString("hex");

            crypto.scrypt(userSecret, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                resolve(salt + ":" + derivedKey.toString('hex'))
            });
        });
    }


    check(password: string, hashedPasswordAndSalt: string): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            const [salt, hashedPassword] = hashedPasswordAndSalt.split(":");
            console.log("$$$", salt, hashedPassword);
            crypto.scrypt(password, salt, 64, (err, derivedKey) => {
                if (err) reject(err);
                resolve(hashedPassword == derivedKey.toString('hex'));
            })
        })
    }
}
