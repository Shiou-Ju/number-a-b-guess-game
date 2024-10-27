import { Action, ActionProcessor } from "actionhero";

export class SumAction extends Action {
  constructor() {
    super();
    console.log(`sum action constructor initialized`);
    
    this.name = "sum";
    this.description = "return sum of a and b";
    this.outputExample = { sum: 3 };
    this.inputs = {
      a: {
        required: true,
      },
      b: {
        required: true,
      },
    };
  }

  async run({ params, response }: ActionProcessor<this>) {
    console.log(`SumAction: 開始處理請求，參數: a=${params.a}, b=${params.b}`);
    const a = Number(params.a);
    const b = Number(params.b);
    
    if (isNaN(a) || isNaN(b)) {
      throw new Error("Invalid input: a and b must be numbers");
    }

    const sum = a + b;
    response.sum = sum;
    console.log(`SumAction: 請求處理完成，結果: ${sum}`);
    return response;
  }
}

export default SumAction;
