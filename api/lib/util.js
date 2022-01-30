const SeedCustomers = [
  { email:MD5(Math.random())+'_test@website.com',fname:"Joe",lname:"User",gender:"M", lists:[1000,1004,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Bob",lname:"User",gender:"M", lists:[1003,1005,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Ken",lname:"User",gender:"M", lists:[1000,1004,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Kim",lname:"User",gender:"F", lists:[1006,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Jay",lname:"User",gender:"M", lists:[1000,1002,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Jon",lname:"User",gender:"M", lists:[1002,1004,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Abe",lname:"User",gender:"M", lists:[1003,1008,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Tim",lname:"User",gender:"M", lists:[1002,1004,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Tom",lname:"User",gender:"M", lists:[1001,1004,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Zoe",lname:"User",gender:"F", lists:[1000,1009,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Bil",lname:"User",gender:"M", lists:[1000,1002,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Jan",lname:"User",gender:"F", lists:[1000,1004] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Apr",lname:"User",gender:"F", lists:[1000,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Tin",lname:"User",gender:"F", lists:[1003,1004] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Sal",lname:"User",gender:"F", lists:[1005,1008,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Bra",lname:"User",gender:"M", lists:[1007,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Jak",lname:"User",gender:"M", lists:[1001,1004,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Sam",lname:"User",gender:"M", lists:[1000,1005,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Sea",lname:"User",gender:"M", lists:[1001,1003,1010] },
  { email:MD5(Math.random())+'_test@website.com',fname:"Gre",lname:"User",gender:"M", lists:[1000,1004,1010] },
]



function DoSeedCusts() {
  try {
    let seeds = [];
    SeedCustomers.forEach((cust)=>{
      let r = SubscribeCust(cust);
      if (!r.error) seeds.push(r.result);
    });
    return seeds;
  } catch (e) {
    return new JSException(e);
  }
  
}

function DoGetCust() {
  try {
    const params = reqparams();
    return GetCustomer(params.email);
  } catch (e) {
    return new JSException(e);
  }
}

function DoSubscribeCust() {
  try {
    const params = reqparams()
    return SubscribeCust(params);
  
  } catch (e) {
    return new JSException(e);
  }
}

// a function that returns an object of request params (get|post)
// For multi-choice params the object property will be an array
// ex:  "name=beau&choices[]=1&choices[]=2" becomes { name: 'beau', choices: [1,2] }
function reqparams() {
  let params = {}  
  ReqParamNames().sort().map(key=>{ params[key.replace('[]','')] = key.indexOf('[]')!=-1 ? ReqParam(key,'all'):ReqParam(key) })
  return params;
}


// a rather lightweight httpresponse class that supports html,json and plain-text responses, and some half-baked cookie stuff
//use at-your-own risk!
class HttpResponse {
  constructor(){
    this.headers = []
    this.httpstatus = 200
    this.params = reqparams()
  }
  header(value) {
    this.headers.push(value);
  }
  status(code) {
    this.httpstatus = code
  }
  cookie(name,value) { 
    if (arguments.length == 2) {
       this.header('Set-Cookie: ' + name + '=' + value + '; Path="/"; Domain=' + ReqEnv('SERVER_NAME')+ '; Secure; SameSite=None'); 
    } else if (arguments.length == 1) {
      return ReqCookie(name);
    }
  }
  redirect(path,code=301) {
    this.status(code);
    this.header('Status: ' + this.httpstatus);
    Emit( this.headers.join('\n') + '\n');
    Emit('Location: ' + path + '\n\n')
  }
  response(val,type='html') {
    Emit(this.headers.join('\n') + 'Status: ' + this.httpstatus + '\n');
    switch(type) {
      case 'json' : { Emit('Content-Type:application/json\n\n', JSONEncode(val)); break; }
      case 'plain': { Emit('Content-Type:text/plain\n\n', val ); break; }
      case 'html' : 
      default     : { Emit('Content-Type:text/html\n\n', val); break; }
    }
  }
  error(e,code=400) {
    this.status(code);
    this.response(e);
  }
}


class V8JsonApi extends HttpResponse {
  constructor(){
    super();
    this.route = null
  }
  routes(paths) {
    let endpoint = Request.PathArgs.shift();
    paths.filter((route) => {
      if (route.path !== endpoint) return;
      this.route = route;
    })
  }
  respond() {
    return !this.route ? this.error("unknown endpoint") : this.response(this.route.module())
  }
  response(val,type='json') {
    Emit(this.headers.join('\n') + 'Status: ' + this.httpstatus + '\n');
    Emit('Content-Type:application/json\n\n', JSONEncode(val)); 
  }
  error(e,code=400) {
    this.status(code);
    this.response({error:e});
  }
}



class JSException {
  constructor(msg,trace=true) {
    this.type = "Error"
    this.error = msg;
    if (trace) this.trace()
  }
  trace() {
    Trace(`!-> JSException::${this.type}  '${this.error}'`)
  }
  toString() {
    return this.error;
  }
}