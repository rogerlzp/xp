module api.data {

    export class ValueTypeDouble extends ValueType {

        constructor() {
            super("Double");
        }

        isValid(value: any): boolean {
            return api.util.NumberHelper.isNumber(value);
        }

        isConvertible(value: string): boolean {
            if (api.util.StringHelper.isBlank(value)) {
                return false;
            }
            let convertedValue = Number(value);
            return this.isValid(convertedValue);
        }

        newValue(value: string): Value {
            if (!value) {
                return this.newNullValue();
            }

            if (!this.isConvertible(value)) {
                return this.newNullValue();
            }
            return new Value(this.convertFromString(value), this);
        }

        fromJsonValue(jsonValue: number): Value {
            return new Value(jsonValue, this);
        }

        private convertFromString(value: string): number {
            return Number(value);
        }

        valueToString(value: Value): string {
            return (<Number>value.getObject()).toString();
        }

        valueEquals(a: number, b: number): boolean {
            return api.ObjectHelper.numberEquals(a, b) || (a == null && b == null);
        }
    }
}
