import { beforeAll, describe, expect, test } from "vitest";
import Block from "./block";

describe("Block tests", () => {
  let genesis: Block;

  beforeAll(() => {
    genesis = new Block({
      data: "Genesis Block",
    });
  });

  test("Should be valid", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "block 2",
    });
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.isRight()).toBeTruthy();
  });

  test("Should NOT be valid (fallbacks)", () => {
    const block = new Block({});
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.isLeft()).toBeTruthy();
  });

  test("Should NOT be valid (previous hash)", () => {
    const block = new Block();
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.isLeft()).toBeTruthy();
  });

  test("Should NOT be valid (timestamp)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "block 2",
    });
    block.timestamp = -1;
    block.hash = block.getHash();
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.isLeft()).toBeTruthy();
  });

  test("Should NOT be valid (hash)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "block 2",
    });
    block.hash = "";
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.isLeft()).toBeTruthy();
  });

  test("Should NOT be valid (data)", () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: "",
    });
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.isLeft()).toBeTruthy();
  });

  test("Should NOT be valid (index)", () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      data: "block 2",
    });
    const valid = block.isValid(genesis.hash, genesis.index);
    expect(valid.isLeft()).toBeTruthy();
  });
});
