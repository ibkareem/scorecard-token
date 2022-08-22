const jwt = require("jsonwebtoken");

// const secret =
const requestError = JSON.stringify({
  Error: "Invalid Usage. Please check documentation",
});

async function handler(event) {
  event.body = JSON.parse(event.body);
  const action = typeof event.body.action === 'undefined' ? null : event.body.action;
  if (!action) return requestError;
  if (action.toLowerCase() === "sign") {
    const { payload, secretOrPrivateKey, expiresIn} = event.body;
    if (!payload || !secretOrPrivateKey) return requestError;
    if(expiresIn){
      const token = jwt.sign(payload, secretOrPrivateKey, {expiresIn: Number(expiresIn) * 1000});
       return JSON.stringify({
      message: `Success. Token Expires in ${Number(expiresIn)}secs`,
      body: token,
    });
    }
    const token = jwt.sign(payload, secretOrPrivateKey);
    return JSON.stringify({
      message: "Success",
      body: token,
    });
  }
  if (action.toLowerCase() === "verify") {
    const { token, secretOrPrivateKey } = event.body;
    if (!token || !secretOrPrivateKey) return requestError;
   try {
      const result = jwt.verify(token, secretOrPrivateKey);
       return JSON.stringify({
      message: "Success",
      body: result,
    });
   } catch (e) {
     return e
   }
   
  } else return requestError;
}

module.exports = { handler };
