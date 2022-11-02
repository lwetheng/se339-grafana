var express = require('express')
var prom = require('prom-client')

prom.collectDefaultMetrics();

const app = express();

app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', prom.register.contentType);
    res.end(await prom.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.listen(4001, '0.0.0.0');

console.log("GRAFANA NODE PROGRAM!");


const client = require('prom-client');
let register = new client.Registry();

const trafficCounter = new client.Counter({
  name: 'traffic_counter',
  help: 'Number of time route is called',
});

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  // buckets for response time from 0.1ms to 500ms
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
})

register.registerMetric(trafficCounter)

register.setDefaultLabels({
    app: 'test-api'
})

client.collectDefaultMetrics({ register });

app.get('/metrics', async (request, response) => {
    response.setHeader('Content-type', register.contentType);
    response.end(await register.metrics());
})

app.get('/traffic-test', (request, response) => { //path to count calls in /traffic-test route
    console.log("CALLING traffic-test")
    trafficCounter.inc() //increment traffic counter
    var currentTime = Date.now();

    httpRequestDurationMicroseconds //observe response time in ms
        .labels(request.route.path)
        .observe(currentTime)

    response.json({
        message: "You called traffic-test",
    });

})



