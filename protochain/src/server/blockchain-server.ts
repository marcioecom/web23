import express from "express";
import morgan from "morgan";
import Block from "src/lib/block";
import Blockchain from "src/lib/blockchain";

const PORT = 3000;

const app = express();

app.use(morgan("dev"));
app.use(express.json());

const blockchain = new Blockchain();

app.get("/status", (req, res) => {
  res.json({
    numberOfBlocks: blockchain.blocks.length,
    isValid: blockchain.isValid(),
    lasBlock: blockchain.getLastBlock(),
  });
});

app.get("/blocks/:indexOrHash", (req, res) => {
  const { indexOrHash } = req.params;

  const isNumeric = /^[0-9]+$/.test(indexOrHash);
  const block = isNumeric
    ? blockchain.blocks[Number(indexOrHash)]
    : blockchain.getBlock(indexOrHash);

  if (!block) {
    res.status(404).json({ error: "Block not found" });
    return;
  }

  res.json(block);
});

app.post("/blocks", (req, res) => {
  if (req.body.hash === undefined) {
    res.status(422).json({ error: "Missing hash" });
    return;
  }

  const block = new Block(req.body);
  const validation = blockchain.addBlock(block);
  if (validation.success) {
    res.status(201).json(block);
    return;
  }

  res.status(422).json(validation);
});

app.listen(PORT, () => console.log(`Blockchain server is running at ${PORT}`));
