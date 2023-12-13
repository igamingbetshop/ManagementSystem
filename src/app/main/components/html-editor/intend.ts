import * as Quill from "quill";
const Parchment = Quill.import("parchment");
const pixelLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
const TAB_MULTIPLIER = 30

export interface AttributorOptions {
  scope?: any;
  whitelist?: string[];
}
export class IndentAttributor extends Parchment.Attributor.Style {
  constructor(attrName: string, keyName: string, options: AttributorOptions = {}) {
    super(attrName, keyName, options);
  }
  add(node, value) {
    return super.add(node, `${+value * TAB_MULTIPLIER}px`)
  }

  value(node) {
    return parseFloat(super.value(node)) / TAB_MULTIPLIER || undefined // Don't return NaN
  }
}

export const IndentStyle = new IndentAttributor("indent", "margin-left", {
  scope: Parchment.Scope.BLOCK,
  whitelist: pixelLevels.map(value => `${value * TAB_MULTIPLIER}px`),
});
