import { createHash } from "node:crypto";
import Validation from "./validation";

/**
 * Block class
 */
export default class Block {
  index: number;
  timestamp: number;
  hash: string;
  previousHash: string;
  data: string;

  /**
   * Creates a new block
   * @param index The block index in blockchain
   * @param hash The block hash
   * @param previousHash The previous block hash
   * @param data The block data
   */
  constructor(index: number, previousHash: string, data: string) {
    this.index = index;
    this.timestamp = Date.now();
    this.previousHash = previousHash;
    this.data = data;
    this.hash = this.getHash();
  }

  getHash(): string {
    const content = this.index + this.data + this.timestamp + this.previousHash;
    return createHash("sha256").update(content).digest("hex");
  }

  /**
   * Validates the block
   * @returns True if the block is valid, false otherwise
   */
  isValid(previousHash: string, previousIndex: number): Validation {
    if (this.index < 0 || previousIndex != this.index - 1)
      return new Validation(false, "Invalid index");
    if (!this.hash || this.hash !== this.getHash())
      return new Validation(false, "Invalid hash");
    if (!this.data) return new Validation(false, "Invalid data");
    if (this.previousHash !== previousHash)
      return new Validation(false, "Invalid previous hash");
    if (this.timestamp < 1) return new Validation(false, "Invalid timestamp");
    return new Validation();
  }
}
