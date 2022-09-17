// All environment related variables should be here, which are either set from docker on terraform
// perfect would be to use .env but I did not want to add any extra dependency constraint

process.env['API'] = 'https://api.veriff.internal';
process.env['AXIOS_RETRY_COUNT'] = '3';
