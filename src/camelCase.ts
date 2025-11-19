const TO_WORDS_REGEX = /.+?(?:(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|$)/g;


const toWords = (identifier: string) => {
  return (identifier.match(TO_WORDS_REGEX) || [identifier]).join(' ');
};


export default { toWords };