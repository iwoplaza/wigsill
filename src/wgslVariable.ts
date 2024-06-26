import { AnyWGSLDataType } from './std140/types';
import type { IResolutionCtx, WGSLItem, WGSLSegment } from './types';
import { code } from './wgslCode';
import { identifier } from './wgslIdentifier';

export type VariableScope = 'private';

/**
 * Creates a variable, with an optional initial value.
 */
export class WGSLVariable<TDataType extends AnyWGSLDataType>
  implements WGSLItem
{
  public identifier = identifier();

  constructor(
    private readonly _dataType: TDataType,
    private readonly _initialValue: WGSLSegment | undefined,
    public readonly scope: VariableScope,
  ) {}

  alias(debugLabel: string) {
    this.identifier.alias(debugLabel);
    return this;
  }

  resolve(ctx: IResolutionCtx): string {
    if (this._initialValue) {
      ctx.addDependency(
        code`var<${this.scope}> ${this.identifier}: ${this._dataType} = ${this._initialValue};`,
      );
    } else {
      ctx.addDependency(
        code`var<${this.scope}> ${this.identifier}: ${this._dataType};`,
      );
    }

    return ctx.resolve(this.identifier);
  }
}

export const variable = <TDataType extends AnyWGSLDataType>(
  dataType: TDataType,
  initialValue?: WGSLSegment,
) => new WGSLVariable(dataType, initialValue, 'private');
