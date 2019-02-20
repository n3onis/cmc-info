const rp = require('request-promise');

class cmc-api {

	constructor() {
		this.API_KEY = 'YOUR_API_KEY'; // https://pro.coinmarketcap.com/account
		this.API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency'; // sandbox: https://sandbox.coinmarketcap.com/v1/cryptocurrency

		this.CURRENCY = 'USD'; // https://pro.coinmarketcap.com/api/v1/#section/Standards-and-Conventions
		this.DEFAULT_TOP_NUMBER = 10; // up to 100 coins ~ 1 API token
		this.DEFAULT_OPTION = '';	// see options at the end of this file
		this.LOG_API_ERRORS = true; // log api errors in console
		this.LOG_API_RESPONSE = true; // log response data in console
	}

	requestTop(number=this.DEFAULT_TOP_NUMBER) {
		const requestOptions = {
			method: 'GET',
			uri: this.API_URL + '/listings/latest',
			qs: {
				start: 1,
				limit: number,
				convert: this.CURRENCY,
			},
			headers: {
				'X-CMC_PRO_API_KEY': this.API_KEY,
			},
			json: true,
			gzip: true,
		};

		rp(requestOptions)
			.then(response => {
				this.dumpData(response['data']);
		})
		.catch(err => {
			if(this.LOG_API_ERRORS) {
				console.error(err);
			}
		});
	}

	// don't use below function for a public group bot, it can eat up your API limit
	// ... or change the limit (5000 is max.) so it works only for top X number of coins.
	requestByCMCRank(rank=1) {
		const requestOptions = {
			method: 'GET',
			uri: this.API_URL + '/listings/latest',
			qs: {
				start: 1,
				limit: 5000,
				convert: this.CURRENCY,
			},
			headers: {
				'X-CMC_PRO_API_KEY': this.API_KEY,
			},
			json: true,
			gzip: true,
		};

		rp(requestOptions)
			.then(response => {
				this.dumpData(response['data'][rank-1]);
			})
			.catch(err => {
				if(this.LOG_API_ERRORS) {
					console.error(err);
				}
			});
	}

	requestCoin(symbol='BTC', option=this.DEFAULT_OPTION) {
		symbol = symbol.toUpperCase();
		option = option.toLowerCase();
		const requestOptions = {
			method: 'GET',
			uri: this.API_URL + '/quotes/latest?symbol=' + symbol + '&convert=' + this.CURRENCY,
			headers: {
				'X-CMC_PRO_API_KEY': this.API_KEY,
			},
			json: true,
			gzip: true,
		};

	  rp(requestOptions)
		.then(response => {
			if(option == '') {
				this.dumpData(response['data'][symbol]);
			} else if (option == 'id' || option == 'name' || option == 'symbol' || option == 'slug' || option == 'circulating_supply' || option == 'total_supply' || option == 'max_supply' || option == 'date_added' || option == 'num_market_pairs' || option == 'tags' || option == 'platform' || option == 'cmc_rank' || option == 'last_updated') {
				this.dumpData(response['data'][symbol][option]);
			} else if (option == 'quote') {
				this.dumpData(response['data'][symbol]['quote'][this.CURRENCY]);
			} else if (option == 'price' || option == 'volume_24h' || option == 'percent_change_1h' || option == 'percent_change_24h' || option == 'percent_change_7d' || option == 'market_cap') {
				this.dumpData(response['data'][symbol]['quote'][this.CURRENCY][option]);
			} else {
				console.log('No such option (' + option + ').');
			}
		})
		.catch(err => {
			if(this.LOG_API_ERRORS) {
				console.error(err);
			}
		});
	}

	dumpData(data) {
		// use your data here (format it, call your bot to send it to the server, etc.)
		
		if(this.LOG_API_RESPONSE) {
			console.log(data);
		}
	}
	
}

module.exports = cmc-api;

/* USE:
	For getting multiple values at the same time, use options *none* or 'quote',
	this way you only need 1 API call for all values.
	For getting single values, you can use my pre-made function options.
	See usage below.

requestCoin options:
  - *none*
		EXAMPLE: requestCoin('BTC')
			-> { 
			-> 		id: 1,
			-> 		name: 'Bitcoin',
			-> 		symbol: 'BTC',
			-> 		slug: 'bitcoin',
			-> 		circulating_supply: 17548650,
			-> 		total_supply: 17548650,
			-> 		max_supply: 21000000,
			-> 		date_added: '2013-04-28T00:00:00.000Z',
			-> 		num_market_pairs: 6643,
			-> 		tags: [ 'mineable' ],
			-> 		platform: null,
			-> 		cmc_rank: 1,
			-> 		last_updated: '2019-02-20T14:25:27.000Z',
			-> 		quote:
			-> 			{ USD:
			-> 				{ 	price: 3967.45596071,
			-> 					volume_24h: 8870574483.8468,
			-> 					percent_change_1h: -0.558352,
			-> 					percent_change_24h: -0.290679,
			-> 					percent_change_7d: 9.24773,
			-> 					market_cap: 69623496044.91354,
			-> 					last_updated: '2019-02-20T14:25:27.000Z'
			-> 				}
			-> 			} 
			-> }
		
  - quote
		EXAMPLE: requestCoin('BTC', 'quote')
			-> { 
			-> 		price: 3968.8811105,
			-> 		volume_24h: 8872096540.73199,
			-> 		percent_change_1h: -0.522632,
			-> 		percent_change_24h: -0.254862,
			-> 		percent_change_7d: 9.28697,
			-> 		market_cap: 69648505499.77582,
			-> 		last_updated: '2019-02-20T14:24:26.000Z'
			-> }
  - id
  - name
  - symbol
  - slug
  - circulating_supply
  - total_supply
  - max_supply
  - date_added
  - num_market_pairs
  - tags
  - platform
  - cmc_rank
  - last_updated
  - price
  - volume_24h
  - percent_change_1h
  - percent_change_24h
  - percent_change_7d
  - market_cap
  
  * EXAMPLE: requestCoin('BTC', 'total_supply')
		-> 17548650
		
*/