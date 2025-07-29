require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const API_KEY = process.env.OPENEXCHANGE_API_KEY;
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

//all currencies endpoint
app.get('/getAllCurrecies', async (req, res) => {
    const nameURL = `https://openexchangerates.org/api/currencies.json?prettyprint=false&show_alternative=false&show_inactive=false&app_id=${API_KEY}`;
    try {
        const nameResponse = await axios.get(nameURL);
        const nameData = nameResponse.data;
        return res.json(nameData);
    }
    catch (error) {
        console.error('Error fetching currency names:', error);
    }
});

app.get('/convertCurrency',async (req, res) => {
    const{date, sourceCurrency, targetCurrency, amountInSourceCurrency} = req.query;
    try{
        const dataURL = `https://openexchangerates.org/api/historical/${date}.json?app_id=${API_KEY}`;
        const dataResponse = await axios.get(dataURL);
        const rates = dataResponse.data.rates;

        const sourceRate = rates[sourceCurrency];
        const targetRate = rates[targetCurrency];

        // Calculate the amount in target currency
        const targetAmount = (targetRate / sourceRate) * amountInSourceCurrency;

        return res.json(targetAmount.toFixed(2)); // Return the amount rounded to 2 decimal places
    }
    catch(error) {
        console.error('Error during currency conversion:', error);
    }
})
//listening port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});