// var rs = require('readline-sync');
import express from 'express';
import { collectDefaultMetrics, register } from 'prom-client';

collectDefaultMetrics();

const app = express();

app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.listen(4001, '0.0.0.0');

console.log("GRAFANA NODE PROGRAM!");

// var num1 = parseInt(rs.question('1st Number: '));
// var num2 = parseInt(rs.question('2nd Number: '));
// var action = rs.question('Enter the action [+, -, *, /]');

// switch(action){
//     case '+':
//         console.log(num1 + num2)
//         break;
//     case '-':
//         console.log(num1 - num2)
//         break;
//     case '*':
//         console.log(num1 * num2)
//         break;
//     case '/':
//         console.log(num1 / num2)
//         break;
//     default:
//         console.log("Did not understand your input")
//         break;
// }


