import { CalculatorOptions } from "../types";
import { getAddressTransactions } from "./getAddressTransactions";
import { fetchTransactions as mockFetchTransactions } from "./fetchTransactions";

/**
 * TODOS:
 * - make these tests pass
 * - sort desc and use block number for loading indicator
 */

const txnFixture1 = {
  blockNumber: "10000",
};
const txnFixture2 = {
  blockNumber: "20000",
};
const txnFixture3 = {
  blockNumber: "30000",
};

const generateTxnArray = (params: { length: number; fixture: any }) => {
  return new Array(params.length).fill(params.fixture);
};

jest.mock("./fetchTransactions");

const fetchTransactions = mockFetchTransactions as jest.Mock;

afterEach(() => {
  jest.resetAllMocks();
});

describe("getAddressTransactions", () => {
  const address = "0xTEST";
  const etherscanAPIKey = "TEST_KEY";

  test("fetches 1 transaction", async () => {
    const options: CalculatorOptions = {
      address,
      etherscanAPIKey,
    };
    const expected = generateTxnArray({ length: 1, fixture: txnFixture1 });
    fetchTransactions.mockImplementationOnce(async () => {
      return expected;
    });

    const { transactions, done } = await getAddressTransactions(options);
    expect(transactions).toStrictEqual(expected);
    expect(fetchTransactions).toHaveBeenCalledTimes(1);
    expect(done).toBe(true);
  });
  test("fetches 9999 transactions", async () => {
    const options: CalculatorOptions = {
      address,
      etherscanAPIKey,
    };
    const expected = generateTxnArray({ length: 9999, fixture: txnFixture1 });
    fetchTransactions.mockImplementationOnce(async () => {
      return expected;
    });

    const { transactions, done } = await getAddressTransactions(options);
    expect(transactions).toStrictEqual(expected);
    expect(fetchTransactions).toHaveBeenCalledTimes(1);
    expect(done).toBe(true);
  });
  test("fetches 10k transactions, filters lowest (oldest) block number", async () => {
    const options: CalculatorOptions = {
      address,
      etherscanAPIKey,
    };
    const newestBlockTxns = generateTxnArray({
      length: 5000,
      fixture: txnFixture2,
    });
    const oldestBlockTxns = generateTxnArray({
      length: 5000, // actually ethereum only has 70 txns per block but it doesnt matter for this fn
      fixture: txnFixture1,
    });
    const firstResult = [...newestBlockTxns, ...oldestBlockTxns];

    fetchTransactions.mockImplementationOnce(async () => {
      return firstResult;
    });

    const { transactions, done } = await getAddressTransactions(options);
    expect(transactions).toStrictEqual([...newestBlockTxns]);
    expect(fetchTransactions).toHaveBeenCalledTimes(1);
    expect(transactions.length).toBe(5000);
    expect(done).toBe(false);
  });
});
