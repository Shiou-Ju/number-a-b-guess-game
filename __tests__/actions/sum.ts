import { Process, specHelper } from "actionhero";

describe("Action: sum", () => {
  const actionhero = new Process();

  beforeAll(async () => await actionhero.start());
  afterAll(async () => await actionhero.stop());

  test("adds two numbers", async () => {
    const { sum, error } = await specHelper.runAction("sum", { a: 100, b: 23 });
    expect(error).toBeUndefined();
    expect(sum).toEqual(123);
  });

  test("requires both parameters", async () => {
    const { error } = await specHelper.runAction("sum", { a: 100 });
    expect(error).toBeDefined();
  });
});
