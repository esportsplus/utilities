// @ts-ignore
BigInt.prototype.toJSON = function() {
    return this.toString();
};


const { parse, stringify } = JSON;


export { parse, stringify };