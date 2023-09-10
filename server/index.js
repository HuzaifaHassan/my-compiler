const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.post("/compile", async (req, res) => {
  
    let code = req.body.code;
    let language = req.body.language;
    let input = req.body.input;

    let language_id;
    if (language === "python") {
        language_id = 71; 
    }
    

    let data = {
        language_id: language_id,
        source_code: Buffer.from(code).toString('base64'), 
        stdin: Buffer.from(input).toString('base64')       
    };

    let options = {
        method: 'POST',
        url: 'https://judge0-ce.p.rapidapi.com/submissions',
        params: {
            base64_encoded: 'true',
            fields: '*'
        },
        headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': '41307f8d6fmsh63364df190bad67p18d994jsnece0a2dd1534',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        },
        data: data
    };

	try {
		const response = await axios.request(options);
		let token = response.data.token;
	
		
		setTimeout(async () => {
			try {
				const result = await axios.request({
					method: 'GET',
					url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
					headers: {
						'X-RapidAPI-Key': '41307f8d6fmsh63364df190bad67p18d994jsnece0a2dd1534',
						'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
					}
				});
				
				
				console.log("Judge0 result:", result.data);
	
				if (result.data.stdout) {
					res.send({output: result.data.stdout});
				} else if (result.data.stderr) {
					res.send({error: result.data.stderr});
				} else {
					res.send({error: "Unknown error"});
				}
			} catch (error) {
				res.status(500).send({error: 'Failed to retrieve the result.'});
				console.error(error);
			}
		}, 5000); 
	} catch (error) {
		res.status(500).send({ error: 'Failed to compile the code.' });
		console.error(error);
	}
});


app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
