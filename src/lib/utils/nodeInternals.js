// @ts-nocheck

const html = String.raw;

const mod = (n, m) => ((n % m) + m) % m;

const identify = (id, str) => {
  return str.replace(/(result|in|in2)='([^']*)'/g, (match, attr, value) => {
    if (/^__(.*?)__$/.test(value)) {
      // remove the leading and trailing double underscores
      return `${attr}='${value.slice(2, -2)}'`;
    } else if (
      value === 'SourceGraphic' ||
      value === 'SourceAlpha'
    ) {
      return `${attr}='${value}'`;
    }
    return `${attr}='${id}-${value}'`;
  });
};