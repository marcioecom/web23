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
   * @param block The block data
   */
  constructor(block?: Partial<Block>) {
    this.index = block?.index || 0;
    this.timestamp = block?.timestamp || Date.now();
    this.previousHash = block?.previousHash || "";
    this.data = block?.data || "";
    this.hash = block?.hash || this.getHash();
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
