import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Index',
    })
});

app.post('/', async (req, res) => {
    try {
        const prompt =  req.body.prompt;

        const response = await openai.createCompletion({
            // Type of model from openai which has parameters for its consistency, correctness and cost efficiency in responses
            model: "text-davinci-003",
            // Take in user prompt
            prompt: `${prompt}`,
            // Measure of randomness in its responses. Higher temp means higher chance of being incorrect
            temperature: 0,
            // Max amount of characters in its response. Higher max_tokens means longer output from AI
            max_tokens: 3000,
            top_p: 1,
            // Likeliness of repeating responses
            frequency_penalty: 0.5,
            presence_penalty: 0,
            stop: ["\"\"\""]
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
    }
})

app.listen(5173, () => console.log('Server is running on port http://localhost:5173/'));