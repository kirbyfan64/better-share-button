!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ShareButton=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.array.iterator');
module.exports = _dereq_('../../modules/$.core').Array.values;
},{"../../modules/$.core":9,"../../modules/es6.array.iterator":37}],2:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.math.trunc');
module.exports = _dereq_('../../modules/$.core').Math.trunc;
},{"../../modules/$.core":9,"../../modules/es6.math.trunc":38}],3:[function(_dereq_,module,exports){
_dereq_('../../modules/es6.symbol');
_dereq_('../../modules/es6.object.to-string');
module.exports = _dereq_('../../modules/$.core').Symbol;
},{"../../modules/$.core":9,"../../modules/es6.object.to-string":39,"../../modules/es6.symbol":40}],4:[function(_dereq_,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],5:[function(_dereq_,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = _dereq_('./$.wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)_dereq_('./$.hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./$.hide":19,"./$.wks":36}],6:[function(_dereq_,module,exports){
var isObject = _dereq_('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":22}],7:[function(_dereq_,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = _dereq_('./$.cof')
  , TAG = _dereq_('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":8,"./$.wks":36}],8:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],9:[function(_dereq_,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],10:[function(_dereq_,module,exports){
// optional / simple context binding
var aFunction = _dereq_('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":4}],11:[function(_dereq_,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],12:[function(_dereq_,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !_dereq_('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":15}],13:[function(_dereq_,module,exports){
// all enumerable object keys, includes symbols
var $ = _dereq_('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":27}],14:[function(_dereq_,module,exports){
var global    = _dereq_('./$.global')
  , core      = _dereq_('./$.core')
  , hide      = _dereq_('./$.hide')
  , redefine  = _dereq_('./$.redefine')
  , ctx       = _dereq_('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)redefine(target, key, out);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":9,"./$.ctx":10,"./$.global":17,"./$.hide":19,"./$.redefine":31}],15:[function(_dereq_,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],16:[function(_dereq_,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = _dereq_('./$.to-iobject')
  , getNames  = _dereq_('./$').getNames
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":27,"./$.to-iobject":34}],17:[function(_dereq_,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],18:[function(_dereq_,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],19:[function(_dereq_,module,exports){
var $          = _dereq_('./$')
  , createDesc = _dereq_('./$.property-desc');
module.exports = _dereq_('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":27,"./$.descriptors":12,"./$.property-desc":30}],20:[function(_dereq_,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _dereq_('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":8}],21:[function(_dereq_,module,exports){
// 7.2.2 IsArray(argument)
var cof = _dereq_('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":8}],22:[function(_dereq_,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],23:[function(_dereq_,module,exports){
'use strict';
var $              = _dereq_('./$')
  , descriptor     = _dereq_('./$.property-desc')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
_dereq_('./$.hide')(IteratorPrototype, _dereq_('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":27,"./$.hide":19,"./$.property-desc":30,"./$.set-to-string-tag":32,"./$.wks":36}],24:[function(_dereq_,module,exports){
'use strict';
var LIBRARY        = _dereq_('./$.library')
  , $export        = _dereq_('./$.export')
  , redefine       = _dereq_('./$.redefine')
  , hide           = _dereq_('./$.hide')
  , has            = _dereq_('./$.has')
  , Iterators      = _dereq_('./$.iterators')
  , $iterCreate    = _dereq_('./$.iter-create')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , getProto       = _dereq_('./$').getProto
  , ITERATOR       = _dereq_('./$.wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./$":27,"./$.export":14,"./$.has":18,"./$.hide":19,"./$.iter-create":23,"./$.iterators":26,"./$.library":29,"./$.redefine":31,"./$.set-to-string-tag":32,"./$.wks":36}],25:[function(_dereq_,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],26:[function(_dereq_,module,exports){
module.exports = {};
},{}],27:[function(_dereq_,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],28:[function(_dereq_,module,exports){
var $         = _dereq_('./$')
  , toIObject = _dereq_('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":27,"./$.to-iobject":34}],29:[function(_dereq_,module,exports){
module.exports = false;
},{}],30:[function(_dereq_,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],31:[function(_dereq_,module,exports){
// add fake Function#toString
// for correct work wrapped methods / constructors with methods like LoDash isNative
var global    = _dereq_('./$.global')
  , hide      = _dereq_('./$.hide')
  , SRC       = _dereq_('./$.uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

_dereq_('./$.core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  if(typeof val == 'function'){
    val.hasOwnProperty(SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    val.hasOwnProperty('name') || hide(val, 'name', key);
  }
  if(O === global){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    hide(O, key, val);
  }
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./$.core":9,"./$.global":17,"./$.hide":19,"./$.uid":35}],32:[function(_dereq_,module,exports){
var def = _dereq_('./$').setDesc
  , has = _dereq_('./$.has')
  , TAG = _dereq_('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":27,"./$.has":18,"./$.wks":36}],33:[function(_dereq_,module,exports){
var global = _dereq_('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":17}],34:[function(_dereq_,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = _dereq_('./$.iobject')
  , defined = _dereq_('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":11,"./$.iobject":20}],35:[function(_dereq_,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],36:[function(_dereq_,module,exports){
var store  = _dereq_('./$.shared')('wks')
  , uid    = _dereq_('./$.uid')
  , Symbol = _dereq_('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":17,"./$.shared":33,"./$.uid":35}],37:[function(_dereq_,module,exports){
'use strict';
var addToUnscopables = _dereq_('./$.add-to-unscopables')
  , step             = _dereq_('./$.iter-step')
  , Iterators        = _dereq_('./$.iterators')
  , toIObject        = _dereq_('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = _dereq_('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":5,"./$.iter-define":24,"./$.iter-step":25,"./$.iterators":26,"./$.to-iobject":34}],38:[function(_dereq_,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = _dereq_('./$.export');

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./$.export":14}],39:[function(_dereq_,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = _dereq_('./$.classof')
  , test    = {};
test[_dereq_('./$.wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  _dereq_('./$.redefine')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./$.classof":7,"./$.redefine":31,"./$.wks":36}],40:[function(_dereq_,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = _dereq_('./$')
  , global         = _dereq_('./$.global')
  , has            = _dereq_('./$.has')
  , DESCRIPTORS    = _dereq_('./$.descriptors')
  , $export        = _dereq_('./$.export')
  , redefine       = _dereq_('./$.redefine')
  , $fails         = _dereq_('./$.fails')
  , shared         = _dereq_('./$.shared')
  , setToStringTag = _dereq_('./$.set-to-string-tag')
  , uid            = _dereq_('./$.uid')
  , wks            = _dereq_('./$.wks')
  , keyOf          = _dereq_('./$.keyof')
  , $names         = _dereq_('./$.get-names')
  , enumKeys       = _dereq_('./$.enum-keys')
  , isArray        = _dereq_('./$.is-array')
  , anObject       = _dereq_('./$.an-object')
  , toIObject      = _dereq_('./$.to-iobject')
  , createDesc     = _dereq_('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !_dereq_('./$.library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$export($export.G + $export.W, {Symbol: $Symbol});

$export($export.S, 'Symbol', symbolStatics);

$export($export.S + $export.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./$":27,"./$.an-object":6,"./$.descriptors":12,"./$.enum-keys":13,"./$.export":14,"./$.fails":15,"./$.get-names":16,"./$.global":17,"./$.has":18,"./$.is-array":21,"./$.keyof":28,"./$.library":29,"./$.property-desc":30,"./$.redefine":31,"./$.set-to-string-tag":32,"./$.shared":33,"./$.to-iobject":34,"./$.uid":35,"./$.wks":36}],41:[function(_dereq_,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _shareUtils = _dereq_('./share-utils');

var _shareUtils2 = _interopRequireDefault(_shareUtils);

var _stringUtils = _dereq_('./string-utils');

var _stringUtils2 = _interopRequireDefault(_stringUtils);

/**
 * Sharebutton
 * @class
 * @classdesc
 * @extends ShareUtils

 * @param {String} element
 * @param {Object} options
 */
_dereq_('core-js/fn/symbol');
_dereq_('core-js/fn/array/iterator');
_dereq_('core-js/fn/math/trunc');

var ShareButton = (function (_ShareUtils) {
  _inherits(ShareButton, _ShareUtils);

  function ShareButton(element, options) {
    _classCallCheck(this, ShareButton);

    _get(Object.getPrototypeOf(ShareButton.prototype), 'constructor', this).call(this);

    if (typeof element === 'object') {
      this.element = undefined;
      options = element;
    } else this.element = element;

    this.el = {
      head: document.getElementsByTagName('head')[0],
      body: document.getElementsByTagName('body')[0]
    };

    this.config = {
      enabledNetworks: 0,
      protocol: '//',
      url: window.location.href,
      caption: null,
      title: this._defaultTitle(),
      image: this._defaultImage(),
      description: this._defaultDescription(),
      root: document,

      ui: {
        flyout: 'sb-top sb-center',
        buttonText: 'Share',
        namespace: 'sb-',
        networkOrder: [],
        collision: false
      },

      networks: {
        googlePlus: {
          enabled: true,
          url: null
        },
        twitter: {
          enabled: true,
          url: null,
          description: null
        },
        facebook: {
          enabled: true,
          loadSdk: true,
          url: null,
          appId: null,
          title: null,
          caption: null,
          description: null,
          image: null
        },
        pinterest: {
          enabled: true,
          url: null,
          image: null,
          description: null
        },
        reddit: {
          enabled: true,
          url: null,
          title: null
        },
        linkedin: {
          enabled: true,
          url: null,
          title: null,
          description: null
        },
        whatsapp: {
          enabled: true,
          description: null,
          url: null
        },
        email: {
          enabled: true,
          title: null,
          description: null
        }
      }
    };

    this.listener = null;
    this._setup(this.element, options);
  }

  /**
   * @method open
   * @description Opens Share Button
   */

  _createClass(ShareButton, [{
    key: 'open',
    value: function open() {
      this._public('Open');
    }

    /**
     * @method close
     * @description Cpens Share Button
     */
  }, {
    key: 'close',
    value: function close() {
      this._public('Close');
    }

    /**
     * @method toggle
     * @description Toggles Share Button
     */
  }, {
    key: 'toggle',
    value: function toggle() {
      this._public('Toggle');
    }

    /**
     * @method toggleListen
     * @description Toggles the Share Button listener, good for updaing share
     * button for CSS animations.
     */
  }, {
    key: 'toggleListen',
    value: function toggleListen() {
      this._public('Listen');
    }

    /**
     * @method _public
     * @description Executes action
     * @private
     *
     * @param {String} action
     */
  }, {
    key: '_public',
    value: function _public(action) {
      var instances = undefined;

      if (typeof element === 'undefined') instances = _get(Object.getPrototypeOf(ShareButton.prototype), '_objToArray', this).call(this, this.config.root.getElementsByTagName('share-button'));else instances = document.querySelectorAll(element);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = instances[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var instance = _step.value;

          var networks = instance.getElementsByClassName(this.config.ui.namespace + 'social')[0];
          this['_event' + action](instance, networks);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * @method _setup
     * @description Sets up Share Button
     * @private
     *
     * @param {String} element selector
     * @param {Object} opts
     */
  }, {
    key: '_setup',
    value: function _setup(element, opts) {
      var instances = undefined;

      if (typeof element === 'undefined') instances = _get(Object.getPrototypeOf(ShareButton.prototype), '_objToArray', this).call(this, this.config.root.getElementsByTagName('share-button'));else {
        instances = this.config.root.querySelectorAll('share-button' + element);
        if (typeof instances === 'object') instances = _get(Object.getPrototypeOf(ShareButton.prototype), '_objToArray', this).call(this, instances);
      }

      // Adding user configs to default configs
      this._merge(this.config, opts);

      // Disable whatsapp display if not a mobile device
      if (this.config.networks.whatsapp.enabled && !this._isMobile()) this.config.networks.whatsapp.enabled = false;

      // Default order of networks if no network order entered
      if (this.config.ui.networkOrder.length === 0) this.config.ui.networkOrder = ['pinterest', 'twitter', 'facebook', 'whatsapp', 'googlePlus', 'reddit', 'linkedin', 'email'];

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = Object.keys(this.config.networks)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var network = _step2.value;

          if (this.config.ui.networkOrder.indexOf(network.toString()) < 0) {
            this.config.networks[network].enabled = false;
            this.config.ui.networkOrder.push(network);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this._fixFlyout();
      this._detectNetworks();
      this._normalizeNetworkConfiguration();

      // Inject Facebook JS SDK (if Facebook is enabled)
      if (this.config.networks.facebook.enabled && this.config.networks.facebook.loadSdk) this._injectFacebookSdk();

      // Initialize instances
      var index = 0;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = instances[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var instance = _step3.value;

          this._setupInstance(instance, index++);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }

    /**
     * @method _setupInstance
     * @description Sets up each instance with config and styles
     * @private
     *
     * @param {DOMNode} instance
     * @param {Integer} index
     */
  }, {
    key: '_setupInstance',
    value: function _setupInstance(instance, index) {
      var _this = this;

      this._hide(instance);

      // Add necessary classes to instance
      // (Note: FF doesn't support adding multiple classes in a single call)
      this._addClass(instance, 'sharer-' + index);
      this._injectHtml(instance);
      this._show(instance);

      var networksCon = instance.getElementsByClassName(this.config.ui.namespace + 'social')[0];
      var networks = instance.getElementsByTagName('li');

      this._addClass(networksCon, 'networks-' + this.config.enabledNetworks);
      instance.addEventListener('click', function () {
        return _this._eventToggle(instance, networksCon);
      });

      // Add listener to activate networks and close button

      var _loop = function (k) {
        var network = networks[k];

        if (typeof network !== "undefined") {
          (function () {
            var name = network.getAttribute('data-network');
            var a = network.getElementsByTagName('a')[0];

            _this._addClass(network, _this.config.networks[name]['class']);

            if (network.className.indexOf('email') < 0) a.setAttribute('onclick', 'return false');

            a.addEventListener('mousedown', function () {
              _this._hook('before', name, instance);
            });
            a.addEventListener('mouseup', function () {
              _this['_network' + _stringUtils2['default'].capFLetter(name)](network);
            });
            a.addEventListener('click', function () {
              _this._hook('after', name, instance);
            });
          })();
        }
      };

      for (var k in Object.keys(networks)) {
        _loop(k);
      }
    }

    /**
     * @method _eventToggle
     * @description Toggles 'active' class on button
     * @private
     *
     * @param {DOMNode} button
     * @param {DOMNode} networks
     */
  }, {
    key: '_eventToggle',
    value: function _eventToggle(button, networks) {
      if (this._hasClass(networks, 'active')) this._eventClose(networks);else this._eventOpen(button, networks);
    }

    /**
     * @method _eventOpen
     * @description Add 'active' class & remove 'load' class on button
     * @private
     *
     * @param {DOMNode} button
     * @param {DOMNode} networks
     */
  }, {
    key: '_eventOpen',
    value: function _eventOpen(button, networks) {
      if (this._hasClass(networks, 'load')) this._removeClass(networks, 'load');
      if (this.collision) this._collisionDetection(button, networks);

      this._addClass(networks, 'active');
    }

    /**
     * @method _eventClose
     * @description Remove 'active' class on button
     * @private
     *
     * @param {DOMNode} button
     */
  }, {
    key: '_eventClose',
    value: function _eventClose(button) {
      this._removeClass(button, 'active');
    }

    /**
     * @method _eventListen
     * @description Toggles weather or not a button's classes are being
     * constantly updated regardless of scrolls or window resizes.
     * @private
     *
     * @param {DOMNode} button
     * @param {DOMNode} networks
     */
  }, {
    key: '_eventListen',
    value: function _eventListen(button, networks) {
      var _this2 = this;

      var dimensions = this._getDimensions(button, networks);
      if (this.listener === null) this.listener = window.setInterval(function () {
        return _this2._adjustClasses(button, networks, dimensions);
      }, 100);else {
        window.clearInterval(this.listener);
        this.listener = null;
      }
    }

    /**
     * @method _fixFlyout
     * @description Fixes the flyout entered by the user to match their provided
     * namespace
     *@private
     */
  }, {
    key: '_fixFlyout',
    value: function _fixFlyout() {
      var flyouts = this.config.ui.flyout.split(' ');
      if (flyouts[0].substring(0, this.config.ui.namespace.length) !== this.config.ui.namespace) flyouts[0] = '' + this.config.ui.namespace + flyouts[0];
      if (flyouts[1].substring(0, this.config.ui.namespace.length) !== this.config.ui.namespace) flyouts[1] = '' + this.config.ui.namespace + flyouts[1];
      this.config.ui.flyout = flyouts.join(' ');
    }

    /**
     * @method _collisionDetection
     * @description Adds listeners the first time a button is clicked to call
     * this._adjustClasses during scrolls and resizes.
     * @private
     *
     * @param {DOMNode} button - share button
     * @param {DOMNode} networks - list of social networks
     */
  }, {
    key: '_collisionDetection',
    value: function _collisionDetection(button, networks) {
      var _this3 = this;

      var dimensions = this._getDimensions(button, networks);
      this._adjustClasses(button, networks, dimensions);

      if (!button.classList.contains('clicked')) {
        window.addEventListener('scroll', function () {
          return _this3._adjustClasses(button, dimensions);
        });
        window.addEventListener('resize', function () {
          return _this3._adjustClasses(button, dimensions);
        });
        button.classList.add('clicked');
      }
    }

    /**
     * @method _getDimensions
     * @description Returns an object with the dimensions of the button and
     * label elements of a Share Button.
     * @private
     *
     * @param {DOMNode} button
     * @param {DOMNode} networks
     * @returns {Object}
     */
  }, {
    key: '_getDimensions',
    value: function _getDimensions(button, networks) {
      return {
        networksWidth: networks.offsetWidth,
        buttonHeight: button.offsetHeight,
        buttonWidth: button.offsetWidth
      };
    }

    /**
     * @method _adjustClasses
     * @description Adjusts the positioning of the list of social networks based
     * off of where the share button is relative to the window.
     *
     * @private
     * @param {DOMNode} button
     * @param {DOMNode} networks
     * @param {Object} dimensions
     */
  }, {
    key: '_adjustClasses',
    value: function _adjustClasses(button, networks, dimensions) {
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var leftOffset = button.getBoundingClientRect().left + dimensions.buttonWidth / 2;
      var rightOffset = windowWidth - leftOffset;
      var topOffset = button.getBoundingClientRect().top + dimensions.buttonHeight / 2;
      var position = this._findLocation(leftOffset, topOffset, windowWidth, windowHeight);

      if (position[1] === "middle" && position[0] !== "center" && (position[0] === "left" && windowWidth <= leftOffset + 220 + dimensions.buttonWidth / 2 || position[0] === "right" && windowWidth <= rightOffset + 220 + dimensions.buttonWidth / 2)) {
        networks.classList.add(this.config.ui.namespace + 'top');
        networks.classList.remove(this.config.ui.namespace + 'middle');
        networks.classList.remove(this.config.ui.namespace + 'bottom');
      } else {
        switch (position[0]) {
          case "left":
            networks.classList.add(this.config.ui.namespace + 'right');
            networks.classList.remove(this.config.ui.namespace + 'center');
            networks.classList.remove(this.config.ui.namespace + 'left');
            break;
          case "center":
            if (position[1] !== "top") networks.classList.add(this.config.ui.namespace + 'top');
            networks.classList.add(this.config.ui.namespace + 'center');
            networks.classList.remove(this.config.ui.namespace + 'left');
            networks.classList.remove(this.config.ui.namespace + 'right');
            networks.classList.remove(this.config.ui.namespace + 'middle');
            break;
          case "right":
            networks.classList.add(this.config.ui.namespace + 'left');
            networks.classList.remove(this.config.ui.namespace + 'center');
            networks.classList.remove(this.config.ui.namespace + 'right');
            break;
        }
        switch (position[1]) {
          case "top":
            networks.classList.add(this.config.ui.namespace + 'bottom');
            networks.classList.remove(this.config.ui.namespace + 'middle');
            if (position[0] !== "center") networks.classList.remove(this.config.ui.namespace + 'top');
            break;
          case "middle":
            if (position[0] !== "center") {
              networks.classList.add(this.config.ui.namespace + 'middle');
              networks.classList.remove(this.config.ui.namespace + 'top');
            }
            networks.classList.remove(this.config.ui.namespace + 'bottom');
            break;
          case "bottom":
            networks.classList.add(this.config.ui.namespace + 'top');
            networks.classList.remove(this.config.ui.namespace + 'middle');
            networks.classList.remove(this.config.ui.namespace + 'bottom');
            break;
        }
      }
    }

    /**
     * @method _findLocation
     * @description Finds the location of the label given by its x and y value
     * with respect to the window width and window height given.
     * @private
     *
     * @param {number} labelX
     * @param {number} labelY
     * @param {number} windowWidth
     * @param {number} windowHeight
     * @returns {Array}
     */
  }, {
    key: '_findLocation',
    value: function _findLocation(labelX, labelY, windowWidth, windowHeight) {
      var xPosition = ["left", "center", "right"];
      var yPosition = ["top", "middle", "bottom"];
      var xLocation = Math.trunc(3 * (1 - (windowWidth - labelX) / windowWidth));
      var yLocation = Math.trunc(3 * (1 - (windowHeight - labelY) / windowHeight));
      if (xLocation >= 3) xLocation = 2;else if (xLocation <= -1) xLocation = 0;
      if (yLocation >= 3) yLocation = 2;else if (yLocation <= -1) yLocation = 0;
      return [xPosition[xLocation], yPosition[yLocation]];
    }

    /**
     * @method _networkFacebook
     * @description Create & display a Facebook window
     * @private
     */
  }, {
    key: '_networkFacebook',
    value: function _networkFacebook(element) {
      if (this.config.networks.facebook.loadSdk) {
        if (!window.FB) {
          console.error('The Facebook JS SDK hasn\'t loaded yet.');
          return this._updateHref(element, 'https://www.facebook.com/sharer/sharer.php', {
            u: this.config.networks.facebook.url
          });
        }
        return FB.ui({
          method: 'feed',
          name: this.config.networks.facebook.title,
          link: this.config.networks.facebook.url,
          picture: this.config.networks.facebook.image,
          caption: this.config.networks.facebook.caption,
          description: this.config.networks.facebook.description
        });
      } else {
        return this._updateHref(element, 'https://www.facebook.com/sharer/sharer.php', {
          u: this.config.networks.facebook.url
        });
      }
    }

    /**
     * @method _networkTwitter
     * @description Create & display a Twitter window
     * @private
     */
  }, {
    key: '_networkTwitter',
    value: function _networkTwitter(element) {
      this._updateHref(element, 'https://twitter.com/intent/tweet', {
        text: this.config.networks.twitter.description,
        url: this.config.networks.twitter.url
      });
    }

    /**
     * @method _networkGooglePlus
     * @description Create & display a Google Plus window
     * @private
     */
  }, {
    key: '_networkGooglePlus',
    value: function _networkGooglePlus(element) {
      this._updateHref(element, 'https://plus.google.com/share', {
        url: this.config.networks.googlePlus.url
      });
    }

    /**
     * @method _networkPinterest
     * @description Create & display a Pinterest window
     * @private
     */
  }, {
    key: '_networkPinterest',
    value: function _networkPinterest(element) {
      this._updateHref(element, 'https://www.pinterest.com/pin/create/button', {
        url: this.config.networks.pinterest.url,
        media: this.config.networks.pinterest.image,
        description: this.config.networks.pinterest.description
      });
    }

    /**
     * @method _networkLinkedIn
     * @description Create & display a Linkedin window
     * @private
     */
  }, {
    key: '_networkLinkedin',
    value: function _networkLinkedin(element) {
      this._updateHref(element, 'https://www.linkedin.com/shareArticle', {
        mini: 'true',
        url: this.config.networks.linkedin.url,
        title: this.config.networks.linkedin.title,
        summary: this.config.networks.linkedin.description
      });
    }

    /**
     * @method _networkEmail
     * @description Create & display an Email window
     * @private
     */
  }, {
    key: '_networkEmail',
    value: function _networkEmail(element) {
      this._updateHref(element, 'mailto:', {
        subject: this.config.networks.email.title,
        body: this.config.networks.email.description
      });
    }

    /**
     * @method _networkReddit
     * @description Create & display a Reddit window
     * @private
     */
  }, {
    key: '_networkReddit',
    value: function _networkReddit(element) {
      this._updateHref(element, 'http://www.reddit.com/submit', {
        url: this.config.networks.reddit.url,
        title: this.config.networks.reddit.title
      });
    }

    /**
     * @method _networkWhatsapp
     * @description Create & display a Whatsapp window
     * @private
     */
  }, {
    key: '_networkWhatsapp',
    value: function _networkWhatsapp(element) {
      this._updateHref(element, 'whatsapp://send', {
        text: this.config.networks.whatsapp.description + " " + this.config.networks.whatsapp.url
      });
    }

    /**
     * @method _injectStylesheet
     * @description Inject link to stylesheet
     * @private
     *
     * @param {String} url
     */
  }, {
    key: '_injectStylesheet',
    value: function _injectStylesheet(url) {
      if (!this.el.head.querySelector('link[href=\'' + url + '\']')) {
        var link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", url);
        this.el.head.appendChild(link);
      }
    }

    /**
     * @method _injectHtml
     * @description Inject button structure
     * @private
     *
     * @param {DOMNode} instance
     */
  }, {
    key: '_injectHtml',
    value: function _injectHtml(instance) {
      var networks = this.config.ui.networkOrder;
      var networkList = '';

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = networks[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var network = _step4.value;

          networkList += '<li class=\'' + network + '\' data-network=\'' + network + '\'><a></a></li>';
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4['return']) {
            _iterator4['return']();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      instance.innerHTML = this.config.ui.buttonText + '<div class=\'' + this.config.ui.namespace + 'social load ' + this.config.ui.flyout + '\'><ul>' + networkList + '</ul></div>';
    }

    /**
     * @method _injectFacebookSdk
     * @description Inject Facebook SDK
     * @private
     */
  }, {
    key: '_injectFacebookSdk',
    value: function _injectFacebookSdk() {
      if (!window.FB && this.config.networks.facebook.appId && !this.el.body.querySelector('#fb-root')) {
        var script = document.createElement('script');
        script.text = 'window.fbAsyncInit=function(){FB.init({appId:\'' + this.config.networks.facebook.appId + '\',status:true,xfbml:true})};(function(e,t,n){var r,i=e.getElementsByTagName(t)[0];if (e.getElementById(n)){return}r=e.createElement(t);r.id=n;r.src=\'//connect.facebook.net/en_US/all.js\';i.parentNode.insertBefore(r,i)})(document,\'script\',\'facebook-jssdk\');';

        var fbRoot = document.createElement('div');
        fbRoot.id = 'fb-root';

        this.el.body.appendChild(fbRoot);
        this.el.body.appendChild(script);
      }
    }

    /**
     * @method _hook
     * @description Hook helper function
     * @private
     *
     * @param {String}   type
     * @param {String}   network
     * @param {DOMNode}  instance
     */
  }, {
    key: '_hook',
    value: function _hook(type, network, instance) {
      var fn = this.config.networks[network][type];

      if (typeof fn === 'function') {
        var opts = fn.call(this.config.networks[network], instance);

        if (opts !== undefined) {
          opts = this._normalizeFilterConfigUpdates(opts);
          this.extend(this.config.networks[network], opts, true);
          this._normalizeNetworkConfiguration();
        }
      }
    }

    /**
     * @method _defaultTitle
     * @description Gets default title
     * @private
     *
     * @returns {String}
     */
  }, {
    key: '_defaultTitle',
    value: function _defaultTitle() {
      var content = undefined;
      if (content = document.querySelector('meta[property="og:title"]') || document.querySelector('meta[name="twitter:title"]')) return content.getAttribute('content');else if (content = document.querySelector('title')) return content.textContent || content.innerText;
    }

    /**
     * @method _defaultImage
     * @description Gets default image
     * @private
     *
     * @returns {String}
     */
  }, {
    key: '_defaultImage',
    value: function _defaultImage() {
      var content = undefined;
      if (content = document.querySelector('meta[property="og:image"]') || document.querySelector('meta[name="twitter:image"]')) return content.getAttribute('content');
    }

    /**
     * @method _defaultDescription
     * @description Gets default description
     * @private
     *
     * @returns {String}
     */
  }, {
    key: '_defaultDescription',
    value: function _defaultDescription() {
      var content = undefined;
      if (content = document.querySelector('meta[property="og:description"]') || document.querySelector('meta[name="twitter:description"]') || document.querySelector('meta[name="description"]')) return content.getAttribute('content');else return '';
    }

    /**
     * @method _detectNetworks
     * @description Detect number of networks in use and display/hide
     * @private
     */
  }, {
    key: '_detectNetworks',
    value: function _detectNetworks() {
      // Update network-specific configuration with global configurations
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = Object.keys(this.config.networks)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var network = _step5.value;

          var display = undefined;
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = Object.keys(this.config.networks[network])[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var option = _step6.value;

              if (this.config.networks[network][option] === null) {
                this.config.networks[network][option] = this.config[option];
              }
            }

            // Check for enabled networks and display them
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                _iterator6['return']();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          if (this.config.networks[network].enabled) {
            this['class'] = 'enabled';
            this.config.enabledNetworks += 1;
          } else this['class'] = 'disabled';

          this.config.networks[network]['class'] = this['class'];
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5['return']) {
            _iterator5['return']();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }

    /**
     * @method _normalizeNetworkConfiguration
     * @description Normalizes network configuration for Facebook & Twitter
     * @private
     */
  }, {
    key: '_normalizeNetworkConfiguration',
    value: function _normalizeNetworkConfiguration() {
      // Don't load FB SDK if FB appId isn't present
      if (!this.config.networks.facebook.appId) this.config.networks.facebook.loadSdk = false;

      // Encode Twitter description for URL
      if (!!this.config.networks.twitter.description) if (!this._isEncoded(this.config.networks.twitter.description)) this.config.networks.twitter.description = encodeURIComponent(this.config.networks.twitter.description);

      // Typecast Facebook appId to a String
      if (typeof this.config.networks.facebook.appId === 'number') this.config.networks.facebook.appId = this.config.networks.facebook.appId.toString();
    }

    /**
     * @method _normalizeFilterConfigUpdates
     * @description Normalizes Facebook config
     * @private
     *
     * @param {Object} opts
     * @returns {Object}
     */
  }, {
    key: '_normalizeFilterConfigUpdates',
    value: function _normalizeFilterConfigUpdates(opts) {
      if (this.config.networks.facebook.appId !== opts.appId) {
        console.warn('You are unable to change the Facebook appId after the button has been initialized. Please update your Facebook filters accordingly.');
        delete opts.appId;
      }

      if (this.config.networks.facebook.loadSdk !== opts.loadSdk) {
        console.warn('You are unable to change the Facebook loadSdk option after the button has been initialized. Please update your Facebook filters accordingly.');
        delete opts.appId;
      }

      return opts;
    }
  }]);

  return ShareButton;
})(_shareUtils2['default']);

module.exports = ShareButton;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tZWRpYS9yeWFuL3N0dWZmL3NoYXJlLWJ1dHRvbi9zcmMvc2hhcmUtYnV0dG9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzswQkFHdUIsZUFBZTs7OzsyQkFDZCxnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7QUFKeEMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDN0IsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDckMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0lBYTNCLFdBQVc7WUFBWCxXQUFXOztBQUNKLFdBRFAsV0FBVyxDQUNILE9BQU8sRUFBRSxPQUFPLEVBQUU7MEJBRDFCLFdBQVc7O0FBRWIsK0JBRkUsV0FBVyw2Q0FFTDs7QUFFUixRQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtBQUMvQixVQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN6QixhQUFPLEdBQUcsT0FBTyxDQUFDO0tBQ25CLE1BQ0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxFQUFFLEdBQUc7QUFDUixVQUFJLEVBQUUsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxVQUFJLEVBQUUsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvQyxDQUFDOztBQUVGLFFBQUksQ0FBQyxNQUFNLEdBQUc7QUFDWixxQkFBZSxFQUFFLENBQUM7QUFDbEIsY0FBUSxFQUFFLElBQUk7QUFDZCxTQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJO0FBQ3pCLGFBQU8sRUFBRSxJQUFJO0FBQ2IsV0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDM0IsV0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDM0IsaUJBQVcsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7QUFDdkMsVUFB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QUMsRUFBRSxDQUFDLFNBQVMsV0FBUSxDQUFDO0FBQzNELG9CQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLFlBQVMsQ0FBQztBQUMvRCxvQkFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxVQUFPLENBQUM7QUFDN0Qsa0JBQU07QUFBQSxBQUNSLGVBQUssUUFBUTtBQUNYLGdCQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQ3ZCLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsU0FBTSxDQUFDO0FBQzNELG9CQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLFlBQVMsQ0FBQztBQUM1RCxvQkFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxVQUFPLENBQUM7QUFDN0Qsb0JBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsV0FBUSxDQUFDO0FBQzlELG9CQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLFlBQVMsQ0FBQztBQUMvRCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxPQUFPO0FBQ1Ysb0JBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsVUFBTyxDQUFDO0FBQzFELG9CQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLFlBQVMsQ0FBQztBQUMvRCxvQkFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFN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RUFBRTtBQUNsQyxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRTtBQUN0RCxlQUFPLENBQUMsSUFBSSxDQUFDLHFJQUFxSSxDQUFDLENBQUM7QUFDcEosZUFBTyxJQUFJLENBQUMsS0FBSyxBQUFDLENBQUM7T0FDcEI7O0FBRUQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDMUQsZUFBTyxDQUFDLElBQUksQ0FBQyw4SUFBOEksQ0FBQyxDQUFDO0FBQzdKLGVBQU8sSUFBSSxDQUFDLEtBQUssQUFBQyxDQUFDO09BQ3BCOztBQUVELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztTQTd3QkcsV0FBVzs7O0FBZ3hCakIsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiL21lZGlhL3J5YW4vc3R1ZmYvc2hhcmUtYnV0dG9uL3NyYy9zaGFyZS1idXR0b24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCdjb3JlLWpzL2ZuL3N5bWJvbCcpO1xucmVxdWlyZSgnY29yZS1qcy9mbi9hcnJheS9pdGVyYXRvcicpO1xucmVxdWlyZSgnY29yZS1qcy9mbi9tYXRoL3RydW5jJyk7XG5pbXBvcnQgU2hhcmVVdGlscyBmcm9tICcuL3NoYXJlLXV0aWxzJztcbmltcG9ydCBTdHJpbmdVdGlscyBmcm9tICcuL3N0cmluZy11dGlscyc7XG5cbi8qKlxuICogU2hhcmVidXR0b25cbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzY1xuICogQGV4dGVuZHMgU2hhcmVVdGlsc1xuXG4gKiBAcGFyYW0ge1N0cmluZ30gZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuY2xhc3MgU2hhcmVCdXR0b24gZXh0ZW5kcyBTaGFyZVV0aWxzIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICBvcHRpb25zID0gZWxlbWVudDtcbiAgICB9IGVsc2VcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cbiAgICB0aGlzLmVsID0ge1xuICAgICAgaGVhZDogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSxcbiAgICAgIGJvZHk6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF1cbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBlbmFibGVkTmV0d29ya3M6IDAsXG4gICAgICBwcm90b2NvbDogJy8vJyxcbiAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICBjYXB0aW9uOiBudWxsLFxuICAgICAgdGl0bGU6IHRoaXMuX2RlZmF1bHRUaXRsZSgpLFxuICAgICAgaW1hZ2U6IHRoaXMuX2RlZmF1bHRJbWFnZSgpLFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuX2RlZmF1bHREZXNjcmlwdGlvbigpLFxuICAgICAgcm9vdDogZG9jdW1lbnQsXG5cbiAgICAgIHVpOiB7XG4gICAgICAgIGZseW91dDogJ3NiLXRvcCBzYi1jZW50ZXInLFxuICAgICAgICBidXR0b25UZXh0OiAnU2hhcmUnLFxuICAgICAgICBuYW1lc3BhY2U6ICdzYi0nLFxuICAgICAgICBuZXR3b3JrT3JkZXI6IFtdLFxuICAgICAgICBjb2xsaXNpb246IGZhbHNlLFxuICAgICAgfSxcblxuICAgICAgbmV0d29ya3M6IHtcbiAgICAgICAgZ29vZ2xlUGx1czoge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgdXJsOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHR3aXR0ZXI6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBmYWNlYm9vazoge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgbG9hZFNkazogdHJ1ZSxcbiAgICAgICAgICB1cmw6IG51bGwsXG4gICAgICAgICAgYXBwSWQ6IG51bGwsXG4gICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgY2FwdGlvbjogbnVsbCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgICAgICBpbWFnZTogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBwaW50ZXJlc3Q6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgICBpbWFnZTogbnVsbCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICByZWRkaXQ6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgICB0aXRsZTogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBsaW5rZWRpbjoge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgdXJsOiBudWxsLFxuICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHdoYXRzYXBwOiB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgICAgICB1cmw6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5saXN0ZW5lciA9IG51bGw7XG4gICAgdGhpcy5fc2V0dXAodGhpcy5lbGVtZW50LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIG9wZW5cbiAgICogQGRlc2NyaXB0aW9uIE9wZW5zIFNoYXJlIEJ1dHRvblxuICAgKi9cbiAgb3BlbigpIHsgdGhpcy5fcHVibGljKCdPcGVuJyk7IH1cblxuICAvKipcbiAgICogQG1ldGhvZCBjbG9zZVxuICAgKiBAZGVzY3JpcHRpb24gQ3BlbnMgU2hhcmUgQnV0dG9uXG4gICAqL1xuICBjbG9zZSgpIHsgdGhpcy5fcHVibGljKCdDbG9zZScpOyB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgdG9nZ2xlXG4gICAqIEBkZXNjcmlwdGlvbiBUb2dnbGVzIFNoYXJlIEJ1dHRvblxuICAgKi9cbiAgdG9nZ2xlKCkgeyB0aGlzLl9wdWJsaWMoJ1RvZ2dsZScpOyB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgdG9nZ2xlTGlzdGVuXG4gICAqIEBkZXNjcmlwdGlvbiBUb2dnbGVzIHRoZSBTaGFyZSBCdXR0b24gbGlzdGVuZXIsIGdvb2QgZm9yIHVwZGFpbmcgc2hhcmVcbiAgICogYnV0dG9uIGZvciBDU1MgYW5pbWF0aW9ucy5cbiAgICovXG4gIHRvZ2dsZUxpc3RlbigpIHsgdGhpcy5fcHVibGljKCdMaXN0ZW4nKTsgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9wdWJsaWNcbiAgICogQGRlc2NyaXB0aW9uIEV4ZWN1dGVzIGFjdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uXG4gICAqL1xuICBfcHVibGljKGFjdGlvbikge1xuICAgIGxldCBpbnN0YW5jZXM7XG5cbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKVxuICAgICAgaW5zdGFuY2VzID1cbiAgICAgICAgc3VwZXIuX29ialRvQXJyYXkodGhpcy5jb25maWcucm9vdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2hhcmUtYnV0dG9uJykpO1xuICAgIGVsc2VcbiAgICAgIGluc3RhbmNlcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoZWxlbWVudCk7XG5cbiAgICBmb3IgKGxldCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcbiAgICAgIGxldCBuZXR3b3JrcyA9XG4gICAgICAgIGluc3RhbmNlLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfXNvY2lhbGApWzBdO1xuICAgICAgdGhpc1tgX2V2ZW50JHthY3Rpb259YF0oaW5zdGFuY2UsIG5ldHdvcmtzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfc2V0dXBcbiAgICogQGRlc2NyaXB0aW9uIFNldHMgdXAgU2hhcmUgQnV0dG9uXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBlbGVtZW50IHNlbGVjdG9yXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICAqL1xuICBfc2V0dXAoZWxlbWVudCwgb3B0cykge1xuICAgIGxldCBpbnN0YW5jZXM7XG5cbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKVxuICAgICAgaW5zdGFuY2VzID1cbiAgICAgICAgc3VwZXIuX29ialRvQXJyYXkodGhpcy5jb25maWcucm9vdC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2hhcmUtYnV0dG9uJykpO1xuICAgIGVsc2Uge1xuICAgICAgaW5zdGFuY2VzID0gdGhpcy5jb25maWcucm9vdC5xdWVyeVNlbGVjdG9yQWxsKGBzaGFyZS1idXR0b24ke2VsZW1lbnR9YCk7XG4gICAgICBpZiAodHlwZW9mIGluc3RhbmNlcyA9PT0gJ29iamVjdCcpXG4gICAgICAgIGluc3RhbmNlcyA9IHN1cGVyLl9vYmpUb0FycmF5KGluc3RhbmNlcyk7XG4gICAgfVxuXG4gICAgLy8gQWRkaW5nIHVzZXIgY29uZmlncyB0byBkZWZhdWx0IGNvbmZpZ3NcbiAgICB0aGlzLl9tZXJnZSh0aGlzLmNvbmZpZywgb3B0cyk7XG5cbiAgICAvLyBEaXNhYmxlIHdoYXRzYXBwIGRpc3BsYXkgaWYgbm90IGEgbW9iaWxlIGRldmljZVxuICAgIGlmICh0aGlzLmNvbmZpZy5uZXR3b3Jrcy53aGF0c2FwcC5lbmFibGVkICYmICF0aGlzLl9pc01vYmlsZSgpKVxuICAgICAgdGhpcy5jb25maWcubmV0d29ya3Mud2hhdHNhcHAuZW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgLy8gRGVmYXVsdCBvcmRlciBvZiBuZXR3b3JrcyBpZiBubyBuZXR3b3JrIG9yZGVyIGVudGVyZWRcbiAgICBpZiAodGhpcy5jb25maWcudWkubmV0d29ya09yZGVyLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuY29uZmlnLnVpLm5ldHdvcmtPcmRlciA9IFtcbiAgICAgICAgJ3BpbnRlcmVzdCcsXG4gICAgICAgICd0d2l0dGVyJyxcbiAgICAgICAgJ2ZhY2Vib29rJyxcbiAgICAgICAgJ3doYXRzYXBwJyxcbiAgICAgICAgJ2dvb2dsZVBsdXMnLFxuICAgICAgICAncmVkZGl0JyxcbiAgICAgICAgJ2xpbmtlZGluJyxcbiAgICAgICAgJ2VtYWlsJ1xuICAgICAgXTtcblxuICAgIGZvciAobGV0IG5ldHdvcmsgb2YgT2JqZWN0LmtleXModGhpcy5jb25maWcubmV0d29ya3MpKSB7XG4gICAgICBpZiAodGhpcy5jb25maWcudWkubmV0d29ya09yZGVyLmluZGV4T2YobmV0d29yay50b1N0cmluZygpKSA8IDApIHtcbiAgICAgICAgdGhpcy5jb25maWcubmV0d29ya3NbbmV0d29ya10uZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNvbmZpZy51aS5uZXR3b3JrT3JkZXIucHVzaChuZXR3b3JrKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9maXhGbHlvdXQoKTtcbiAgICB0aGlzLl9kZXRlY3ROZXR3b3JrcygpO1xuICAgIHRoaXMuX25vcm1hbGl6ZU5ldHdvcmtDb25maWd1cmF0aW9uKCk7XG5cbiAgICAvLyBJbmplY3QgRmFjZWJvb2sgSlMgU0RLIChpZiBGYWNlYm9vayBpcyBlbmFibGVkKVxuICAgIGlmICh0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5lbmFibGVkICYmXG4gICAgICAgdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2subG9hZFNkaylcbiAgICAgICB0aGlzLl9pbmplY3RGYWNlYm9va1NkaygpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSBpbnN0YW5jZXNcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIGZvciAobGV0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xuICAgICAgdGhpcy5fc2V0dXBJbnN0YW5jZShpbnN0YW5jZSwgaW5kZXgrKyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX3NldHVwSW5zdGFuY2VcbiAgICogQGRlc2NyaXB0aW9uIFNldHMgdXAgZWFjaCBpbnN0YW5jZSB3aXRoIGNvbmZpZyBhbmQgc3R5bGVzXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gaW5zdGFuY2VcbiAgICogQHBhcmFtIHtJbnRlZ2VyfSBpbmRleFxuICAgKi9cbiAgX3NldHVwSW5zdGFuY2UoaW5zdGFuY2UsIGluZGV4KSB7XG4gICAgdGhpcy5faGlkZShpbnN0YW5jZSk7XG5cbiAgICAvLyBBZGQgbmVjZXNzYXJ5IGNsYXNzZXMgdG8gaW5zdGFuY2VcbiAgICAvLyAoTm90ZTogRkYgZG9lc24ndCBzdXBwb3J0IGFkZGluZyBtdWx0aXBsZSBjbGFzc2VzIGluIGEgc2luZ2xlIGNhbGwpXG4gICAgdGhpcy5fYWRkQ2xhc3MoaW5zdGFuY2UsIGBzaGFyZXItJHtpbmRleH1gKTtcbiAgICB0aGlzLl9pbmplY3RIdG1sKGluc3RhbmNlKTtcbiAgICB0aGlzLl9zaG93KGluc3RhbmNlKTtcblxuICAgIGxldCBuZXR3b3Jrc0NvbiA9XG4gICAgICBpbnN0YW5jZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1zb2NpYWxgKVswXTtcbiAgICBsZXQgbmV0d29ya3MgPSBpbnN0YW5jZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKTtcblxuICAgIHRoaXMuX2FkZENsYXNzKG5ldHdvcmtzQ29uLCBgbmV0d29ya3MtJHt0aGlzLmNvbmZpZy5lbmFibGVkTmV0d29ya3N9YCk7XG4gICAgaW5zdGFuY2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgdGhpcy5fZXZlbnRUb2dnbGUoaW5zdGFuY2UsIG5ldHdvcmtzQ29uKVxuICAgICk7XG5cbiAgICAvLyBBZGQgbGlzdGVuZXIgdG8gYWN0aXZhdGUgbmV0d29ya3MgYW5kIGNsb3NlIGJ1dHRvblxuICAgIGZvciAobGV0IGsgaW4gT2JqZWN0LmtleXMobmV0d29ya3MpKSB7XG4gICAgICBsZXQgbmV0d29yayA9IG5ldHdvcmtzW2tdO1xuXG4gICAgICBpZiAodHlwZW9mKG5ldHdvcmspICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGxldCBuYW1lID0gbmV0d29yay5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmV0d29yaycpO1xuICAgICAgICBsZXQgYSA9IG5ldHdvcmsuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2EnKVswXTtcblxuICAgICAgICB0aGlzLl9hZGRDbGFzcyhuZXR3b3JrLCB0aGlzLmNvbmZpZy5uZXR3b3Jrc1tuYW1lXS5jbGFzcyk7XG5cbiAgICAgICAgaWYgKG5ldHdvcmsuY2xhc3NOYW1lLmluZGV4T2YoJ2VtYWlsJykgPCAwKVxuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdvbmNsaWNrJywgJ3JldHVybiBmYWxzZScpO1xuXG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2hvb2soJ2JlZm9yZScsIG5hbWUsIGluc3RhbmNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICAgICAgICB0aGlzW2BfbmV0d29yayR7U3RyaW5nVXRpbHMuY2FwRkxldHRlcihuYW1lKX1gXShuZXR3b3JrKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5faG9vaygnYWZ0ZXInLCBuYW1lLCBpbnN0YW5jZSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9ldmVudFRvZ2dsZVxuICAgKiBAZGVzY3JpcHRpb24gVG9nZ2xlcyAnYWN0aXZlJyBjbGFzcyBvbiBidXR0b25cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtET01Ob2RlfSBidXR0b25cbiAgICogQHBhcmFtIHtET01Ob2RlfSBuZXR3b3Jrc1xuICAgKi9cbiAgX2V2ZW50VG9nZ2xlKGJ1dHRvbiwgbmV0d29ya3MpIHtcbiAgICBpZiAodGhpcy5faGFzQ2xhc3MobmV0d29ya3MsICdhY3RpdmUnKSlcbiAgICAgIHRoaXMuX2V2ZW50Q2xvc2UobmV0d29ya3MpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX2V2ZW50T3BlbihidXR0b24sIG5ldHdvcmtzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9ldmVudE9wZW5cbiAgICogQGRlc2NyaXB0aW9uIEFkZCAnYWN0aXZlJyBjbGFzcyAmIHJlbW92ZSAnbG9hZCcgY2xhc3Mgb24gYnV0dG9uXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gYnV0dG9uXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gbmV0d29ya3NcbiAgICovXG4gIF9ldmVudE9wZW4oYnV0dG9uLCBuZXR3b3Jrcykge1xuICAgIGlmICh0aGlzLl9oYXNDbGFzcyhuZXR3b3JrcywgJ2xvYWQnKSlcbiAgICAgIHRoaXMuX3JlbW92ZUNsYXNzKG5ldHdvcmtzLCAnbG9hZCcpO1xuICAgIGlmICh0aGlzLmNvbGxpc2lvbilcbiAgICAgIHRoaXMuX2NvbGxpc2lvbkRldGVjdGlvbihidXR0b24sIG5ldHdvcmtzKTtcblxuICAgIHRoaXMuX2FkZENsYXNzKG5ldHdvcmtzLCAnYWN0aXZlJyk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZXZlbnRDbG9zZVxuICAgKiBAZGVzY3JpcHRpb24gUmVtb3ZlICdhY3RpdmUnIGNsYXNzIG9uIGJ1dHRvblxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGJ1dHRvblxuICAgKi9cbiAgX2V2ZW50Q2xvc2UoYnV0dG9uKSB7XG4gICAgdGhpcy5fcmVtb3ZlQ2xhc3MoYnV0dG9uLCAnYWN0aXZlJyk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZXZlbnRMaXN0ZW5cbiAgICogQGRlc2NyaXB0aW9uIFRvZ2dsZXMgd2VhdGhlciBvciBub3QgYSBidXR0b24ncyBjbGFzc2VzIGFyZSBiZWluZ1xuICAgKiBjb25zdGFudGx5IHVwZGF0ZWQgcmVnYXJkbGVzcyBvZiBzY3JvbGxzIG9yIHdpbmRvdyByZXNpemVzLlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGJ1dHRvblxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IG5ldHdvcmtzXG4gICAqL1xuICBfZXZlbnRMaXN0ZW4oYnV0dG9uLCBuZXR3b3Jrcykge1xuICAgIGxldCBkaW1lbnNpb25zID0gdGhpcy5fZ2V0RGltZW5zaW9ucyhidXR0b24sIG5ldHdvcmtzKTtcbiAgICBpZiAodGhpcy5saXN0ZW5lciA9PT0gbnVsbClcbiAgICAgIHRoaXMubGlzdGVuZXIgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoKCkgPT5cbiAgICAgICAgdGhpcy5fYWRqdXN0Q2xhc3NlcyhidXR0b24sIG5ldHdvcmtzLCBkaW1lbnNpb25zKSwgMTAwXG4gICAgICApO1xuICAgIGVsc2Uge1xuICAgICAgd2luZG93LmNsZWFySW50ZXJ2YWwodGhpcy5saXN0ZW5lcik7XG4gICAgICB0aGlzLmxpc3RlbmVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZml4Rmx5b3V0XG4gICAqIEBkZXNjcmlwdGlvbiBGaXhlcyB0aGUgZmx5b3V0IGVudGVyZWQgYnkgdGhlIHVzZXIgdG8gbWF0Y2ggdGhlaXIgcHJvdmlkZWRcbiAgICogbmFtZXNwYWNlXG4gICAqQHByaXZhdGVcbiAgICovXG4gIF9maXhGbHlvdXQoKSB7XG4gICAgbGV0IGZseW91dHMgPSB0aGlzLmNvbmZpZy51aS5mbHlvdXQuc3BsaXQoJyAnKTtcbiAgICBpZiAoZmx5b3V0c1swXS5zdWJzdHJpbmcoMCx0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2UubGVuZ3RoKSAhPT1cbiAgICAgICB0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2UpXG4gICAgICBmbHlvdXRzWzBdID0gYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfSR7Zmx5b3V0c1swXX1gO1xuICAgIGlmIChmbHlvdXRzWzFdLnN1YnN0cmluZygwLHRoaXMuY29uZmlnLnVpLm5hbWVzcGFjZS5sZW5ndGgpICE9PVxuICAgICAgIHRoaXMuY29uZmlnLnVpLm5hbWVzcGFjZSlcbiAgICAgIGZseW91dHNbMV0gPSBgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9JHtmbHlvdXRzWzFdfWA7XG4gICAgdGhpcy5jb25maWcudWkuZmx5b3V0ID0gZmx5b3V0cy5qb2luKCcgJyk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfY29sbGlzaW9uRGV0ZWN0aW9uXG4gICAqIEBkZXNjcmlwdGlvbiBBZGRzIGxpc3RlbmVycyB0aGUgZmlyc3QgdGltZSBhIGJ1dHRvbiBpcyBjbGlja2VkIHRvIGNhbGxcbiAgICogdGhpcy5fYWRqdXN0Q2xhc3NlcyBkdXJpbmcgc2Nyb2xscyBhbmQgcmVzaXplcy5cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtET01Ob2RlfSBidXR0b24gLSBzaGFyZSBidXR0b25cbiAgICogQHBhcmFtIHtET01Ob2RlfSBuZXR3b3JrcyAtIGxpc3Qgb2Ygc29jaWFsIG5ldHdvcmtzXG4gICAqL1xuICBfY29sbGlzaW9uRGV0ZWN0aW9uKGJ1dHRvbiwgbmV0d29ya3MpIHtcbiAgICBsZXQgZGltZW5zaW9ucyA9IHRoaXMuX2dldERpbWVuc2lvbnMoYnV0dG9uLCBuZXR3b3Jrcyk7XG4gICAgdGhpcy5fYWRqdXN0Q2xhc3NlcyhidXR0b24sIG5ldHdvcmtzLCBkaW1lbnNpb25zKTtcblxuICAgIGlmICghYnV0dG9uLmNsYXNzTGlzdC5jb250YWlucygnY2xpY2tlZCcpKSB7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgKCkgPT5cbiAgICAgICAgdGhpcy5fYWRqdXN0Q2xhc3NlcyhidXR0b24sIGRpbWVuc2lvbnMpKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PlxuICAgICAgICB0aGlzLl9hZGp1c3RDbGFzc2VzKGJ1dHRvbiwgZGltZW5zaW9ucykpO1xuICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2NsaWNrZWQnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZ2V0RGltZW5zaW9uc1xuICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyBhbiBvYmplY3Qgd2l0aCB0aGUgZGltZW5zaW9ucyBvZiB0aGUgYnV0dG9uIGFuZFxuICAgKiBsYWJlbCBlbGVtZW50cyBvZiBhIFNoYXJlIEJ1dHRvbi5cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtET01Ob2RlfSBidXR0b25cbiAgICogQHBhcmFtIHtET01Ob2RlfSBuZXR3b3Jrc1xuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgX2dldERpbWVuc2lvbnMoYnV0dG9uLCBuZXR3b3Jrcykge1xuICAgIHJldHVybiB7XG4gICAgICBuZXR3b3Jrc1dpZHRoOiBuZXR3b3Jrcy5vZmZzZXRXaWR0aCxcbiAgICAgIGJ1dHRvbkhlaWdodDogYnV0dG9uLm9mZnNldEhlaWdodCxcbiAgICAgIGJ1dHRvbldpZHRoOiBidXR0b24ub2Zmc2V0V2lkdGhcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2FkanVzdENsYXNzZXNcbiAgICogQGRlc2NyaXB0aW9uIEFkanVzdHMgdGhlIHBvc2l0aW9uaW5nIG9mIHRoZSBsaXN0IG9mIHNvY2lhbCBuZXR3b3JrcyBiYXNlZFxuICAgKiBvZmYgb2Ygd2hlcmUgdGhlIHNoYXJlIGJ1dHRvbiBpcyByZWxhdGl2ZSB0byB0aGUgd2luZG93LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGJ1dHRvblxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IG5ldHdvcmtzXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkaW1lbnNpb25zXG4gICAqL1xuICBfYWRqdXN0Q2xhc3NlcyhidXR0b24sIG5ldHdvcmtzLCBkaW1lbnNpb25zKSB7XG4gICAgbGV0IHdpbmRvd1dpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgbGV0IHdpbmRvd0hlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICBsZXQgbGVmdE9mZnNldCA9IGJ1dHRvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0ICtcbiAgICAgIGRpbWVuc2lvbnMuYnV0dG9uV2lkdGggLyAyO1xuICAgIGxldCByaWdodE9mZnNldCA9IHdpbmRvd1dpZHRoIC0gbGVmdE9mZnNldDtcbiAgICBsZXQgdG9wT2Zmc2V0ID0gYnV0dG9uLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArXG4gICAgICBkaW1lbnNpb25zLmJ1dHRvbkhlaWdodCAvIDI7XG4gICAgbGV0IHBvc2l0aW9uID1cbiAgICAgIHRoaXMuX2ZpbmRMb2NhdGlvbihsZWZ0T2Zmc2V0LCB0b3BPZmZzZXQsIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpO1xuXG4gICAgaWYgKHBvc2l0aW9uWzFdID09PSBcIm1pZGRsZVwiICYmIHBvc2l0aW9uWzBdICE9PSBcImNlbnRlclwiICYmXG4gICAgICAgICgocG9zaXRpb25bMF0gPT09IFwibGVmdFwiICYmXG4gICAgICAgICAgd2luZG93V2lkdGggPD0gbGVmdE9mZnNldCArIDIyMCArIGRpbWVuc2lvbnMuYnV0dG9uV2lkdGggLyAyKSB8fFxuICAgICAgICAocG9zaXRpb25bMF0gPT09IFwicmlnaHRcIiAmJlxuICAgICAgICAgIHdpbmRvd1dpZHRoIDw9IHJpZ2h0T2Zmc2V0ICsgMjIwICsgZGltZW5zaW9ucy5idXR0b25XaWR0aCAvIDIpXG4gICAgICAgIClcbiAgICAgICkge1xuICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QuYWRkKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX10b3BgKTtcbiAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9bWlkZGxlYCk7XG4gICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWJvdHRvbWApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHN3aXRjaChwb3NpdGlvblswXSkge1xuICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfXJpZ2h0YCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9Y2VudGVyYCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9bGVmdGApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY2VudGVyXCI6XG4gICAgICAgICAgaWYgKHBvc2l0aW9uWzFdICE9PSBcInRvcFwiKVxuICAgICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9dG9wYCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9Y2VudGVyYCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9bGVmdGApO1xuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfXJpZ2h0YCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9bWlkZGxlYCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWxlZnRgKTtcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1jZW50ZXJgKTtcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1yaWdodGApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgc3dpdGNoKHBvc2l0aW9uWzFdKSB7XG4gICAgICAgIGNhc2UgXCJ0b3BcIjpcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QuYWRkKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1ib3R0b21gKTtcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1taWRkbGVgKTtcbiAgICAgICAgICBpZiAocG9zaXRpb25bMF0gIT09IFwiY2VudGVyXCIpXG4gICAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX10b3BgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1pZGRsZVwiOlxuICAgICAgICAgIGlmIChwb3NpdGlvblswXSAhPT0gXCJjZW50ZXJcIikge1xuICAgICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9bWlkZGxlYCk7XG4gICAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX10b3BgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9Ym90dG9tYCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib3R0b21cIjpcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QuYWRkKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX10b3BgKTtcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1taWRkbGVgKTtcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1ib3R0b21gKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZmluZExvY2F0aW9uXG4gICAqIEBkZXNjcmlwdGlvbiBGaW5kcyB0aGUgbG9jYXRpb24gb2YgdGhlIGxhYmVsIGdpdmVuIGJ5IGl0cyB4IGFuZCB5IHZhbHVlXG4gICAqIHdpdGggcmVzcGVjdCB0byB0aGUgd2luZG93IHdpZHRoIGFuZCB3aW5kb3cgaGVpZ2h0IGdpdmVuLlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gbGFiZWxYXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBsYWJlbFlcbiAgICogQHBhcmFtIHtudW1iZXJ9IHdpbmRvd1dpZHRoXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aW5kb3dIZWlnaHRcbiAgICogQHJldHVybnMge0FycmF5fVxuICAgKi9cbiAgX2ZpbmRMb2NhdGlvbihsYWJlbFgsIGxhYmVsWSwgd2luZG93V2lkdGgsIHdpbmRvd0hlaWdodCkge1xuICAgIGxldCB4UG9zaXRpb24gPSBbXCJsZWZ0XCIsIFwiY2VudGVyXCIsIFwicmlnaHRcIl07XG4gICAgbGV0IHlQb3NpdGlvbiA9IFtcInRvcFwiLCBcIm1pZGRsZVwiLCBcImJvdHRvbVwiXTtcbiAgICBsZXQgeExvY2F0aW9uID1cbiAgICAgIE1hdGgudHJ1bmMoMyAqICgxIC0gKCh3aW5kb3dXaWR0aCAtIGxhYmVsWCkgLyB3aW5kb3dXaWR0aCkpKTtcbiAgICBsZXQgeUxvY2F0aW9uID1cbiAgICAgIE1hdGgudHJ1bmMoMyAqICgxIC0gKCh3aW5kb3dIZWlnaHQgLSBsYWJlbFkpIC8gd2luZG93SGVpZ2h0KSkpO1xuICAgIGlmICh4TG9jYXRpb24gPj0gMykgeExvY2F0aW9uID0gMjtcbiAgICBlbHNlIGlmICh4TG9jYXRpb24gPD0gLTEpIHhMb2NhdGlvbiA9IDA7XG4gICAgaWYgKHlMb2NhdGlvbiA+PSAzKSB5TG9jYXRpb24gPSAyO1xuICAgIGVsc2UgaWYgKHlMb2NhdGlvbiA8PSAtMSkgeUxvY2F0aW9uID0gMDtcbiAgICByZXR1cm4gW3hQb3NpdGlvblt4TG9jYXRpb25dLCB5UG9zaXRpb25beUxvY2F0aW9uXV07XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfbmV0d29ya0ZhY2Vib29rXG4gICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgJiBkaXNwbGF5IGEgRmFjZWJvb2sgd2luZG93XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbmV0d29ya0ZhY2Vib29rKGVsZW1lbnQpIHtcbiAgICBpZiAodGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2subG9hZFNkaykge1xuICAgICAgaWYgKCF3aW5kb3cuRkIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignVGhlIEZhY2Vib29rIEpTIFNESyBoYXNuXFwndCBsb2FkZWQgeWV0LicpO1xuICAgICAgICByZXR1cm4gdGhpcy5fdXBkYXRlSHJlZihlbGVtZW50LCAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwJywge1xuICAgICAgICAgIHU6IHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLnVybFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBGQi51aSh7XG4gICAgICAgIG1ldGhvZDonZmVlZCcsXG4gICAgICAgIG5hbWU6IHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLnRpdGxlLFxuICAgICAgICBsaW5rOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay51cmwsXG4gICAgICAgIHBpY3R1cmU6IHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmltYWdlLFxuICAgICAgICBjYXB0aW9uOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5jYXB0aW9uLFxuICAgICAgICBkZXNjcmlwdGlvbjogdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suZGVzY3JpcHRpb25cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdXBkYXRlSHJlZihcbiAgICAgICAgZWxlbWVudCxcbiAgICAgICAgJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocCcsIHtcbiAgICAgICAgICB1OiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay51cmxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfbmV0d29ya1R3aXR0ZXJcbiAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSAmIGRpc3BsYXkgYSBUd2l0dGVyIHdpbmRvd1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25ldHdvcmtUd2l0dGVyKGVsZW1lbnQpIHtcbiAgICB0aGlzLl91cGRhdGVIcmVmKGVsZW1lbnQsICdodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldCcsIHtcbiAgICAgIHRleHQ6IHRoaXMuY29uZmlnLm5ldHdvcmtzLnR3aXR0ZXIuZGVzY3JpcHRpb24sXG4gICAgICB1cmw6IHRoaXMuY29uZmlnLm5ldHdvcmtzLnR3aXR0ZXIudXJsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfbmV0d29ya0dvb2dsZVBsdXNcbiAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSAmIGRpc3BsYXkgYSBHb29nbGUgUGx1cyB3aW5kb3dcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9uZXR3b3JrR29vZ2xlUGx1cyhlbGVtZW50KSB7XG4gICAgdGhpcy5fdXBkYXRlSHJlZihlbGVtZW50LCAnaHR0cHM6Ly9wbHVzLmdvb2dsZS5jb20vc2hhcmUnLCB7XG4gICAgICB1cmw6IHRoaXMuY29uZmlnLm5ldHdvcmtzLmdvb2dsZVBsdXMudXJsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfbmV0d29ya1BpbnRlcmVzdFxuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlICYgZGlzcGxheSBhIFBpbnRlcmVzdCB3aW5kb3dcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9uZXR3b3JrUGludGVyZXN0KGVsZW1lbnQpIHtcbiAgICB0aGlzLl91cGRhdGVIcmVmKGVsZW1lbnQsICdodHRwczovL3d3dy5waW50ZXJlc3QuY29tL3Bpbi9jcmVhdGUvYnV0dG9uJywge1xuICAgICAgdXJsOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5waW50ZXJlc3QudXJsLFxuICAgICAgbWVkaWE6IHRoaXMuY29uZmlnLm5ldHdvcmtzLnBpbnRlcmVzdC5pbWFnZSxcbiAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5waW50ZXJlc3QuZGVzY3JpcHRpb25cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9uZXR3b3JrTGlua2VkSW5cbiAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSAmIGRpc3BsYXkgYSBMaW5rZWRpbiB3aW5kb3dcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9uZXR3b3JrTGlua2VkaW4oZWxlbWVudCkge1xuICAgIHRoaXMuX3VwZGF0ZUhyZWYoZWxlbWVudCwgJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9zaGFyZUFydGljbGUnLCB7XG4gICAgICBtaW5pOiAndHJ1ZScsXG4gICAgICB1cmw6IHRoaXMuY29uZmlnLm5ldHdvcmtzLmxpbmtlZGluLnVybCxcbiAgICAgIHRpdGxlOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5saW5rZWRpbi50aXRsZSxcbiAgICAgIHN1bW1hcnk6IHRoaXMuY29uZmlnLm5ldHdvcmtzLmxpbmtlZGluLmRlc2NyaXB0aW9uXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfbmV0d29ya0VtYWlsXG4gICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgJiBkaXNwbGF5IGFuIEVtYWlsIHdpbmRvd1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25ldHdvcmtFbWFpbChlbGVtZW50KSB7XG4gICAgdGhpcy5fdXBkYXRlSHJlZihlbGVtZW50LCAnbWFpbHRvOicsIHtcbiAgICAgIHN1YmplY3Q6IHRoaXMuY29uZmlnLm5ldHdvcmtzLmVtYWlsLnRpdGxlLFxuICAgICAgYm9keTogdGhpcy5jb25maWcubmV0d29ya3MuZW1haWwuZGVzY3JpcHRpb25cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9uZXR3b3JrUmVkZGl0XG4gICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgJiBkaXNwbGF5IGEgUmVkZGl0IHdpbmRvd1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25ldHdvcmtSZWRkaXQoZWxlbWVudCkge1xuICAgIHRoaXMuX3VwZGF0ZUhyZWYoZWxlbWVudCwgJ2h0dHA6Ly93d3cucmVkZGl0LmNvbS9zdWJtaXQnLCB7XG4gICAgICB1cmw6IHRoaXMuY29uZmlnLm5ldHdvcmtzLnJlZGRpdC51cmwsXG4gICAgICB0aXRsZTogdGhpcy5jb25maWcubmV0d29ya3MucmVkZGl0LnRpdGxlXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfbmV0d29ya1doYXRzYXBwXG4gICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgJiBkaXNwbGF5IGEgV2hhdHNhcHAgd2luZG93XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbmV0d29ya1doYXRzYXBwKGVsZW1lbnQpIHtcbiAgICB0aGlzLl91cGRhdGVIcmVmKGVsZW1lbnQsICd3aGF0c2FwcDovL3NlbmQnLCB7XG4gICAgICB0ZXh0OiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy53aGF0c2FwcC5kZXNjcmlwdGlvbiArIFwiIFwiICtcbiAgICAgICAgdGhpcy5jb25maWcubmV0d29ya3Mud2hhdHNhcHAudXJsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfaW5qZWN0U3R5bGVzaGVldFxuICAgKiBAZGVzY3JpcHRpb24gSW5qZWN0IGxpbmsgdG8gc3R5bGVzaGVldFxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gICAqL1xuICBfaW5qZWN0U3R5bGVzaGVldCh1cmwpIHtcbiAgICBpZiAoIXRoaXMuZWwuaGVhZC5xdWVyeVNlbGVjdG9yKGBsaW5rW2hyZWY9JyR7dXJsfSddYCkpIHtcbiAgICAgIGxldCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZShcInJlbFwiLCBcInN0eWxlc2hlZXRcIik7XG4gICAgICBsaW5rLnNldEF0dHJpYnV0ZShcImhyZWZcIiwgdXJsKTtcbiAgICAgIHRoaXMuZWwuaGVhZC5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfaW5qZWN0SHRtbFxuICAgKiBAZGVzY3JpcHRpb24gSW5qZWN0IGJ1dHRvbiBzdHJ1Y3R1cmVcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtET01Ob2RlfSBpbnN0YW5jZVxuICAgKi9cbiAgX2luamVjdEh0bWwoaW5zdGFuY2UpIHtcbiAgICBsZXQgbmV0d29ya3MgPSB0aGlzLmNvbmZpZy51aS5uZXR3b3JrT3JkZXI7XG4gICAgbGV0IG5ldHdvcmtMaXN0ID0gJyc7XG5cbiAgICBmb3IgKGxldCBuZXR3b3JrIG9mIG5ldHdvcmtzKSB7XG4gICAgICBuZXR3b3JrTGlzdCArPSBgPGxpIGNsYXNzPScke25ldHdvcmt9JyBkYXRhLW5ldHdvcms9JyR7bmV0d29ya30nPjxhPjwvYT48L2xpPmA7XG4gICAgfVxuICAgIGluc3RhbmNlLmlubmVySFRNTCA9IGAke3RoaXMuY29uZmlnLnVpLmJ1dHRvblRleHR9PGRpdiBjbGFzcz0nJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9c29jaWFsIGxvYWQgJHt0aGlzLmNvbmZpZy51aS5mbHlvdXR9Jz48dWw+YCArIG5ldHdvcmtMaXN0ICsgYDwvdWw+PC9kaXY+YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9pbmplY3RGYWNlYm9va1Nka1xuICAgKiBAZGVzY3JpcHRpb24gSW5qZWN0IEZhY2Vib29rIFNES1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2luamVjdEZhY2Vib29rU2RrKCkge1xuICAgIGlmICghd2luZG93LkZCICYmIHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmFwcElkICYmXG4gICAgICAgICF0aGlzLmVsLmJvZHkucXVlcnlTZWxlY3RvcignI2ZiLXJvb3QnKSkge1xuICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgc2NyaXB0LnRleHQgPSBgd2luZG93LmZiQXN5bmNJbml0PWZ1bmN0aW9uKCl7RkIuaW5pdCh7YXBwSWQ6JyR7dGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suYXBwSWR9JyxzdGF0dXM6dHJ1ZSx4ZmJtbDp0cnVlfSl9OyhmdW5jdGlvbihlLHQsbil7dmFyIHIsaT1lLmdldEVsZW1lbnRzQnlUYWdOYW1lKHQpWzBdO2lmIChlLmdldEVsZW1lbnRCeUlkKG4pKXtyZXR1cm59cj1lLmNyZWF0ZUVsZW1lbnQodCk7ci5pZD1uO3Iuc3JjPScvL2Nvbm5lY3QuZmFjZWJvb2submV0L2VuX1VTL2FsbC5qcyc7aS5wYXJlbnROb2RlLmluc2VydEJlZm9yZShyLGkpfSkoZG9jdW1lbnQsJ3NjcmlwdCcsJ2ZhY2Vib29rLWpzc2RrJyk7YDtcblxuICAgICAgbGV0IGZiUm9vdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgZmJSb290LmlkID0gJ2ZiLXJvb3QnO1xuXG4gICAgICB0aGlzLmVsLmJvZHkuYXBwZW5kQ2hpbGQoZmJSb290KTtcbiAgICAgIHRoaXMuZWwuYm9keS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9ob29rXG4gICAqIEBkZXNjcmlwdGlvbiBIb29rIGhlbHBlciBmdW5jdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gICB0eXBlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgIG5ldHdvcmtcbiAgICogQHBhcmFtIHtET01Ob2RlfSAgaW5zdGFuY2VcbiAgICovXG4gIF9ob29rKHR5cGUsIG5ldHdvcmssIGluc3RhbmNlKSB7XG4gICAgbGV0IGZuID0gdGhpcy5jb25maWcubmV0d29ya3NbbmV0d29ya11bdHlwZV07XG5cbiAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBsZXQgb3B0cyA9IGZuLmNhbGwodGhpcy5jb25maWcubmV0d29ya3NbbmV0d29ya10sIGluc3RhbmNlKTtcblxuICAgICAgaWYgKG9wdHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBvcHRzID0gdGhpcy5fbm9ybWFsaXplRmlsdGVyQ29uZmlnVXBkYXRlcyhvcHRzKTtcbiAgICAgICAgdGhpcy5leHRlbmQodGhpcy5jb25maWcubmV0d29ya3NbbmV0d29ya10sIG9wdHMsIHRydWUpO1xuICAgICAgICB0aGlzLl9ub3JtYWxpemVOZXR3b3JrQ29uZmlndXJhdGlvbigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9kZWZhdWx0VGl0bGVcbiAgICogQGRlc2NyaXB0aW9uIEdldHMgZGVmYXVsdCB0aXRsZVxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgKi9cbiAgX2RlZmF1bHRUaXRsZSgpIHtcbiAgICBsZXQgY29udGVudDtcbiAgICBpZiAoKGNvbnRlbnQgPSAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtwcm9wZXJ0eT1cIm9nOnRpdGxlXCJdJykgfHxcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cInR3aXR0ZXI6dGl0bGVcIl0nKSkpKVxuICAgICAgcmV0dXJuIGNvbnRlbnQuZ2V0QXR0cmlidXRlKCdjb250ZW50Jyk7XG4gICAgZWxzZSBpZiAoKGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCd0aXRsZScpKSlcbiAgICAgIHJldHVybiBjb250ZW50LnRleHRDb250ZW50IHx8IGNvbnRlbnQuaW5uZXJUZXh0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2RlZmF1bHRJbWFnZVxuICAgKiBAZGVzY3JpcHRpb24gR2V0cyBkZWZhdWx0IGltYWdlXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAqL1xuICBfZGVmYXVsdEltYWdlKCkge1xuICAgIGxldCBjb250ZW50O1xuICAgIGlmICgoY29udGVudCA9IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW3Byb3BlcnR5PVwib2c6aW1hZ2VcIl0nKSB8fFxuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJ0d2l0dGVyOmltYWdlXCJdJykpKSlcbiAgICAgIHJldHVybiBjb250ZW50LmdldEF0dHJpYnV0ZSgnY29udGVudCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2RlZmF1bHREZXNjcmlwdGlvblxuICAgKiBAZGVzY3JpcHRpb24gR2V0cyBkZWZhdWx0IGRlc2NyaXB0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAqL1xuICBfZGVmYXVsdERlc2NyaXB0aW9uKCkge1xuICAgIGxldCBjb250ZW50O1xuICAgIGlmICgoY29udGVudCA9IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW3Byb3BlcnR5PVwib2c6ZGVzY3JpcHRpb25cIl0nKSB8fFxuICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPVwidHdpdHRlcjpkZXNjcmlwdGlvblwiXScpIHx8XG4gICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJkZXNjcmlwdGlvblwiXScpKSkpXG4gICAgICByZXR1cm4gY29udGVudC5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnKTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gJyc7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZGV0ZWN0TmV0d29ya3NcbiAgICogQGRlc2NyaXB0aW9uIERldGVjdCBudW1iZXIgb2YgbmV0d29ya3MgaW4gdXNlIGFuZCBkaXNwbGF5L2hpZGVcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kZXRlY3ROZXR3b3JrcygpIHtcbiAgICAvLyBVcGRhdGUgbmV0d29yay1zcGVjaWZpYyBjb25maWd1cmF0aW9uIHdpdGggZ2xvYmFsIGNvbmZpZ3VyYXRpb25zXG4gICAgZm9yIChsZXQgbmV0d29yayBvZiBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5uZXR3b3JrcykpIHtcbiAgICAgIGxldCBkaXNwbGF5O1xuICAgICAgZm9yIChsZXQgb3B0aW9uIG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLm5ldHdvcmtzW25ldHdvcmtdKSkge1xuICAgICAgICBpZiAodGhpcy5jb25maWcubmV0d29ya3NbbmV0d29ya11bb3B0aW9uXSA9PT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzW25ldHdvcmtdW29wdGlvbl0gPSB0aGlzLmNvbmZpZ1tvcHRpb25dO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIGZvciBlbmFibGVkIG5ldHdvcmtzIGFuZCBkaXNwbGF5IHRoZW1cbiAgICAgIGlmICh0aGlzLmNvbmZpZy5uZXR3b3Jrc1tuZXR3b3JrXS5lbmFibGVkKSB7XG4gICAgICAgIHRoaXMuY2xhc3MgPSAnZW5hYmxlZCc7XG4gICAgICAgIHRoaXMuY29uZmlnLmVuYWJsZWROZXR3b3JrcyArPSAxO1xuICAgICAgfVxuICAgICAgZWxzZVxuICAgICAgICB0aGlzLmNsYXNzID0gJ2Rpc2FibGVkJztcblxuICAgICAgdGhpcy5jb25maWcubmV0d29ya3NbbmV0d29ya10uY2xhc3MgPSB0aGlzLmNsYXNzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9ub3JtYWxpemVOZXR3b3JrQ29uZmlndXJhdGlvblxuICAgKiBAZGVzY3JpcHRpb24gTm9ybWFsaXplcyBuZXR3b3JrIGNvbmZpZ3VyYXRpb24gZm9yIEZhY2Vib29rICYgVHdpdHRlclxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25vcm1hbGl6ZU5ldHdvcmtDb25maWd1cmF0aW9uKCkge1xuICAgIC8vIERvbid0IGxvYWQgRkIgU0RLIGlmIEZCIGFwcElkIGlzbid0IHByZXNlbnRcbiAgICBpZiAoIXRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmFwcElkKVxuICAgICAgdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2subG9hZFNkayA9IGZhbHNlO1xuXG4gICAgLy8gRW5jb2RlIFR3aXR0ZXIgZGVzY3JpcHRpb24gZm9yIFVSTFxuICAgIGlmICghIXRoaXMuY29uZmlnLm5ldHdvcmtzLnR3aXR0ZXIuZGVzY3JpcHRpb24pXG4gICAgICBpZiAoIXRoaXMuX2lzRW5jb2RlZCh0aGlzLmNvbmZpZy5uZXR3b3Jrcy50d2l0dGVyLmRlc2NyaXB0aW9uKSlcbiAgICAgICAgdGhpcy5jb25maWcubmV0d29ya3MudHdpdHRlci5kZXNjcmlwdGlvbiA9XG4gICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHRoaXMuY29uZmlnLm5ldHdvcmtzLnR3aXR0ZXIuZGVzY3JpcHRpb24pO1xuXG4gICAgLy8gVHlwZWNhc3QgRmFjZWJvb2sgYXBwSWQgdG8gYSBTdHJpbmdcbiAgICBpZiAodHlwZW9mIHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmFwcElkID09PSAnbnVtYmVyJylcbiAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmFwcElkID1cbiAgICAgICAgdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suYXBwSWQudG9TdHJpbmcoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9ub3JtYWxpemVGaWx0ZXJDb25maWdVcGRhdGVzXG4gICAqIEBkZXNjcmlwdGlvbiBOb3JtYWxpemVzIEZhY2Vib29rIGNvbmZpZ1xuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0c1xuICAgKiBAcmV0dXJucyB7T2JqZWN0fVxuICAgKi9cbiAgX25vcm1hbGl6ZUZpbHRlckNvbmZpZ1VwZGF0ZXMob3B0cykge1xuICAgIGlmICh0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5hcHBJZCAhPT0gb3B0cy5hcHBJZCkge1xuICAgICAgY29uc29sZS53YXJuKCdZb3UgYXJlIHVuYWJsZSB0byBjaGFuZ2UgdGhlIEZhY2Vib29rIGFwcElkIGFmdGVyIHRoZSBidXR0b24gaGFzIGJlZW4gaW5pdGlhbGl6ZWQuIFBsZWFzZSB1cGRhdGUgeW91ciBGYWNlYm9vayBmaWx0ZXJzIGFjY29yZGluZ2x5LicpO1xuICAgICAgZGVsZXRlKG9wdHMuYXBwSWQpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5sb2FkU2RrICE9PSBvcHRzLmxvYWRTZGspIHtcbiAgICAgIGNvbnNvbGUud2FybignWW91IGFyZSB1bmFibGUgdG8gY2hhbmdlIHRoZSBGYWNlYm9vayBsb2FkU2RrIG9wdGlvbiBhZnRlciB0aGUgYnV0dG9uIGhhcyBiZWVuIGluaXRpYWxpemVkLiBQbGVhc2UgdXBkYXRlIHlvdXIgRmFjZWJvb2sgZmlsdGVycyBhY2NvcmRpbmdseS4nKTtcbiAgICAgIGRlbGV0ZShvcHRzLmFwcElkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0cztcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoYXJlQnV0dG9uO1xuIl19
},{"./share-utils":42,"./string-utils":43,"core-js/fn/array/iterator":1,"core-js/fn/math/trunc":2,"core-js/fn/symbol":3}],42:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _stringUtils = _dereq_('./string-utils');

var _stringUtils2 = _interopRequireDefault(_stringUtils);

/**
 * ShareUtils
 * @class
 * @classdesc A nice set of utilities.
 */

var ShareUtils = (function () {
  function ShareUtils() {
    _classCallCheck(this, ShareUtils);
  }

  _createClass(ShareUtils, [{
    key: "_getStyle",
    value: function _getStyle(ele, css) {
      var strValue = "";

      if (document.defaultView && document.defaultView.getComputedStyle) {
        strValue = document.defaultView.getComputedStyle(ele, "").getPropertyValue(css);
      } else if (ele.currentStyle) {
        css = css.replace(/\-(\w)/g, function (strMatch, p1) {
          return p1.toUpperCase();
        });
        strValue = ele.currentStyle[css];
      }

      return strValue;
    }

    /**
     * @method _hide
     * @description Change element's display to 'none'
     * @private
     *
     * @param {DOMNode} el
     */
  }, {
    key: "_hide",
    value: function _hide(el) {
      el.style.display = "none";
    }

    /**
     * @method _show
     * @description Change element's display to 'block'
     * @private
     *
     * @param {DOMNode} el
     */
  }, {
    key: "_show",
    value: function _show(el) {
      el.style.display = "initial";
    }

    /**
     * @method _hasClass
     * @description Wrapper to see if an element contains a class.
     * @private
     *
     * @param {DOMNode} el
     * @param {String}  className
     * @returns {Boolean}
     */
  }, {
    key: "_hasClass",
    value: function _hasClass(el, className) {
      return el.classList.contains(className);
    }

    /**
     * @method addClass
     * @description Wrapper to add class to element.
     * @private
     *
     * @param {DOMNode} el
     * @param {String}  className
     */
  }, {
    key: "_addClass",
    value: function _addClass(el, className) {
      el.classList.add(className);
    }

    /**
     * @method removeClass
     * @description Wrapper to remove class from element.
     * @private
     *
     * @param {DOMNode} el
     * @param {String}  className
     */
  }, {
    key: "_removeClass",
    value: function _removeClass(el, className) {
      el.classList.remove(className);
    }

    /**
     * @method _isEncoded
     * @description Wrapper to check if the string is encoded.
     * @private
     *
     * @param {String}  str
     * @param {Boolean}
     */
  }, {
    key: "_isEncoded",
    value: function _isEncoded(str) {
      str = _stringUtils2["default"].toRFC3986(str);
      return decodeURIComponent(str) !== str;
    }

    /**
     * @method _encode
     * @description Wrapper to _encode a string if the string isn't already encoded.
     * @private
     *
     * @param {DOMNode} el
     * @param {String}  className
     */
  }, {
    key: "_encode",
    value: function _encode(str) {
      if (typeof str === 'undefined' || str === null || this._isEncoded(str)) return encodeURIComponent(str);else return _stringUtils2["default"].toRFC3986(str);
    }

    /**
     * @method _getUrl
     * @description Returns the correct share URL based off of the incoming
     * URL and parameters given
     * @private
     *
     * @param {String} url
     * @param {boolean} encode
     * @param {Object} params
     */
  }, {
    key: "_getUrl",
    value: function _getUrl(url) {
      var _this = this;

      var encode = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
      var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var qs = (function () {
        var results = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = Object.keys(params)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var k = _step.value;

            var v = params[k];
            results.push(k + "=" + _this._encode(v));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return results.join('&');
      })();

      if (qs) qs = "?" + qs;

      return url + qs;
    }

    /**
     * @method _updateHref
     * @description Makes the elements a tag have a href of the popup link and
     * as pops up the share window for the element
     * @private
     *
     * @param {DOMNode} element
     * @param {String} url
     * @param {Object} params
     */
  }, {
    key: "_updateHref",
    value: function _updateHref(element, url, params) {
      var encode = url.indexOf('mailto:') >= 0;
      var a = element.getElementsByTagName('a')[0];
      a.setAttribute('href', this._getUrl(url, !encode, params));
      if (!encode && (!this.config.networks.facebook.loadSdk || element.getAttribute('class') !== 'facebook')) {
        var popup = {
          width: 500,
          height: 350
        };

        popup.top = screen.height / 2 - popup.height / 2;
        popup.left = screen.width / 2 - popup.width / 2;

        window.open(a.href, 'targetWindow', "\n          toolbar=no,\n          location=no,\n          status=no,\n          menubar=no,\n          scrollbars=yes,\n          resizable=yes,\n          left=" + popup.left + ",\n          top=" + popup.top + ",\n          width=" + popup.width + ",\n          height=" + popup.height + "\n        ");
      }
    }

    /**
     * @method popup
     * @description Create a window for specified network
     *
     * @param {String}  url
     * @param {Object}  params
     */
  }, {
    key: "popup",
    value: function popup(url) {
      var _this2 = this;

      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var popup = {
        width: 500,
        height: 350
      };

      popup.top = screen.height / 2 - popup.height / 2;
      popup.left = screen.width / 2 - popup.width / 2;

      var qs = (function () {
        var results = [];
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.keys(params)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var k = _step2.value;

            var v = params[k];
            results.push(k + "=" + _this2._encode(v));
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        return results.join('&');
      })();

      if (qs) qs = "?" + qs;

      // This does work even though it contains \n once converted.
      window.open(url + qs, 'targetWindow', "\n        toolbar=no,\n        location=no,\n        status=no,\n        menubar=no,\n        scrollbars=yes,\n        resizable=yes,\n        left=" + popup.left + ",\n        top=" + popup.top + ",\n        width=" + popup.width + ",\n        height=" + popup.height + "\n      ");
    }

    /**
     * @method _merge
     * @description Combines two (or more) objects, giving the last one precedence
     * @author svlasov-gists
     * [Original Gist]{@link https://gist.github.com/svlasov-gists/2383751}
     *
     * @param {Object}  target
     * @param {Object}  source
     * @return {Object} target
     */
  }, {
    key: "_merge",
    value: (function (_merge2) {
      function _merge(_x, _x2) {
        return _merge2.apply(this, arguments);
      }

      _merge.toString = function () {
        return _merge2.toString();
      };

      return _merge;
    })(function (target, source) {
      if (typeof target !== 'object') target = {};

      for (var property in source) {
        if (source.hasOwnProperty(property)) {
          var sourceProperty = source[property];

          if (typeof sourceProperty === 'object') {
            target[property] = this._merge(target[property], sourceProperty);
            continue;
          }

          target[property] = sourceProperty;
        }
      }

      for (var a = 2, l = arguments.length; a < l; a++) {
        _merge(target, arguments[a]);
      }return target;
    })

    /**
     * @method _objectToArray
     * @description Takes an Object and converts it into an array of Objects. This is used when converting a list of DOMNodes into an array.
     *
     * @param {Object} obj
     * @returns {Array} arr
     */
  }, {
    key: "_objToArray",
    value: function _objToArray(obj) {
      var arr = [];

      for (var k in obj) {
        if (typeof obj[k] === 'object') arr.push(obj[k]);
      }return arr;
    }

    /**
     * @method _isMobile
     * @description Returns true if current device is mobile (or PhantomJS for
     * testing purposes), and false otherwise
     * @author kriskbx
     * [Original Gist] {@link https://github.com/kriskbx/whatsapp-sharing/blob/master/src/button.js}
     * @private
     */
  }, {
    key: "_isMobile",
    value: function _isMobile() {
      return navigator.userAgent.match(/Android|iPhone|PhantomJS/i) && !navigator.userAgent.match(/iPod|iPad/i);
    }
  }]);

  return ShareUtils;
})();

exports["default"] = ShareUtils;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tZWRpYS9yeWFuL3N0dWZmL3NoYXJlLWJ1dHRvbi9zcmMvc2hhcmUtdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzJCQUF3QixnQkFBZ0I7Ozs7Ozs7Ozs7SUFPbEMsVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FDTCxtQkFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQ2xCLFVBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsVUFBSSxRQUFRLENBQUMsV0FBVyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7QUFDakUsZ0JBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FDdEQsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDMUIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxZQUFZLEVBQUU7QUFDM0IsV0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFVBQVUsUUFBUSxFQUFFLEVBQUUsRUFBRTtBQUNuRCxpQkFBTyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDekIsQ0FBQyxDQUFDO0FBQ0gsZ0JBQVEsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2xDOztBQUVELGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7Ozs7Ozs7OztXQVNJLGVBQUMsRUFBRSxFQUFFO0FBQ1IsUUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0tBQzNCOzs7Ozs7Ozs7OztXQVNJLGVBQUMsRUFBRSxFQUFFO0FBQ1IsUUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0tBQzlCOzs7Ozs7Ozs7Ozs7O1dBV1EsbUJBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRTtBQUN2QixhQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNB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Ozs7O1dBVVEscUJBQUc7QUFDVixhQUFPLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDLElBQ3RELENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDakQ7OztTQWxSRyxVQUFVOzs7cUJBcVJELFVBQVUiLCJmaWxlIjoiL21lZGlhL3J5YW4vc3R1ZmYvc2hhcmUtYnV0dG9uL3NyYy9zaGFyZS11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTdHJpbmdVdGlscyBmcm9tICcuL3N0cmluZy11dGlscyc7XG5cbi8qKlxuICogU2hhcmVVdGlsc1xuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjIEEgbmljZSBzZXQgb2YgdXRpbGl0aWVzLlxuICovXG5jbGFzcyBTaGFyZVV0aWxzIHtcbiAgX2dldFN0eWxlKGVsZSwgY3NzKSB7XG4gICAgdmFyIHN0clZhbHVlID0gXCJcIjtcblxuICAgIGlmIChkb2N1bWVudC5kZWZhdWx0VmlldyAmJiBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKSB7XG4gICAgICBzdHJWYWx1ZSA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZWxlLCBcIlwiKVxuICAgICAgICAuZ2V0UHJvcGVydHlWYWx1ZShjc3MpO1xuICAgIH0gZWxzZSBpZiAoZWxlLmN1cnJlbnRTdHlsZSkge1xuICAgICAgY3NzID0gY3NzLnJlcGxhY2UoL1xcLShcXHcpL2csIGZ1bmN0aW9uIChzdHJNYXRjaCwgcDEpIHtcbiAgICAgICAgcmV0dXJuIHAxLnRvVXBwZXJDYXNlKCk7XG4gICAgICB9KTtcbiAgICAgIHN0clZhbHVlID0gZWxlLmN1cnJlbnRTdHlsZVtjc3NdO1xuICAgIH1cblxuICAgIHJldHVybiBzdHJWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9oaWRlXG4gICAqIEBkZXNjcmlwdGlvbiBDaGFuZ2UgZWxlbWVudCdzIGRpc3BsYXkgdG8gJ25vbmUnXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gZWxcbiAgICovXG4gIF9oaWRlKGVsKSB7XG4gICAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX3Nob3dcbiAgICogQGRlc2NyaXB0aW9uIENoYW5nZSBlbGVtZW50J3MgZGlzcGxheSB0byAnYmxvY2snXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gZWxcbiAgICovXG4gIF9zaG93KGVsKSB7XG4gICAgZWwuc3R5bGUuZGlzcGxheSA9IFwiaW5pdGlhbFwiO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2hhc0NsYXNzXG4gICAqIEBkZXNjcmlwdGlvbiBXcmFwcGVyIHRvIHNlZSBpZiBhbiBlbGVtZW50IGNvbnRhaW5zIGEgY2xhc3MuXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gZWxcbiAgICogQHBhcmFtIHtTdHJpbmd9ICBjbGFzc05hbWVcbiAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAqL1xuICBfaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGFkZENsYXNzXG4gICAqIEBkZXNjcmlwdGlvbiBXcmFwcGVyIHRvIGFkZCBjbGFzcyB0byBlbGVtZW50LlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgY2xhc3NOYW1lXG4gICAqL1xuICBfYWRkQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHJlbW92ZUNsYXNzXG4gICAqIEBkZXNjcmlwdGlvbiBXcmFwcGVyIHRvIHJlbW92ZSBjbGFzcyBmcm9tIGVsZW1lbnQuXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gZWxcbiAgICogQHBhcmFtIHtTdHJpbmd9ICBjbGFzc05hbWVcbiAgICovXG4gIF9yZW1vdmVDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2lzRW5jb2RlZFxuICAgKiBAZGVzY3JpcHRpb24gV3JhcHBlciB0byBjaGVjayBpZiB0aGUgc3RyaW5nIGlzIGVuY29kZWQuXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgc3RyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn1cbiAgICovXG4gIF9pc0VuY29kZWQoc3RyKSB7XG4gICAgc3RyID0gU3RyaW5nVXRpbHMudG9SRkMzOTg2KHN0cik7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpICE9PSBzdHI7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZW5jb2RlXG4gICAqIEBkZXNjcmlwdGlvbiBXcmFwcGVyIHRvIF9lbmNvZGUgYSBzdHJpbmcgaWYgdGhlIHN0cmluZyBpc24ndCBhbHJlYWR5IGVuY29kZWQuXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gZWxcbiAgICogQHBhcmFtIHtTdHJpbmd9ICBjbGFzc05hbWVcbiAgICovXG4gIF9lbmNvZGUoc3RyKSB7XG4gICAgaWYgKHR5cGVvZiBzdHIgPT09ICd1bmRlZmluZWQnIHx8IHN0ciA9PT0gbnVsbCB8fCB0aGlzLl9pc0VuY29kZWQoc3RyKSlcbiAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoc3RyKTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gU3RyaW5nVXRpbHMudG9SRkMzOTg2KHN0cik7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZ2V0VXJsXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIHRoZSBjb3JyZWN0IHNoYXJlIFVSTCBiYXNlZCBvZmYgb2YgdGhlIGluY29taW5nXG4gICAqIFVSTCBhbmQgcGFyYW1ldGVycyBnaXZlblxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7Ym9vbGVhbn0gZW5jb2RlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICovXG4gIF9nZXRVcmwodXJsLCBlbmNvZGU9ZmFsc2UsIHBhcmFtcz17fSkge1xuICAgIGxldCBxcyA9ICgoKSA9PiB7XG4gICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChsZXQgayBvZiBPYmplY3Qua2V5cyhwYXJhbXMpKSB7XG4gICAgICAgIGxldCB2ID0gcGFyYW1zW2tdO1xuICAgICAgICByZXN1bHRzLnB1c2goYCR7a309JHt0aGlzLl9lbmNvZGUodil9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cy5qb2luKCcmJyk7XG4gICAgfSkoKTtcblxuICAgIGlmIChxcykgcXMgPSBgPyR7cXN9YDtcblxuICAgIHJldHVybiB1cmwgKyBxcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF91cGRhdGVIcmVmXG4gICAqIEBkZXNjcmlwdGlvbiBNYWtlcyB0aGUgZWxlbWVudHMgYSB0YWcgaGF2ZSBhIGhyZWYgb2YgdGhlIHBvcHVwIGxpbmsgYW5kXG4gICAqIGFzIHBvcHMgdXAgdGhlIHNoYXJlIHdpbmRvdyBmb3IgdGhlIGVsZW1lbnRcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtET01Ob2RlfSBlbGVtZW50XG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgKi9cbiAgX3VwZGF0ZUhyZWYoZWxlbWVudCwgdXJsLCBwYXJhbXMpIHtcbiAgICBsZXQgZW5jb2RlID0gdXJsLmluZGV4T2YoJ21haWx0bzonKSA+PSAwO1xuICAgIGxldCBhID0gZWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYScpWzBdO1xuICAgIGEuc2V0QXR0cmlidXRlKCdocmVmJywgdGhpcy5fZ2V0VXJsKHVybCwgIWVuY29kZSwgcGFyYW1zKSk7XG4gICAgaWYoIWVuY29kZSAmJiAoIXRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmxvYWRTZGsgfHwgZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykgIT09ICdmYWNlYm9vaycpKSB7XG4gICAgICBsZXQgcG9wdXAgPSB7XG4gICAgICAgIHdpZHRoOiA1MDAsXG4gICAgICAgIGhlaWdodDogMzUwXG4gICAgICB9O1xuXG4gICAgICBwb3B1cC50b3AgPSAoc2NyZWVuLmhlaWdodCAvIDIpIC0gKHBvcHVwLmhlaWdodCAvIDIpO1xuICAgICAgcG9wdXAubGVmdCA9IChzY3JlZW4ud2lkdGggLyAyKSAgLSAocG9wdXAud2lkdGggLyAyKTtcblxuICAgICAgd2luZG93Lm9wZW4oXG4gICAgICAgIGEuaHJlZixcbiAgICAgICAgJ3RhcmdldFdpbmRvdycsIGBcbiAgICAgICAgICB0b29sYmFyPW5vLFxuICAgICAgICAgIGxvY2F0aW9uPW5vLFxuICAgICAgICAgIHN0YXR1cz1ubyxcbiAgICAgICAgICBtZW51YmFyPW5vLFxuICAgICAgICAgIHNjcm9sbGJhcnM9eWVzLFxuICAgICAgICAgIHJlc2l6YWJsZT15ZXMsXG4gICAgICAgICAgbGVmdD0ke3BvcHVwLmxlZnR9LFxuICAgICAgICAgIHRvcD0ke3BvcHVwLnRvcH0sXG4gICAgICAgICAgd2lkdGg9JHtwb3B1cC53aWR0aH0sXG4gICAgICAgICAgaGVpZ2h0PSR7cG9wdXAuaGVpZ2h0fVxuICAgICAgICBgXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHBvcHVwXG4gICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgYSB3aW5kb3cgZm9yIHNwZWNpZmllZCBuZXR3b3JrXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgdXJsXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAgcGFyYW1zXG4gICAqL1xuICBwb3B1cCh1cmwsIHBhcmFtcz17fSkge1xuICAgIGxldCBwb3B1cCA9IHtcbiAgICAgIHdpZHRoOiA1MDAsXG4gICAgICBoZWlnaHQ6IDM1MFxuICAgIH07XG5cbiAgICBwb3B1cC50b3AgPSAoc2NyZWVuLmhlaWdodCAvIDIpIC0gKHBvcHVwLmhlaWdodCAvIDIpO1xuICAgIHBvcHVwLmxlZnQgPSAoc2NyZWVuLndpZHRoIC8gMikgIC0gKHBvcHVwLndpZHRoIC8gMik7XG5cbiAgICBsZXQgcXMgPSAoKCkgPT4ge1xuICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAobGV0IGsgb2YgT2JqZWN0LmtleXMocGFyYW1zKSkge1xuICAgICAgICBsZXQgdiA9IHBhcmFtc1trXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGAke2t9PSR7dGhpcy5fZW5jb2RlKHYpfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHMuam9pbignJicpO1xuICAgIH0pKCk7XG5cbiAgICBpZiAocXMpIHFzID0gYD8ke3FzfWA7XG5cbiAgICAvLyBUaGlzIGRvZXMgd29yayBldmVuIHRob3VnaCBpdCBjb250YWlucyBcXG4gb25jZSBjb252ZXJ0ZWQuXG4gICAgd2luZG93Lm9wZW4oXG4gICAgICB1cmwrcXMsXG4gICAgICAndGFyZ2V0V2luZG93JywgYFxuICAgICAgICB0b29sYmFyPW5vLFxuICAgICAgICBsb2NhdGlvbj1ubyxcbiAgICAgICAgc3RhdHVzPW5vLFxuICAgICAgICBtZW51YmFyPW5vLFxuICAgICAgICBzY3JvbGxiYXJzPXllcyxcbiAgICAgICAgcmVzaXphYmxlPXllcyxcbiAgICAgICAgbGVmdD0ke3BvcHVwLmxlZnR9LFxuICAgICAgICB0b3A9JHtwb3B1cC50b3B9LFxuICAgICAgICB3aWR0aD0ke3BvcHVwLndpZHRofSxcbiAgICAgICAgaGVpZ2h0PSR7cG9wdXAuaGVpZ2h0fVxuICAgICAgYFxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfbWVyZ2VcbiAgICogQGRlc2NyaXB0aW9uIENvbWJpbmVzIHR3byAob3IgbW9yZSkgb2JqZWN0cywgZ2l2aW5nIHRoZSBsYXN0IG9uZSBwcmVjZWRlbmNlXG4gICAqIEBhdXRob3Igc3ZsYXNvdi1naXN0c1xuICAgKiBbT3JpZ2luYWwgR2lzdF17QGxpbmsgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vc3ZsYXNvdi1naXN0cy8yMzgzNzUxfVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gIHRhcmdldFxuICAgKiBAcGFyYW0ge09iamVjdH0gIHNvdXJjZVxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHRhcmdldFxuICAgKi9cbiAgX21lcmdlKHRhcmdldCwgc291cmNlKSB7XG4gICAgaWYgKHR5cGVvZiB0YXJnZXQgIT09ICdvYmplY3QnKSB0YXJnZXQgPSB7fTtcblxuICAgIGZvciAobGV0IHByb3BlcnR5IGluIHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eSkpIHtcbiAgICAgICAgbGV0IHNvdXJjZVByb3BlcnR5ID0gc291cmNlW3Byb3BlcnR5XTtcblxuICAgICAgICBpZiAodHlwZW9mIHNvdXJjZVByb3BlcnR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHRhcmdldFtwcm9wZXJ0eV0gPSB0aGlzLl9tZXJnZSh0YXJnZXRbcHJvcGVydHldLCBzb3VyY2VQcm9wZXJ0eSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gc291cmNlUHJvcGVydHk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChsZXQgYSA9IDIsIGwgPSBhcmd1bWVudHMubGVuZ3RoOyBhIDwgbDsgYSsrKVxuICAgICAgX21lcmdlKHRhcmdldCwgYXJndW1lbnRzW2FdKTtcblxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfb2JqZWN0VG9BcnJheVxuICAgKiBAZGVzY3JpcHRpb24gVGFrZXMgYW4gT2JqZWN0IGFuZCBjb252ZXJ0cyBpdCBpbnRvIGFuIGFycmF5IG9mIE9iamVjdHMuIFRoaXMgaXMgdXNlZCB3aGVuIGNvbnZlcnRpbmcgYSBsaXN0IG9mIERPTU5vZGVzIGludG8gYW4gYXJyYXkuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmpcbiAgICogQHJldHVybnMge0FycmF5fSBhcnJcbiAgICovXG4gIF9vYmpUb0FycmF5KG9iaikge1xuICAgIGxldCBhcnIgPSBbXTtcblxuICAgIGZvciAobGV0IGsgaW4gb2JqKVxuICAgICAgaWYgKHR5cGVvZiBvYmpba10gPT09ICdvYmplY3QnKSBhcnIucHVzaChvYmpba10pO1xuXG4gICAgcmV0dXJuIGFycjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9pc01vYmlsZVxuICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyB0cnVlIGlmIGN1cnJlbnQgZGV2aWNlIGlzIG1vYmlsZSAob3IgUGhhbnRvbUpTIGZvclxuICAgKiB0ZXN0aW5nIHB1cnBvc2VzKSwgYW5kIGZhbHNlIG90aGVyd2lzZVxuICAgKiBAYXV0aG9yIGtyaXNrYnhcbiAgICogW09yaWdpbmFsIEdpc3RdIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20va3Jpc2tieC93aGF0c2FwcC1zaGFyaW5nL2Jsb2IvbWFzdGVyL3NyYy9idXR0b24uanN9XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaXNNb2JpbGUoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL0FuZHJvaWR8aVBob25lfFBoYW50b21KUy9pKSAmJlxuICAgICAgICAgICAhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBvZHxpUGFkL2kpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlVXRpbHM7XG4iXX0=
},{"./string-utils":43}],43:[function(_dereq_,module,exports){
/**
 * StringUtils
 * @class
 * @classdesc String utilities.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StringUtils = (function () {
  function StringUtils() {
    _classCallCheck(this, StringUtils);
  }

  _createClass(StringUtils, null, [{
    key: "toRFC3986",

    /**
     * @method toRFC3986
     * @description Encodes the string in RFC3986
     *
     * @param {String}
     * @return {String}
     */
    value: function toRFC3986(s) {
      var tmp = encodeURIComponent(s);
      tmp.replace(/[!'()*]/g, function (c) {
        return "%" + c.charCodeAt(0).toString(16);
      });
    }

    /**
     * @method capFLetter
     * @description Returns a capitalized version of the string
     *
     * @param {String}
     * @return {String}
     */
  }, {
    key: "capFLetter",
    value: function capFLetter(s) {
      return s.charAt(0).toUpperCase() + s.slice(1);
    }
  }]);

  return StringUtils;
})();

exports["default"] = StringUtils;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tZWRpYS9yeWFuL3N0dWZmL3NoYXJlLWJ1dHRvbi9zcmMvc3RyaW5nLXV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztJQUtNLFdBQVc7V0FBWCxXQUFXOzBCQUFYLFdBQVc7OztlQUFYLFdBQVc7Ozs7Ozs7Ozs7V0FRQyxtQkFBQyxDQUFDLEVBQUU7QUFDbEIsVUFBSSxHQUFHLEdBQUcsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEMsU0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDbEMscUJBQVcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUc7T0FDM0MsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7Ozs7O1dBU2dCLG9CQUFDLENBQUMsRUFBRTtBQUNuQixhQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvQzs7O1NBeEJHLFdBQVc7OztxQkEyQkYsV0FBVyIsImZpbGUiOiIvbWVkaWEvcnlhbi9zdHVmZi9zaGFyZS1idXR0b24vc3JjL3N0cmluZy11dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogU3RyaW5nVXRpbHNcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBTdHJpbmcgdXRpbGl0aWVzLlxuICovXG5jbGFzcyBTdHJpbmdVdGlscyB7XG4gIC8qKlxuICAgKiBAbWV0aG9kIHRvUkZDMzk4NlxuICAgKiBAZGVzY3JpcHRpb24gRW5jb2RlcyB0aGUgc3RyaW5nIGluIFJGQzM5ODZcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9XG4gICAqIEByZXR1cm4ge1N0cmluZ31cbiAgICovXG4gIHN0YXRpYyB0b1JGQzM5ODYocykge1xuICAgIGxldCB0bXAgPSBlbmNvZGVVUklDb21wb25lbnQocyk7XG4gICAgdG1wLnJlcGxhY2UoL1shJygpKl0vZywgZnVuY3Rpb24oYykge1xuICAgICAgcmV0dXJuIGAlJHtjLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpfWA7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBjYXBGTGV0dGVyXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIGEgY2FwaXRhbGl6ZWQgdmVyc2lvbiBvZiB0aGUgc3RyaW5nXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfVxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XG4gICAqL1xuICBzdGF0aWMgY2FwRkxldHRlcihzKSB7XG4gICAgcmV0dXJuIHMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBzLnNsaWNlKDEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0cmluZ1V0aWxzO1xuIl19
},{}]},{},[41])
(41)
});