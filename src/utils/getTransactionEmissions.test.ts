import { getTransactionEmissions } from "./getTransactionEmissions";
import { EmissionsFactor, TransactionData } from "../types";

const emissionFactors: EmissionsFactor[] = [
  { timestamp: 165100000, emissionsFactor: 0.001 },
  { timestamp: 165200000, emissionsFactor: 0.002 },
];

describe("getTransactionEmissions", () => {
  test("returns transaction emissions", async () => {
    const transactions = [
      {
        timeStamp: "165100001",
        from: "0x063dd253c8da4ea9b12105781c9611b8297f5d14",
        to: "0x5abfec25f74cd88437631a7731906932776356f9",
        gasUsed: "100",
        hash: "duplicate",
      },
      {
        timeStamp: "165100002",
        from: "0x063dd253c8da4ea9b12105781c9611b8297f5d14",
        to: "0x5abfec25f74cd88437631a7731906932776356f9",
        gasUsed: "100",
        hash: "test2",
      },
    ] as TransactionData[];
    const result = getTransactionEmissions(transactions, emissionFactors);
    expect(result).toStrictEqual([0.4, 200]);
  });
  test("last txn is older than data", async () => {
    const transactions = [
      {
        timeStamp: "165100001",
        from: "0x063dd253c8da4ea9b12105781c9611b8297f5d14",
        to: "0x5abfec25f74cd88437631a7731906932776356f9",
        gasUsed: "100",
        hash: "duplicate",
      },
      {
        timeStamp: "165200001", // older than last txn in emissionFactors data
        from: "0x063dd253c8da4ea9b12105781c9611b8297f5d14",
        to: "0x5abfec25f74cd88437631a7731906932776356f9",
        gasUsed: "100",
        hash: "test2",
      },
    ] as TransactionData[];
    const result = getTransactionEmissions(transactions, emissionFactors);
    expect(result).toStrictEqual([0.4, 200]);
  });
});
