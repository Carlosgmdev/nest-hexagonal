import { Injectable, InternalServerErrorException } from "@nestjs/common";
import argon2 from "argon2";

@Injectable()
export default class HashingArgon2Service {
  async hash(value: string): Promise<string> {
    try {
      return await argon2.hash(value);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async compare(value: string, hash: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, value);
    } catch (error) {
      return false;
    }
  }

}