import { Either, left, right } from "@/util/either";
import Block from "./block";

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[];
  nextIndex: number = 0;

  /**
   * Creates a new blockchain
   */
  constructor() {
    this.blocks = [new Block({ index: this.nextIndex, data: "Genesis Block" })];
    this.nextIndex++;
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }

  addBlock(block: Block): Either<Error, void> {
    const lastBlock = this.getLastBlock();

    const validation = block.isValid(lastBlock.hash, lastBlock.index);
    if (validation.isLeft())
      return left(new Error(`Invalid block: ${validation.value}`));

    this.blocks.push(block);
    this.nextIndex++;

    return right(undefined);
  }

  getBlock(hash: string): Block | null {
    const block = this.blocks.find((block) => block.hash === hash);
    return block ? block : null;
  }

  isValid(): Either<Error, true> {
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i];
      const previousBlock = this.blocks[i - 1];
      const validation = currentBlock.isValid(
        previousBlock.hash,
        previousBlock.index
      );
      if (validation.isLeft())
        return left(
          new Error(`Invalid block #${currentBlock.index}: ${validation.value}`)
        );
    }
    return right(true);
  }
}
