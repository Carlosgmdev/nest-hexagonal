import { randomUUID } from 'node:crypto';
import type IdGenerator from '../../application/ports/id-generator.port.js';

export default class UuidGenerator implements IdGenerator {
  generate(): string {
    return randomUUID();
  }
}
