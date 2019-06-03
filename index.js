const express = require('express')
const childProcess = require('child_process');
const app = express()
const port = 3000

app.use(express.json());

app.post('/api', (req, res) => {
    if (req.query.secret !== process.env.RUBBER_ME_HOOK_SECRET) {
        return res.status(401).send('Mismatched signatures');
    }

    if (req.body.action !== 'published' || !req.body.release) {
        console.log("Skipped. Action not matched: " + req.body.action);
        return res.send(200);
    }

    childProcess.exec(process.env.RUBBER_ME_HOOK_API_DEPLOY_SCRIPT, function (err, stdout, stderr) {
        console.log(stdout);
        if (err) {
            console.error(err);
            return res.send(500);
        }
        return res.send(200);
    });
})

app.listen(port, () => console.log(`Github release hook is listening: ${port}!`))
