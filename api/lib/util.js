
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