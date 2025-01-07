const CC = require('currency-converter-lt');

let currencyConverter = new CC();

let ratesCacheOptions = {
  isRatesCaching: true,
  ratesCacheDuration: 3600,
};

currencyConverter = currencyConverter.setupRatesCache(ratesCacheOptions);

const currencyRate = (fromCurrency, toCurrency) => {
  return currencyConverter
    .from(fromCurrency)
    .to(toCurrency)
    .amount(1)
    .convert()
    .then((response) => {
      const rate = response;
      return rate;
    })
    .catch((error) => {
      console.error(`Error fetching ${fromCurrency} to ${toCurrency} rate:`, error);
      return null;
    });
};

function formatIdr(amount) {
  if (isNaN(amount)) {
    return 'Invalid amount';
  }

  return amount.toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

module.exports = { currencyRate, formatIdr };
