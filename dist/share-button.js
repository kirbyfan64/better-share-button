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

      ui: {
        flyout: 'sb-top sb-center',
        buttonText: 'Share',
        namespace: 'sb-',
        networkOrder: [],
        collision: false,
        updateShareButtonSize: true
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

      if (typeof element === 'undefined') instances = _get(Object.getPrototypeOf(ShareButton.prototype), '_objToArray', this).call(this, document.getElementsByTagName('share-button'));else instances = document.querySelectorAll(element);

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

      if (typeof element === 'undefined') instances = _get(Object.getPrototypeOf(ShareButton.prototype), '_objToArray', this).call(this, document.getElementsByTagName('share-button'));else {
        instances = document.querySelectorAll('share-button' + element);
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
     * @param {DOMNode} element
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

            if (network.className !== 'email') a.setAttribute('onclick', 'return false');

            a.addEventListener('mousedown', function () {
              _this._hook('before', name, instance);
            });
            a.addEventListener('mouseup', function () {
              _this['_network' + name.capFLetter()](network);
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
     * @param {DOMNode} label
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
        if (!window.FB) return console.error('The Facebook JS SDK hasn\'t loaded yet.');
        this._updateHref(element, 'https://www.facebook.com/sharer/sharer.php', {
          u: this.config.networks.facebook.url
        });
        return FB.ui({
          method: 'feed',
          name: this.config.networks.facebook.title,
          link: this.config.networks.facebook.url,
          picture: this.config.networks.facebook.image,
          caption: this.config.networks.facebook.caption,
          description: this.config.networks.facebook.description
        });
      } else return this._updateHref(element, 'https://www.facebook.com/sharer/sharer.php', {
        u: this.config.networks.facebook.url
      });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tZWRpYS9yeWFuL3N0dWZmL3NoYXJlLWJ1dHRvbi9zcmMvc2hhcmUtYnV0dG9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzswQkFHdUIsZUFBZTs7Ozs7Ozs7Ozs7OztBQUh0QyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM3QixPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUNyQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7SUFZM0IsV0FBVztZQUFYLFdBQVc7O0FBQ0osV0FEUCxXQUFXLENBQ0gsT0FBTyxFQUFFLE9BQU8sRUFBRTswQkFEMUIsV0FBVzs7QUFFYiwrQkFGRSxXQUFXLDZDQUVMOztBQUVSLFFBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO0FBQy9CLFVBQUksQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQ3pCLGFBQU8sR0FBRyxPQUFPLENBQUM7S0FDbkIsTUFDQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFFekIsUUFBSSxDQUFDLEVBQUUsR0FBRztBQUNSLFVBQUksRUFBRSxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlDLFVBQUksRUFBRSxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQy9DLENBQUM7O0FBRUYsUUFBSSxDQUFDLE1BQU0sR0FBRztBQUNaLHFCQUFlLEVBQUUsQ0FBQztBQUNsQixjQUFRLEVBQUUsSUFBSTtBQUNkLFNBQUcsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUk7QUFDekIsYUFBTyxFQUFFLElBQUk7QUFDYixXQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUMzQixXQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWEsRUFBRTtBQUMzQixpQkFBVyxFQUFFLElBQUksQ0FBQyxtQkFBbUIsRUFBRTs7QUFFdkMsUUFBRSxFQUFFO0FBQ0YsY0FB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QUM7QUFDcEosZUFBTyxJQUFJLENBQUMsS0FBSyxBQUFDLENBQUM7T0FDcEI7O0FBRUQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDMUQsZUFBTyxDQUFDLElBQUksQ0FBQyw4SUFBOEksQ0FBQyxDQUFDO0FBQzdKLGVBQU8sSUFBSSxDQUFDLEtBQUssQUFBQyxDQUFDO09BQ3BCOztBQUVELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztTQTN3QkcsV0FBVzs7O0FBOHdCakIsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiL21lZGlhL3J5YW4vc3R1ZmYvc2hhcmUtYnV0dG9uL3NyYy9zaGFyZS1idXR0b24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCdjb3JlLWpzL2ZuL3N5bWJvbCcpO1xucmVxdWlyZSgnY29yZS1qcy9mbi9hcnJheS9pdGVyYXRvcicpO1xucmVxdWlyZSgnY29yZS1qcy9mbi9tYXRoL3RydW5jJyk7XG5pbXBvcnQgU2hhcmVVdGlscyBmcm9tICcuL3NoYXJlLXV0aWxzJztcblxuLyoqXG4gKiBTaGFyZWJ1dHRvblxuICogQGNsYXNzXG4gKiBAY2xhc3NkZXNjXG4gKiBAZXh0ZW5kcyBTaGFyZVV0aWxzXG5cbiAqIEBwYXJhbSB7U3RyaW5nfSBlbGVtZW50XG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICovXG5jbGFzcyBTaGFyZUJ1dHRvbiBleHRlbmRzIFNoYXJlVXRpbHMge1xuICBjb25zdHJ1Y3RvcihlbGVtZW50LCBvcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIHRoaXMuZWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICAgIG9wdGlvbnMgPSBlbGVtZW50O1xuICAgIH0gZWxzZVxuICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcblxuICAgIHRoaXMuZWwgPSB7XG4gICAgICBoZWFkOiBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLFxuICAgICAgYm9keTogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2JvZHknKVswXVxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZyA9IHtcbiAgICAgIGVuYWJsZWROZXR3b3JrczogMCxcbiAgICAgIHByb3RvY29sOiAnLy8nLFxuICAgICAgdXJsOiB3aW5kb3cubG9jYXRpb24uaHJlZixcbiAgICAgIGNhcHRpb246IG51bGwsXG4gICAgICB0aXRsZTogdGhpcy5fZGVmYXVsdFRpdGxlKCksXG4gICAgICBpbWFnZTogdGhpcy5fZGVmYXVsdEltYWdlKCksXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5fZGVmYXVsdERlc2NyaXB0aW9uKCksXG5cbiAgICAgIHVpOiB7XG4gICAgICAgIGZseW91dDogJ3NiLXRvcCBzYi1jZW50ZXInLFxuICAgICAgICBidXR0b25UZXh0OiAnU2hhcmUnLFxuICAgICAgICBuYW1lc3BhY2U6ICdzYi0nLFxuICAgICAgICBuZXR3b3JrT3JkZXI6IFtdLFxuICAgICAgICBjb2xsaXNpb246IGZhbHNlLFxuICAgICAgICB1cGRhdGVTaGFyZUJ1dHRvblNpemU6IHRydWVcbiAgICAgIH0sXG5cbiAgICAgIG5ldHdvcmtzOiB7XG4gICAgICAgIGdvb2dsZVBsdXM6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHVybDogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB0d2l0dGVyOiB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB1cmw6IG51bGwsXG4gICAgICAgICAgZGVzY3JpcHRpb246IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgZmFjZWJvb2s6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIGxvYWRTZGs6IHRydWUsXG4gICAgICAgICAgdXJsOiBudWxsLFxuICAgICAgICAgIGFwcElkOiBudWxsLFxuICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgIGNhcHRpb246IG51bGwsXG4gICAgICAgICAgZGVzY3JpcHRpb246IG51bGwsXG4gICAgICAgICAgaW1hZ2U6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgcGludGVyZXN0OiB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB1cmw6IG51bGwsXG4gICAgICAgICAgaW1hZ2U6IG51bGwsXG4gICAgICAgICAgZGVzY3JpcHRpb246IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgcmVkZGl0OiB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB1cmw6IG51bGwsXG4gICAgICAgICAgdGl0bGU6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgbGlua2VkaW46IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB3aGF0c2FwcDoge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgZGVzY3JpcHRpb246IG51bGwsXG4gICAgICAgICAgdXJsOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIGVtYWlsOiB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICB0aXRsZTogbnVsbCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogbnVsbFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMubGlzdGVuZXIgPSBudWxsO1xuICAgIHRoaXMuX3NldHVwKHRoaXMuZWxlbWVudCwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBvcGVuXG4gICAqIEBkZXNjcmlwdGlvbiBPcGVucyBTaGFyZSBCdXR0b25cbiAgICovXG4gIG9wZW4oKSB7IHRoaXMuX3B1YmxpYygnT3BlbicpOyB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgY2xvc2VcbiAgICogQGRlc2NyaXB0aW9uIENwZW5zIFNoYXJlIEJ1dHRvblxuICAgKi9cbiAgY2xvc2UoKSB7IHRoaXMuX3B1YmxpYygnQ2xvc2UnKTsgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHRvZ2dsZVxuICAgKiBAZGVzY3JpcHRpb24gVG9nZ2xlcyBTaGFyZSBCdXR0b25cbiAgICovXG4gIHRvZ2dsZSgpIHsgdGhpcy5fcHVibGljKCdUb2dnbGUnKTsgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHRvZ2dsZUxpc3RlblxuICAgKiBAZGVzY3JpcHRpb24gVG9nZ2xlcyB0aGUgU2hhcmUgQnV0dG9uIGxpc3RlbmVyLCBnb29kIGZvciB1cGRhaW5nIHNoYXJlXG4gICAqIGJ1dHRvbiBmb3IgQ1NTIGFuaW1hdGlvbnMuXG4gICAqL1xuICB0b2dnbGVMaXN0ZW4oKSB7IHRoaXMuX3B1YmxpYygnTGlzdGVuJyk7IH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfcHVibGljXG4gICAqIEBkZXNjcmlwdGlvbiBFeGVjdXRlcyBhY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGFjdGlvblxuICAgKi9cbiAgX3B1YmxpYyhhY3Rpb24pIHtcbiAgICBsZXQgaW5zdGFuY2VzO1xuXG4gICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJylcbiAgICAgIGluc3RhbmNlcyA9XG4gICAgICAgIHN1cGVyLl9vYmpUb0FycmF5KGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzaGFyZS1idXR0b24nKSk7XG4gICAgZWxzZVxuICAgICAgaW5zdGFuY2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtZW50KTtcblxuICAgIGZvciAobGV0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xuICAgICAgbGV0IG5ldHdvcmtzID1cbiAgICAgICAgaW5zdGFuY2UuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9c29jaWFsYClbMF07XG4gICAgICB0aGlzW2BfZXZlbnQke2FjdGlvbn1gXShpbnN0YW5jZSwgbmV0d29ya3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9zZXR1cFxuICAgKiBAZGVzY3JpcHRpb24gU2V0cyB1cCBTaGFyZSBCdXR0b25cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnQgc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICovXG4gIF9zZXR1cChlbGVtZW50LCBvcHRzKSB7XG4gICAgbGV0IGluc3RhbmNlcztcblxuICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3VuZGVmaW5lZCcpXG4gICAgICBpbnN0YW5jZXMgPVxuICAgICAgICBzdXBlci5fb2JqVG9BcnJheShkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2hhcmUtYnV0dG9uJykpO1xuICAgIGVsc2Uge1xuICAgICAgaW5zdGFuY2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgc2hhcmUtYnV0dG9uJHtlbGVtZW50fWApO1xuICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZXMgPT09ICdvYmplY3QnKVxuICAgICAgICBpbnN0YW5jZXMgPSBzdXBlci5fb2JqVG9BcnJheShpbnN0YW5jZXMpO1xuICAgIH1cblxuICAgIC8vIEFkZGluZyB1c2VyIGNvbmZpZ3MgdG8gZGVmYXVsdCBjb25maWdzXG4gICAgdGhpcy5fbWVyZ2UodGhpcy5jb25maWcsIG9wdHMpO1xuXG4gICAgLy8gRGlzYWJsZSB3aGF0c2FwcCBkaXNwbGF5IGlmIG5vdCBhIG1vYmlsZSBkZXZpY2VcbiAgICBpZiAodGhpcy5jb25maWcubmV0d29ya3Mud2hhdHNhcHAuZW5hYmxlZCAmJiAhdGhpcy5faXNNb2JpbGUoKSlcbiAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzLndoYXRzYXBwLmVuYWJsZWQgPSBmYWxzZTtcblxuICAgIC8vIERlZmF1bHQgb3JkZXIgb2YgbmV0d29ya3MgaWYgbm8gbmV0d29yayBvcmRlciBlbnRlcmVkXG4gICAgaWYgKHRoaXMuY29uZmlnLnVpLm5ldHdvcmtPcmRlci5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLmNvbmZpZy51aS5uZXR3b3JrT3JkZXIgPSBbXG4gICAgICAgICdwaW50ZXJlc3QnLFxuICAgICAgICAndHdpdHRlcicsXG4gICAgICAgICdmYWNlYm9vaycsXG4gICAgICAgICd3aGF0c2FwcCcsXG4gICAgICAgICdnb29nbGVQbHVzJyxcbiAgICAgICAgJ3JlZGRpdCcsXG4gICAgICAgICdsaW5rZWRpbicsXG4gICAgICAgICdlbWFpbCdcbiAgICAgIF07XG5cbiAgICBmb3IgKGxldCBuZXR3b3JrIG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLm5ldHdvcmtzKSkge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLnVpLm5ldHdvcmtPcmRlci5pbmRleE9mKG5ldHdvcmsudG9TdHJpbmcoKSkgPCAwKSB7XG4gICAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzW25ldHdvcmtdLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb25maWcudWkubmV0d29ya09yZGVyLnB1c2gobmV0d29yayk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZml4Rmx5b3V0KCk7XG4gICAgdGhpcy5fZGV0ZWN0TmV0d29ya3MoKTtcbiAgICB0aGlzLl9ub3JtYWxpemVOZXR3b3JrQ29uZmlndXJhdGlvbigpO1xuXG4gICAgLy8gSW5qZWN0IEZhY2Vib29rIEpTIFNESyAoaWYgRmFjZWJvb2sgaXMgZW5hYmxlZClcbiAgICBpZiAodGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suZW5hYmxlZCAmJlxuICAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmxvYWRTZGspXG4gICAgICAgdGhpcy5faW5qZWN0RmFjZWJvb2tTZGsoKTtcblxuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2VzXG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBmb3IgKGxldCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcbiAgICAgIHRoaXMuX3NldHVwSW5zdGFuY2UoaW5zdGFuY2UsIGluZGV4KyspO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9zZXR1cEluc3RhbmNlXG4gICAqIEBkZXNjcmlwdGlvbiBTZXRzIHVwIGVhY2ggaW5zdGFuY2Ugd2l0aCBjb25maWcgYW5kIHN0eWxlc1xuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGVsZW1lbnRcbiAgICogQHBhcmFtIHtJbnRlZ2VyfSBpbmRleFxuICAgKi9cbiAgX3NldHVwSW5zdGFuY2UoaW5zdGFuY2UsIGluZGV4KSB7XG4gICAgdGhpcy5faGlkZShpbnN0YW5jZSk7XG5cbiAgICAvLyBBZGQgbmVjZXNzYXJ5IGNsYXNzZXMgdG8gaW5zdGFuY2VcbiAgICAvLyAoTm90ZTogRkYgZG9lc24ndCBzdXBwb3J0IGFkZGluZyBtdWx0aXBsZSBjbGFzc2VzIGluIGEgc2luZ2xlIGNhbGwpXG4gICAgdGhpcy5fYWRkQ2xhc3MoaW5zdGFuY2UsIGBzaGFyZXItJHtpbmRleH1gKTtcbiAgICB0aGlzLl9pbmplY3RIdG1sKGluc3RhbmNlKTtcbiAgICB0aGlzLl9zaG93KGluc3RhbmNlKTtcblxuICAgIGxldCBuZXR3b3Jrc0NvbiA9XG4gICAgICBpbnN0YW5jZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1zb2NpYWxgKVswXTtcbiAgICBsZXQgbmV0d29ya3MgPSBpbnN0YW5jZS5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbGknKTtcblxuICAgIHRoaXMuX2FkZENsYXNzKG5ldHdvcmtzQ29uLCBgbmV0d29ya3MtJHt0aGlzLmNvbmZpZy5lbmFibGVkTmV0d29ya3N9YCk7XG4gICAgaW5zdGFuY2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PlxuICAgICAgdGhpcy5fZXZlbnRUb2dnbGUoaW5zdGFuY2UsIG5ldHdvcmtzQ29uKVxuICAgICk7XG5cbiAgICAvLyBBZGQgbGlzdGVuZXIgdG8gYWN0aXZhdGUgbmV0d29ya3MgYW5kIGNsb3NlIGJ1dHRvblxuICAgIGZvciAobGV0IGsgaW4gT2JqZWN0LmtleXMobmV0d29ya3MpKSB7XG4gICAgICBsZXQgbmV0d29yayA9IG5ldHdvcmtzW2tdO1xuXG4gICAgICBpZiAodHlwZW9mKG5ldHdvcmspICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGxldCBuYW1lID0gbmV0d29yay5nZXRBdHRyaWJ1dGUoJ2RhdGEtbmV0d29yaycpO1xuICAgICAgICBsZXQgYSA9IG5ldHdvcmsuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2EnKVswXTtcblxuICAgICAgICB0aGlzLl9hZGRDbGFzcyhuZXR3b3JrLCB0aGlzLmNvbmZpZy5uZXR3b3Jrc1tuYW1lXS5jbGFzcyk7XG5cbiAgICAgICAgaWYgKG5ldHdvcmsuY2xhc3NOYW1lICE9PSAnZW1haWwnKVxuICAgICAgICAgIGEuc2V0QXR0cmlidXRlKCdvbmNsaWNrJywgJ3JldHVybiBmYWxzZScpO1xuXG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2hvb2soJ2JlZm9yZScsIG5hbWUsIGluc3RhbmNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGEuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsICgpID0+IHtcbiAgICAgICAgICB0aGlzW2BfbmV0d29yayR7bmFtZS5jYXBGTGV0dGVyKCl9YF0obmV0d29yayk7XG4gICAgICAgIH0pO1xuICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2hvb2soJ2FmdGVyJywgbmFtZSwgaW5zdGFuY2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZXZlbnRUb2dnbGVcbiAgICogQGRlc2NyaXB0aW9uIFRvZ2dsZXMgJ2FjdGl2ZScgY2xhc3Mgb24gYnV0dG9uXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gYnV0dG9uXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gbmV0d29ya3NcbiAgICovXG4gIF9ldmVudFRvZ2dsZShidXR0b24sIG5ldHdvcmtzKSB7XG4gICAgaWYgKHRoaXMuX2hhc0NsYXNzKG5ldHdvcmtzLCAnYWN0aXZlJykpXG4gICAgICB0aGlzLl9ldmVudENsb3NlKG5ldHdvcmtzKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9ldmVudE9wZW4oYnV0dG9uLCBuZXR3b3Jrcyk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZXZlbnRPcGVuXG4gICAqIEBkZXNjcmlwdGlvbiBBZGQgJ2FjdGl2ZScgY2xhc3MgJiByZW1vdmUgJ2xvYWQnIGNsYXNzIG9uIGJ1dHRvblxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGJ1dHRvblxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IG5ldHdvcmtzXG4gICAqL1xuICBfZXZlbnRPcGVuKGJ1dHRvbiwgbmV0d29ya3MpIHtcbiAgICBpZiAodGhpcy5faGFzQ2xhc3MobmV0d29ya3MsICdsb2FkJykpXG4gICAgICB0aGlzLl9yZW1vdmVDbGFzcyhuZXR3b3JrcywgJ2xvYWQnKTtcbiAgICBpZiAodGhpcy5jb2xsaXNpb24pXG4gICAgICB0aGlzLl9jb2xsaXNpb25EZXRlY3Rpb24oYnV0dG9uLCBuZXR3b3Jrcyk7XG5cbiAgICB0aGlzLl9hZGRDbGFzcyhuZXR3b3JrcywgJ2FjdGl2ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2V2ZW50Q2xvc2VcbiAgICogQGRlc2NyaXB0aW9uIFJlbW92ZSAnYWN0aXZlJyBjbGFzcyBvbiBidXR0b25cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtET01Ob2RlfSBidXR0b25cbiAgICovXG4gIF9ldmVudENsb3NlKGJ1dHRvbikge1xuICAgIHRoaXMuX3JlbW92ZUNsYXNzKGJ1dHRvbiwgJ2FjdGl2ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2V2ZW50TGlzdGVuXG4gICAqIEBkZXNjcmlwdGlvbiBUb2dnbGVzIHdlYXRoZXIgb3Igbm90IGEgYnV0dG9uJ3MgY2xhc3NlcyBhcmUgYmVpbmdcbiAgICogY29uc3RhbnRseSB1cGRhdGVkIHJlZ2FyZGxlc3Mgb2Ygc2Nyb2xscyBvciB3aW5kb3cgcmVzaXplcy5cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtET01Ob2RlfSBidXR0b25cbiAgICogQHBhcmFtIHtET01Ob2RlfSBuZXR3b3Jrc1xuICAgKi9cbiAgX2V2ZW50TGlzdGVuKGJ1dHRvbiwgbmV0d29ya3MpIHtcbiAgICBsZXQgZGltZW5zaW9ucyA9IHRoaXMuX2dldERpbWVuc2lvbnMoYnV0dG9uLCBuZXR3b3Jrcyk7XG4gICAgaWYgKHRoaXMubGlzdGVuZXIgPT09IG51bGwpXG4gICAgICB0aGlzLmxpc3RlbmVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+XG4gICAgICAgIHRoaXMuX2FkanVzdENsYXNzZXMoYnV0dG9uLCBuZXR3b3JrcywgZGltZW5zaW9ucyksIDEwMFxuICAgICAgKTtcbiAgICBlbHNlIHtcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMubGlzdGVuZXIpO1xuICAgICAgdGhpcy5saXN0ZW5lciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2ZpeEZseW91dFxuICAgKiBAZGVzY3JpcHRpb24gRml4ZXMgdGhlIGZseW91dCBlbnRlcmVkIGJ5IHRoZSB1c2VyIHRvIG1hdGNoIHRoZWlyIHByb3ZpZGVkXG4gICAqIG5hbWVzcGFjZVxuICAgKkBwcml2YXRlXG4gICAqL1xuICBfZml4Rmx5b3V0KCkge1xuICAgIGxldCBmbHlvdXRzID0gdGhpcy5jb25maWcudWkuZmx5b3V0LnNwbGl0KCcgJyk7XG4gICAgaWYgKGZseW91dHNbMF0uc3Vic3RyaW5nKDAsdGhpcy5jb25maWcudWkubmFtZXNwYWNlLmxlbmd0aCkgIT09XG4gICAgICAgdGhpcy5jb25maWcudWkubmFtZXNwYWNlKVxuICAgICAgZmx5b3V0c1swXSA9IGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX0ke2ZseW91dHNbMF19YDtcbiAgICBpZiAoZmx5b3V0c1sxXS5zdWJzdHJpbmcoMCx0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2UubGVuZ3RoKSAhPT1cbiAgICAgICB0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2UpXG4gICAgICBmbHlvdXRzWzFdID0gYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfSR7Zmx5b3V0c1sxXX1gO1xuICAgIHRoaXMuY29uZmlnLnVpLmZseW91dCA9IGZseW91dHMuam9pbignICcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2NvbGxpc2lvbkRldGVjdGlvblxuICAgKiBAZGVzY3JpcHRpb24gQWRkcyBsaXN0ZW5lcnMgdGhlIGZpcnN0IHRpbWUgYSBidXR0b24gaXMgY2xpY2tlZCB0byBjYWxsXG4gICAqIHRoaXMuX2FkanVzdENsYXNzZXMgZHVyaW5nIHNjcm9sbHMgYW5kIHJlc2l6ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gYnV0dG9uIC0gc2hhcmUgYnV0dG9uXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gbmV0d29ya3MgLSBsaXN0IG9mIHNvY2lhbCBuZXR3b3Jrc1xuICAgKi9cbiAgX2NvbGxpc2lvbkRldGVjdGlvbihidXR0b24sIG5ldHdvcmtzKSB7XG4gICAgbGV0IGRpbWVuc2lvbnMgPSB0aGlzLl9nZXREaW1lbnNpb25zKGJ1dHRvbiwgbmV0d29ya3MpO1xuICAgIHRoaXMuX2FkanVzdENsYXNzZXMoYnV0dG9uLCBuZXR3b3JrcywgZGltZW5zaW9ucyk7XG5cbiAgICBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2NsaWNrZWQnKSkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+XG4gICAgICAgIHRoaXMuX2FkanVzdENsYXNzZXMoYnV0dG9uLCBkaW1lbnNpb25zKSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT5cbiAgICAgICAgdGhpcy5fYWRqdXN0Q2xhc3NlcyhidXR0b24sIGRpbWVuc2lvbnMpKTtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdjbGlja2VkJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2dldERpbWVuc2lvbnNcbiAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGJ1dHRvbiBhbmRcbiAgICogbGFiZWwgZWxlbWVudHMgb2YgYSBTaGFyZSBCdXR0b24uXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gYnV0dG9uXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gbmV0d29ya3NcbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIF9nZXREaW1lbnNpb25zKGJ1dHRvbiwgbmV0d29ya3MpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmV0d29ya3NXaWR0aDogbmV0d29ya3Mub2Zmc2V0V2lkdGgsXG4gICAgICBidXR0b25IZWlnaHQ6IGJ1dHRvbi5vZmZzZXRIZWlnaHQsXG4gICAgICBidXR0b25XaWR0aDogYnV0dG9uLm9mZnNldFdpZHRoXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9hZGp1c3RDbGFzc2VzXG4gICAqIEBkZXNjcmlwdGlvbiBBZGp1c3RzIHRoZSBwb3NpdGlvbmluZyBvZiB0aGUgbGlzdCBvZiBzb2NpYWwgbmV0d29ya3MgYmFzZWRcbiAgICogb2ZmIG9mIHdoZXJlIHRoZSBzaGFyZSBidXR0b24gaXMgcmVsYXRpdmUgdG8gdGhlIHdpbmRvdy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtET01Ob2RlfSBidXR0b25cbiAgICogQHBhcmFtIHtET01Ob2RlfSBsYWJlbFxuICAgKiBAcGFyYW0ge09iamVjdH0gZGltZW5zaW9uc1xuICAgKi9cbiAgX2FkanVzdENsYXNzZXMoYnV0dG9uLCBuZXR3b3JrcywgZGltZW5zaW9ucykge1xuICAgIGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGV0IGxlZnRPZmZzZXQgPSBidXR0b24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArXG4gICAgICBkaW1lbnNpb25zLmJ1dHRvbldpZHRoIC8gMjtcbiAgICBsZXQgcmlnaHRPZmZzZXQgPSB3aW5kb3dXaWR0aCAtIGxlZnRPZmZzZXQ7XG4gICAgbGV0IHRvcE9mZnNldCA9IGJ1dHRvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgK1xuICAgICAgZGltZW5zaW9ucy5idXR0b25IZWlnaHQgLyAyO1xuICAgIGxldCBwb3NpdGlvbiA9XG4gICAgICB0aGlzLl9maW5kTG9jYXRpb24obGVmdE9mZnNldCwgdG9wT2Zmc2V0LCB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KTtcblxuICAgIGlmIChwb3NpdGlvblsxXSA9PT0gXCJtaWRkbGVcIiAmJiBwb3NpdGlvblswXSAhPT0gXCJjZW50ZXJcIiAmJlxuICAgICAgICAoKHBvc2l0aW9uWzBdID09PSBcImxlZnRcIiAmJlxuICAgICAgICAgIHdpbmRvd1dpZHRoIDw9IGxlZnRPZmZzZXQgKyAyMjAgKyBkaW1lbnNpb25zLmJ1dHRvbldpZHRoIC8gMikgfHxcbiAgICAgICAgKHBvc2l0aW9uWzBdID09PSBcInJpZ2h0XCIgJiZcbiAgICAgICAgICB3aW5kb3dXaWR0aCA8PSByaWdodE9mZnNldCArIDIyMCArIGRpbWVuc2lvbnMuYnV0dG9uV2lkdGggLyAyKVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9dG9wYCk7XG4gICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfW1pZGRsZWApO1xuICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1ib3R0b21gKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzd2l0Y2gocG9zaXRpb25bMF0pIHtcbiAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QuYWRkKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1yaWdodGApO1xuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWNlbnRlcmApO1xuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWxlZnRgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNlbnRlclwiOlxuICAgICAgICAgIGlmIChwb3NpdGlvblsxXSAhPT0gXCJ0b3BcIilcbiAgICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfXRvcGApO1xuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWNlbnRlcmApO1xuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWxlZnRgKTtcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1yaWdodGApO1xuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfW1pZGRsZWApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QuYWRkKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1sZWZ0YCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9Y2VudGVyYCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9cmlnaHRgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHN3aXRjaChwb3NpdGlvblsxXSkge1xuICAgICAgICBjYXNlIFwidG9wXCI6XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9Ym90dG9tYCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9bWlkZGxlYCk7XG4gICAgICAgICAgaWYgKHBvc2l0aW9uWzBdICE9PSBcImNlbnRlclwiKVxuICAgICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9dG9wYCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtaWRkbGVcIjpcbiAgICAgICAgICBpZiAocG9zaXRpb25bMF0gIT09IFwiY2VudGVyXCIpIHtcbiAgICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfW1pZGRsZWApO1xuICAgICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9dG9wYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWJvdHRvbWApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm90dG9tXCI6XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9dG9wYCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9bWlkZGxlYCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9Ym90dG9tYCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2ZpbmRMb2NhdGlvblxuICAgKiBAZGVzY3JpcHRpb24gRmluZHMgdGhlIGxvY2F0aW9uIG9mIHRoZSBsYWJlbCBnaXZlbiBieSBpdHMgeCBhbmQgeSB2YWx1ZVxuICAgKiB3aXRoIHJlc3BlY3QgdG8gdGhlIHdpbmRvdyB3aWR0aCBhbmQgd2luZG93IGhlaWdodCBnaXZlbi5cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxhYmVsWFxuICAgKiBAcGFyYW0ge251bWJlcn0gbGFiZWxZXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aW5kb3dXaWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gd2luZG93SGVpZ2h0XG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG4gIF9maW5kTG9jYXRpb24obGFiZWxYLCBsYWJlbFksIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpIHtcbiAgICBsZXQgeFBvc2l0aW9uID0gW1wibGVmdFwiLCBcImNlbnRlclwiLCBcInJpZ2h0XCJdO1xuICAgIGxldCB5UG9zaXRpb24gPSBbXCJ0b3BcIiwgXCJtaWRkbGVcIiwgXCJib3R0b21cIl07XG4gICAgbGV0IHhMb2NhdGlvbiA9XG4gICAgICBNYXRoLnRydW5jKDMgKiAoMSAtICgod2luZG93V2lkdGggLSBsYWJlbFgpIC8gd2luZG93V2lkdGgpKSk7XG4gICAgbGV0IHlMb2NhdGlvbiA9XG4gICAgICBNYXRoLnRydW5jKDMgKiAoMSAtICgod2luZG93SGVpZ2h0IC0gbGFiZWxZKSAvIHdpbmRvd0hlaWdodCkpKTtcbiAgICBpZiAoeExvY2F0aW9uID49IDMpIHhMb2NhdGlvbiA9IDI7XG4gICAgZWxzZSBpZiAoeExvY2F0aW9uIDw9IC0xKSB4TG9jYXRpb24gPSAwO1xuICAgIGlmICh5TG9jYXRpb24gPj0gMykgeUxvY2F0aW9uID0gMjtcbiAgICBlbHNlIGlmICh5TG9jYXRpb24gPD0gLTEpIHlMb2NhdGlvbiA9IDA7XG4gICAgcmV0dXJuIFt4UG9zaXRpb25beExvY2F0aW9uXSwgeVBvc2l0aW9uW3lMb2NhdGlvbl1dO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX25ldHdvcmtGYWNlYm9va1xuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlICYgZGlzcGxheSBhIEZhY2Vib29rIHdpbmRvd1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25ldHdvcmtGYWNlYm9vayhlbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmxvYWRTZGspIHtcbiAgICAgIGlmICghd2luZG93LkZCKVxuICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcignVGhlIEZhY2Vib29rIEpTIFNESyBoYXNuXFwndCBsb2FkZWQgeWV0LicpO1xuICAgICAgdGhpcy5fdXBkYXRlSHJlZihlbGVtZW50LCAnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL3NoYXJlci9zaGFyZXIucGhwJywge1xuICAgICAgICB1OiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay51cmxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIEZCLnVpKHtcbiAgICAgICAgbWV0aG9kOidmZWVkJyxcbiAgICAgICAgbmFtZTogdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2sudGl0bGUsXG4gICAgICAgIGxpbms6IHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLnVybCxcbiAgICAgICAgcGljdHVyZTogdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suaW1hZ2UsXG4gICAgICAgIGNhcHRpb246IHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmNhcHRpb24sXG4gICAgICAgIGRlc2NyaXB0aW9uOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5kZXNjcmlwdGlvblxuICAgICAgfSk7XG4gICAgfSBlbHNlXG4gICAgICByZXR1cm4gdGhpcy5fdXBkYXRlSHJlZihcbiAgICAgICAgZWxlbWVudCxcbiAgICAgICAgJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocCcsIHtcbiAgICAgICAgICB1OiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay51cmxcbiAgICAgICAgfVxuICAgICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9uZXR3b3JrVHdpdHRlclxuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlICYgZGlzcGxheSBhIFR3aXR0ZXIgd2luZG93XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbmV0d29ya1R3aXR0ZXIoZWxlbWVudCkge1xuICAgIHRoaXMuX3VwZGF0ZUhyZWYoZWxlbWVudCwgJ2h0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0Jywge1xuICAgICAgdGV4dDogdGhpcy5jb25maWcubmV0d29ya3MudHdpdHRlci5kZXNjcmlwdGlvbixcbiAgICAgIHVybDogdGhpcy5jb25maWcubmV0d29ya3MudHdpdHRlci51cmxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9uZXR3b3JrR29vZ2xlUGx1c1xuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlICYgZGlzcGxheSBhIEdvb2dsZSBQbHVzIHdpbmRvd1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25ldHdvcmtHb29nbGVQbHVzKGVsZW1lbnQpIHtcbiAgICB0aGlzLl91cGRhdGVIcmVmKGVsZW1lbnQsICdodHRwczovL3BsdXMuZ29vZ2xlLmNvbS9zaGFyZScsIHtcbiAgICAgIHVybDogdGhpcy5jb25maWcubmV0d29ya3MuZ29vZ2xlUGx1cy51cmxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9uZXR3b3JrUGludGVyZXN0XG4gICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgJiBkaXNwbGF5IGEgUGludGVyZXN0IHdpbmRvd1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25ldHdvcmtQaW50ZXJlc3QoZWxlbWVudCkge1xuICAgIHRoaXMuX3VwZGF0ZUhyZWYoZWxlbWVudCwgJ2h0dHBzOi8vd3d3LnBpbnRlcmVzdC5jb20vcGluL2NyZWF0ZS9idXR0b24nLCB7XG4gICAgICB1cmw6IHRoaXMuY29uZmlnLm5ldHdvcmtzLnBpbnRlcmVzdC51cmwsXG4gICAgICBtZWRpYTogdGhpcy5jb25maWcubmV0d29ya3MucGludGVyZXN0LmltYWdlLFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuY29uZmlnLm5ldHdvcmtzLnBpbnRlcmVzdC5kZXNjcmlwdGlvblxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX25ldHdvcmtMaW5rZWRJblxuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlICYgZGlzcGxheSBhIExpbmtlZGluIHdpbmRvd1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25ldHdvcmtMaW5rZWRpbihlbGVtZW50KSB7XG4gICAgdGhpcy5fdXBkYXRlSHJlZihlbGVtZW50LCAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL3NoYXJlQXJ0aWNsZScsIHtcbiAgICAgIG1pbmk6ICd0cnVlJyxcbiAgICAgIHVybDogdGhpcy5jb25maWcubmV0d29ya3MubGlua2VkaW4udXJsLFxuICAgICAgdGl0bGU6IHRoaXMuY29uZmlnLm5ldHdvcmtzLmxpbmtlZGluLnRpdGxlLFxuICAgICAgc3VtbWFyeTogdGhpcy5jb25maWcubmV0d29ya3MubGlua2VkaW4uZGVzY3JpcHRpb25cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9uZXR3b3JrRW1haWxcbiAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSAmIGRpc3BsYXkgYW4gRW1haWwgd2luZG93XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbmV0d29ya0VtYWlsKGVsZW1lbnQpIHtcbiAgICB0aGlzLl91cGRhdGVIcmVmKGVsZW1lbnQsICdtYWlsdG86Jywge1xuICAgICAgc3ViamVjdDogdGhpcy5jb25maWcubmV0d29ya3MuZW1haWwudGl0bGUsXG4gICAgICBib2R5OiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5lbWFpbC5kZXNjcmlwdGlvblxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX25ldHdvcmtSZWRkaXRcbiAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSAmIGRpc3BsYXkgYSBSZWRkaXQgd2luZG93XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbmV0d29ya1JlZGRpdChlbGVtZW50KSB7XG4gICAgdGhpcy5fdXBkYXRlSHJlZihlbGVtZW50LCAnaHR0cDovL3d3dy5yZWRkaXQuY29tL3N1Ym1pdCcsIHtcbiAgICAgIHVybDogdGhpcy5jb25maWcubmV0d29ya3MucmVkZGl0LnVybCxcbiAgICAgIHRpdGxlOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5yZWRkaXQudGl0bGVcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9uZXR3b3JrV2hhdHNhcHBcbiAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSAmIGRpc3BsYXkgYSBXaGF0c2FwcCB3aW5kb3dcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9uZXR3b3JrV2hhdHNhcHAoZWxlbWVudCkge1xuICAgIHRoaXMuX3VwZGF0ZUhyZWYoZWxlbWVudCwgJ3doYXRzYXBwOi8vc2VuZCcsIHtcbiAgICAgIHRleHQ6IHRoaXMuY29uZmlnLm5ldHdvcmtzLndoYXRzYXBwLmRlc2NyaXB0aW9uICsgXCIgXCIgK1xuICAgICAgICB0aGlzLmNvbmZpZy5uZXR3b3Jrcy53aGF0c2FwcC51cmxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9pbmplY3RTdHlsZXNoZWV0XG4gICAqIEBkZXNjcmlwdGlvbiBJbmplY3QgbGluayB0byBzdHlsZXNoZWV0XG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAgICovXG4gIF9pbmplY3RTdHlsZXNoZWV0KHVybCkge1xuICAgIGlmICghdGhpcy5lbC5oZWFkLnF1ZXJ5U2VsZWN0b3IoYGxpbmtbaHJlZj0nJHt1cmx9J11gKSkge1xuICAgICAgbGV0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKFwicmVsXCIsIFwic3R5bGVzaGVldFwiKTtcbiAgICAgIGxpbmsuc2V0QXR0cmlidXRlKFwiaHJlZlwiLCB1cmwpO1xuICAgICAgdGhpcy5lbC5oZWFkLmFwcGVuZENoaWxkKGxpbmspO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9pbmplY3RIdG1sXG4gICAqIEBkZXNjcmlwdGlvbiBJbmplY3QgYnV0dG9uIHN0cnVjdHVyZVxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGluc3RhbmNlXG4gICAqL1xuICBfaW5qZWN0SHRtbChpbnN0YW5jZSkge1xuICAgIGxldCBuZXR3b3JrcyA9IHRoaXMuY29uZmlnLnVpLm5ldHdvcmtPcmRlcjtcbiAgICBsZXQgbmV0d29ya0xpc3QgPSAnJztcblxuICAgIGZvciAobGV0IG5ldHdvcmsgb2YgbmV0d29ya3MpIHtcbiAgICAgIG5ldHdvcmtMaXN0ICs9IGA8bGkgY2xhc3M9JyR7bmV0d29ya30nIGRhdGEtbmV0d29yaz0nJHtuZXR3b3JrfSc+PGE+PC9hPjwvbGk+YDtcbiAgICB9XG4gICAgaW5zdGFuY2UuaW5uZXJIVE1MID0gYCR7dGhpcy5jb25maWcudWkuYnV0dG9uVGV4dH08ZGl2IGNsYXNzPScke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1zb2NpYWwgbG9hZCAke3RoaXMuY29uZmlnLnVpLmZseW91dH0nPjx1bD5gICsgbmV0d29ya0xpc3QgKyBgPC91bD48L2Rpdj5gO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2luamVjdEZhY2Vib29rU2RrXG4gICAqIEBkZXNjcmlwdGlvbiBJbmplY3QgRmFjZWJvb2sgU0RLXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfaW5qZWN0RmFjZWJvb2tTZGsoKSB7XG4gICAgaWYgKCF3aW5kb3cuRkIgJiYgdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suYXBwSWQgJiZcbiAgICAgICAgIXRoaXMuZWwuYm9keS5xdWVyeVNlbGVjdG9yKCcjZmItcm9vdCcpKSB7XG4gICAgICBsZXQgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgICBzY3JpcHQudGV4dCA9IGB3aW5kb3cuZmJBc3luY0luaXQ9ZnVuY3Rpb24oKXtGQi5pbml0KHthcHBJZDonJHt0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5hcHBJZH0nLHN0YXR1czp0cnVlLHhmYm1sOnRydWV9KX07KGZ1bmN0aW9uKGUsdCxuKXt2YXIgcixpPWUuZ2V0RWxlbWVudHNCeVRhZ05hbWUodClbMF07aWYgKGUuZ2V0RWxlbWVudEJ5SWQobikpe3JldHVybn1yPWUuY3JlYXRlRWxlbWVudCh0KTtyLmlkPW47ci5zcmM9Jy8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvYWxsLmpzJztpLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHIsaSl9KShkb2N1bWVudCwnc2NyaXB0JywnZmFjZWJvb2stanNzZGsnKTtgO1xuXG4gICAgICBsZXQgZmJSb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBmYlJvb3QuaWQgPSAnZmItcm9vdCc7XG5cbiAgICAgIHRoaXMuZWwuYm9keS5hcHBlbmRDaGlsZChmYlJvb3QpO1xuICAgICAgdGhpcy5lbC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2hvb2tcbiAgICogQGRlc2NyaXB0aW9uIEhvb2sgaGVscGVyIGZ1bmN0aW9uXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgIHR5cGVcbiAgICogQHBhcmFtIHtTdHJpbmd9ICAgbmV0d29ya1xuICAgKiBAcGFyYW0ge0RPTU5vZGV9ICBpbnN0YW5jZVxuICAgKi9cbiAgX2hvb2sodHlwZSwgbmV0d29yaywgaW5zdGFuY2UpIHtcbiAgICBsZXQgZm4gPSB0aGlzLmNvbmZpZy5uZXR3b3Jrc1tuZXR3b3JrXVt0eXBlXTtcblxuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGxldCBvcHRzID0gZm4uY2FsbCh0aGlzLmNvbmZpZy5uZXR3b3Jrc1tuZXR3b3JrXSwgaW5zdGFuY2UpO1xuXG4gICAgICBpZiAob3B0cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG9wdHMgPSB0aGlzLl9ub3JtYWxpemVGaWx0ZXJDb25maWdVcGRhdGVzKG9wdHMpO1xuICAgICAgICB0aGlzLmV4dGVuZCh0aGlzLmNvbmZpZy5uZXR3b3Jrc1tuZXR3b3JrXSwgb3B0cywgdHJ1ZSk7XG4gICAgICAgIHRoaXMuX25vcm1hbGl6ZU5ldHdvcmtDb25maWd1cmF0aW9uKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2RlZmF1bHRUaXRsZVxuICAgKiBAZGVzY3JpcHRpb24gR2V0cyBkZWZhdWx0IHRpdGxlXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9XG4gICAqL1xuICBfZGVmYXVsdFRpdGxlKCkge1xuICAgIGxldCBjb250ZW50O1xuICAgIGlmICgoY29udGVudCA9IChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW3Byb3BlcnR5PVwib2c6dGl0bGVcIl0nKSB8fFxuICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPVwidHdpdHRlcjp0aXRsZVwiXScpKSkpXG4gICAgICByZXR1cm4gY29udGVudC5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnKTtcbiAgICBlbHNlIGlmICgoY29udGVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3RpdGxlJykpKVxuICAgICAgcmV0dXJuIGNvbnRlbnQudGV4dENvbnRlbnQgfHwgY29udGVudC5pbm5lclRleHQ7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZGVmYXVsdEltYWdlXG4gICAqIEBkZXNjcmlwdGlvbiBHZXRzIGRlZmF1bHQgaW1hZ2VcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHJldHVybnMge1N0cmluZ31cbiAgICovXG4gIF9kZWZhdWx0SW1hZ2UoKSB7XG4gICAgbGV0IGNvbnRlbnQ7XG4gICAgaWYgKChjb250ZW50ID0gKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbcHJvcGVydHk9XCJvZzppbWFnZVwiXScpIHx8XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cInR3aXR0ZXI6aW1hZ2VcIl0nKSkpKVxuICAgICAgcmV0dXJuIGNvbnRlbnQuZ2V0QXR0cmlidXRlKCdjb250ZW50Jyk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZGVmYXVsdERlc2NyaXB0aW9uXG4gICAqIEBkZXNjcmlwdGlvbiBHZXRzIGRlZmF1bHQgZGVzY3JpcHRpb25cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHJldHVybnMge1N0cmluZ31cbiAgICovXG4gIF9kZWZhdWx0RGVzY3JpcHRpb24oKSB7XG4gICAgbGV0IGNvbnRlbnQ7XG4gICAgaWYgKChjb250ZW50ID0gKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbcHJvcGVydHk9XCJvZzpkZXNjcmlwdGlvblwiXScpIHx8XG4gICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJ0d2l0dGVyOmRlc2NyaXB0aW9uXCJdJykgfHxcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cImRlc2NyaXB0aW9uXCJdJykpKSlcbiAgICAgIHJldHVybiBjb250ZW50LmdldEF0dHJpYnV0ZSgnY29udGVudCcpO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9kZXRlY3ROZXR3b3Jrc1xuICAgKiBAZGVzY3JpcHRpb24gRGV0ZWN0IG51bWJlciBvZiBuZXR3b3JrcyBpbiB1c2UgYW5kIGRpc3BsYXkvaGlkZVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2RldGVjdE5ldHdvcmtzKCkge1xuICAgIC8vIFVwZGF0ZSBuZXR3b3JrLXNwZWNpZmljIGNvbmZpZ3VyYXRpb24gd2l0aCBnbG9iYWwgY29uZmlndXJhdGlvbnNcbiAgICBmb3IgKGxldCBuZXR3b3JrIG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLm5ldHdvcmtzKSkge1xuICAgICAgbGV0IGRpc3BsYXk7XG4gICAgICBmb3IgKGxldCBvcHRpb24gb2YgT2JqZWN0LmtleXModGhpcy5jb25maWcubmV0d29ya3NbbmV0d29ya10pKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbmZpZy5uZXR3b3Jrc1tuZXR3b3JrXVtvcHRpb25dID09PSBudWxsKSB7XG4gICAgICAgICAgdGhpcy5jb25maWcubmV0d29ya3NbbmV0d29ya11bb3B0aW9uXSA9IHRoaXMuY29uZmlnW29wdGlvbl07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgZm9yIGVuYWJsZWQgbmV0d29ya3MgYW5kIGRpc3BsYXkgdGhlbVxuICAgICAgaWYgKHRoaXMuY29uZmlnLm5ldHdvcmtzW25ldHdvcmtdLmVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5jbGFzcyA9ICdlbmFibGVkJztcbiAgICAgICAgdGhpcy5jb25maWcuZW5hYmxlZE5ldHdvcmtzICs9IDE7XG4gICAgICB9XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuY2xhc3MgPSAnZGlzYWJsZWQnO1xuXG4gICAgICB0aGlzLmNvbmZpZy5uZXR3b3Jrc1tuZXR3b3JrXS5jbGFzcyA9IHRoaXMuY2xhc3M7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX25vcm1hbGl6ZU5ldHdvcmtDb25maWd1cmF0aW9uXG4gICAqIEBkZXNjcmlwdGlvbiBOb3JtYWxpemVzIG5ldHdvcmsgY29uZmlndXJhdGlvbiBmb3IgRmFjZWJvb2sgJiBUd2l0dGVyXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbm9ybWFsaXplTmV0d29ya0NvbmZpZ3VyYXRpb24oKSB7XG4gICAgLy8gRG9uJ3QgbG9hZCBGQiBTREsgaWYgRkIgYXBwSWQgaXNuJ3QgcHJlc2VudFxuICAgIGlmICghdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suYXBwSWQpXG4gICAgICB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5sb2FkU2RrID0gZmFsc2U7XG5cbiAgICAvLyBFbmNvZGUgVHdpdHRlciBkZXNjcmlwdGlvbiBmb3IgVVJMXG4gICAgaWYgKCEhdGhpcy5jb25maWcubmV0d29ya3MudHdpdHRlci5kZXNjcmlwdGlvbilcbiAgICAgIGlmICghdGhpcy5faXNFbmNvZGVkKHRoaXMuY29uZmlnLm5ldHdvcmtzLnR3aXR0ZXIuZGVzY3JpcHRpb24pKVxuICAgICAgICB0aGlzLmNvbmZpZy5uZXR3b3Jrcy50d2l0dGVyLmRlc2NyaXB0aW9uID1cbiAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQodGhpcy5jb25maWcubmV0d29ya3MudHdpdHRlci5kZXNjcmlwdGlvbik7XG5cbiAgICAvLyBUeXBlY2FzdCBGYWNlYm9vayBhcHBJZCB0byBhIFN0cmluZ1xuICAgIGlmICh0eXBlb2YgdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suYXBwSWQgPT09ICdudW1iZXInKVxuICAgICAgdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suYXBwSWQgPVxuICAgICAgICB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5hcHBJZC50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX25vcm1hbGl6ZUZpbHRlckNvbmZpZ1VwZGF0ZXNcbiAgICogQGRlc2NyaXB0aW9uIE5vcm1hbGl6ZXMgRmFjZWJvb2sgY29uZmlnXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAqL1xuICBfbm9ybWFsaXplRmlsdGVyQ29uZmlnVXBkYXRlcyhvcHRzKSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmFwcElkICE9PSBvcHRzLmFwcElkKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1lvdSBhcmUgdW5hYmxlIHRvIGNoYW5nZSB0aGUgRmFjZWJvb2sgYXBwSWQgYWZ0ZXIgdGhlIGJ1dHRvbiBoYXMgYmVlbiBpbml0aWFsaXplZC4gUGxlYXNlIHVwZGF0ZSB5b3VyIEZhY2Vib29rIGZpbHRlcnMgYWNjb3JkaW5nbHkuJyk7XG4gICAgICBkZWxldGUob3B0cy5hcHBJZCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmxvYWRTZGsgIT09IG9wdHMubG9hZFNkaykge1xuICAgICAgY29uc29sZS53YXJuKCdZb3UgYXJlIHVuYWJsZSB0byBjaGFuZ2UgdGhlIEZhY2Vib29rIGxvYWRTZGsgb3B0aW9uIGFmdGVyIHRoZSBidXR0b24gaGFzIGJlZW4gaW5pdGlhbGl6ZWQuIFBsZWFzZSB1cGRhdGUgeW91ciBGYWNlYm9vayBmaWx0ZXJzIGFjY29yZGluZ2x5LicpO1xuICAgICAgZGVsZXRlKG9wdHMuYXBwSWQpO1xuICAgIH1cblxuICAgIHJldHVybiBvcHRzO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gU2hhcmVCdXR0b247XG4iXX0=
},{"./share-utils":42,"core-js/fn/array/iterator":1,"core-js/fn/math/trunc":2,"core-js/fn/symbol":3}],42:[function(_dereq_,module,exports){
/**
 * ShareUtils
 * @class
 * @classdesc A nice set of utilities.
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ShareUtils = (function () {
  function ShareUtils() {
    _classCallCheck(this, ShareUtils);
  }

  /**
   * @method toRFC3986
   * @description Encodes the string in RFC3986
   * @memberof String
   *
   * @return {String}
   */

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
      str = str.toRFC3986();
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
      if (typeof str === 'undefined' || str === null || this._isEncoded(str)) return encodeURIComponent(str);else return str.toRFC3986();
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
      if (navigator.userAgent.match(/Android|iPhone|PhantomJS/i) && !navigator.userAgent.match(/iPod|iPad/i)) return true;
      return false;
    }
  }]);

  return ShareUtils;
})();

String.prototype.toRFC3986 = function () {
  var tmp = encodeURIComponent(this);
  tmp.replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16);
  });
};

/**
 * @method capFLetter
 * @description Does exactly what the method name states
 * @memberof String
 *
 * @return {String}
 */
String.prototype.capFLetter = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

exports["default"] = ShareUtils;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tZWRpYS9yeWFuL3N0dWZmL3NoYXJlLWJ1dHRvbi9zcmMvc2hhcmUtdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0lBS00sVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7Ozs7Ozs7Ozs7ZUFBVixVQUFVOztXQUNMLG1CQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUU7QUFDbEIsVUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUVsQixVQUFJLFFBQVEsQ0FBQyxXQUFXLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRTtBQUNqRSxnQkFBUSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUN0RCxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUMxQixNQUFNLElBQUksR0FBRyxDQUFDLFlBQVksRUFBRTtBQUMzQixXQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsVUFBVSxRQUFRLEVBQUUsRUFBRSxFQUFFO0FBQ25ELGlCQUFPLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN6QixDQUFDLENBQUM7QUFDSCxnQkFBUSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDbEM7O0FBRUQsYUFBTyxRQUFRLENBQUM7S0FDbkI7Ozs7Ozs7Ozs7O1dBU00sZUFBQyxFQUFFLEVBQUU7QUFDUixRQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7S0FDM0I7Ozs7Ozs7Ozs7O1dBU0ksZUFBQyxFQUFFLEVBQUU7QUFDUixRQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7S0FDOUI7Ozs7Ozs7Ozs7Ozs7V0FXUSxtQkFBQyxFQUFFLEVBQUUsU0FBUyxFQUFFO0FBQ3ZCLGFBQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7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U0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsSUFDdEQsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsRUFDekMsT0FBTyxJQUFJLENBQUM7QUFDZCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7U0FwUkcsVUFBVTs7O0FBOFJoQixNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxZQUFXO0FBQ3RDLE1BQUksR0FBRyxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25DLEtBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQ2xDLGlCQUFXLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFHO0dBQzNDLENBQUMsQ0FBQztDQUNKLENBQUM7Ozs7Ozs7OztBQVNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFlBQVc7QUFDdkMsU0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDckQsQ0FBQzs7cUJBRWEsVUFBVSIsImZpbGUiOiIvbWVkaWEvcnlhbi9zdHVmZi9zaGFyZS1idXR0b24vc3JjL3NoYXJlLXV0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTaGFyZVV0aWxzXG4gKiBAY2xhc3NcbiAqIEBjbGFzc2Rlc2MgQSBuaWNlIHNldCBvZiB1dGlsaXRpZXMuXG4gKi9cbmNsYXNzIFNoYXJlVXRpbHMge1xuICBfZ2V0U3R5bGUoZWxlLCBjc3MpIHtcbiAgICB2YXIgc3RyVmFsdWUgPSBcIlwiO1xuXG4gICAgaWYgKGRvY3VtZW50LmRlZmF1bHRWaWV3ICYmIGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUpIHtcbiAgICAgIHN0clZhbHVlID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShlbGUsIFwiXCIpXG4gICAgICAgIC5nZXRQcm9wZXJ0eVZhbHVlKGNzcyk7XG4gICAgfSBlbHNlIGlmIChlbGUuY3VycmVudFN0eWxlKSB7XG4gICAgICBjc3MgPSBjc3MucmVwbGFjZSgvXFwtKFxcdykvZywgZnVuY3Rpb24gKHN0ck1hdGNoLCBwMSkge1xuICAgICAgICByZXR1cm4gcDEudG9VcHBlckNhc2UoKTtcbiAgICAgIH0pO1xuICAgICAgc3RyVmFsdWUgPSBlbGUuY3VycmVudFN0eWxlW2Nzc107XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0clZhbHVlO1xufVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9oaWRlXG4gICAqIEBkZXNjcmlwdGlvbiBDaGFuZ2UgZWxlbWVudCdzIGRpc3BsYXkgdG8gJ25vbmUnXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gZWxcbiAgICovXG4gIF9oaWRlKGVsKSB7XG4gICAgZWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX3Nob3dcbiAgICogQGRlc2NyaXB0aW9uIENoYW5nZSBlbGVtZW50J3MgZGlzcGxheSB0byAnYmxvY2snXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gZWxcbiAgICovXG4gIF9zaG93KGVsKSB7XG4gICAgZWwuc3R5bGUuZGlzcGxheSA9IFwiaW5pdGlhbFwiO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2hhc0NsYXNzXG4gICAqIEBkZXNjcmlwdGlvbiBXcmFwcGVyIHRvIHNlZSBpZiBhbiBlbGVtZW50IGNvbnRhaW5zIGEgY2xhc3MuXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gZWxcbiAgICogQHBhcmFtIHtTdHJpbmd9ICBjbGFzc05hbWVcbiAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAqL1xuICBfaGFzQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgIHJldHVybiBlbC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGFkZENsYXNzXG4gICAqIEBkZXNjcmlwdGlvbiBXcmFwcGVyIHRvIGFkZCBjbGFzcyB0byBlbGVtZW50LlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgY2xhc3NOYW1lXG4gICAqL1xuICBfYWRkQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIHJlbW92ZUNsYXNzXG4gICAqIEBkZXNjcmlwdGlvbiBXcmFwcGVyIHRvIHJlbW92ZSBjbGFzcyBmcm9tIGVsZW1lbnQuXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gZWxcbiAgICogQHBhcmFtIHtTdHJpbmd9ICBjbGFzc05hbWVcbiAgICovXG4gIF9yZW1vdmVDbGFzcyhlbCwgY2xhc3NOYW1lKSB7XG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2lzRW5jb2RlZFxuICAgKiBAZGVzY3JpcHRpb24gV3JhcHBlciB0byBjaGVjayBpZiB0aGUgc3RyaW5nIGlzIGVuY29kZWQuXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgc3RyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn1cbiAgICovXG4gIF9pc0VuY29kZWQoc3RyKSB7XG4gICAgc3RyID0gc3RyLnRvUkZDMzk4NigpO1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKSAhPT0gc3RyO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2VuY29kZVxuICAgKiBAZGVzY3JpcHRpb24gV3JhcHBlciB0byBfZW5jb2RlIGEgc3RyaW5nIGlmIHRoZSBzdHJpbmcgaXNuJ3QgYWxyZWFkeSBlbmNvZGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgY2xhc3NOYW1lXG4gICAqL1xuICBfZW5jb2RlKHN0cikge1xuICAgIGlmICh0eXBlb2Ygc3RyID09PSAndW5kZWZpbmVkJyB8fCBzdHIgPT09IG51bGwgfHwgdGhpcy5faXNFbmNvZGVkKHN0cikpXG4gICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cik7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHN0ci50b1JGQzM5ODYoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9nZXRVcmxcbiAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgdGhlIGNvcnJlY3Qgc2hhcmUgVVJMIGJhc2VkIG9mZiBvZiB0aGUgaW5jb21pbmdcbiAgICogVVJMIGFuZCBwYXJhbWV0ZXJzIGdpdmVuXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB1cmxcbiAgICogQHBhcmFtIHtib29sZWFufSBlbmNvZGVcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtc1xuICAgKi9cbiAgX2dldFVybCh1cmwsIGVuY29kZT1mYWxzZSwgcGFyYW1zPXt9KSB7XG4gICAgbGV0IHFzID0gKCgpID0+IHtcbiAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGxldCBrIG9mIE9iamVjdC5rZXlzKHBhcmFtcykpIHtcbiAgICAgICAgbGV0IHYgPSBwYXJhbXNba107XG4gICAgICAgIHJlc3VsdHMucHVzaChgJHtrfT0ke3RoaXMuX2VuY29kZSh2KX1gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzLmpvaW4oJyYnKTtcbiAgICB9KSgpO1xuXG4gICAgaWYgKHFzKSBxcyA9IGA/JHtxc31gO1xuXG4gICAgcmV0dXJuIHVybCArIHFzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX3VwZGF0ZUhyZWZcbiAgICogQGRlc2NyaXB0aW9uIE1ha2VzIHRoZSBlbGVtZW50cyBhIHRhZyBoYXZlIGEgaHJlZiBvZiB0aGUgcG9wdXAgbGluayBhbmRcbiAgICogYXMgcG9wcyB1cCB0aGUgc2hhcmUgd2luZG93IGZvciB0aGUgZWxlbWVudFxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGVsZW1lbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAqL1xuICBfdXBkYXRlSHJlZihlbGVtZW50LCB1cmwsIHBhcmFtcykge1xuICAgIGxldCBlbmNvZGUgPSB1cmwuaW5kZXhPZignbWFpbHRvOicpID49IDA7XG4gICAgbGV0IGEgPSBlbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJylbMF07XG4gICAgYS5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCB0aGlzLl9nZXRVcmwodXJsLCAhZW5jb2RlLCBwYXJhbXMpKTtcbiAgICBpZighZW5jb2RlICYmICghdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2subG9hZFNkayB8fCBlbGVtZW50LmdldEF0dHJpYnV0ZSgnY2xhc3MnKSAhPT0gJ2ZhY2Vib29rJykpIHtcbiAgICAgIGxldCBwb3B1cCA9IHtcbiAgICAgICAgd2lkdGg6IDUwMCxcbiAgICAgICAgaGVpZ2h0OiAzNTBcbiAgICAgIH07XG5cbiAgICAgIHBvcHVwLnRvcCA9IChzY3JlZW4uaGVpZ2h0IC8gMikgLSAocG9wdXAuaGVpZ2h0IC8gMik7XG4gICAgICBwb3B1cC5sZWZ0ID0gKHNjcmVlbi53aWR0aCAvIDIpICAtIChwb3B1cC53aWR0aCAvIDIpO1xuXG4gICAgICB3aW5kb3cub3BlbihcbiAgICAgICAgYS5ocmVmLFxuICAgICAgICAndGFyZ2V0V2luZG93JywgYFxuICAgICAgICAgIHRvb2xiYXI9bm8sXG4gICAgICAgICAgbG9jYXRpb249bm8sXG4gICAgICAgICAgc3RhdHVzPW5vLFxuICAgICAgICAgIG1lbnViYXI9bm8sXG4gICAgICAgICAgc2Nyb2xsYmFycz15ZXMsXG4gICAgICAgICAgcmVzaXphYmxlPXllcyxcbiAgICAgICAgICBsZWZ0PSR7cG9wdXAubGVmdH0sXG4gICAgICAgICAgdG9wPSR7cG9wdXAudG9wfSxcbiAgICAgICAgICB3aWR0aD0ke3BvcHVwLndpZHRofSxcbiAgICAgICAgICBoZWlnaHQ9JHtwb3B1cC5oZWlnaHR9XG4gICAgICAgIGBcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgcG9wdXBcbiAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSBhIHdpbmRvdyBmb3Igc3BlY2lmaWVkIG5ldHdvcmtcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9ICB1cmxcbiAgICogQHBhcmFtIHtPYmplY3R9ICBwYXJhbXNcbiAgICovXG4gIHBvcHVwKHVybCwgcGFyYW1zPXt9KSB7XG4gICAgbGV0IHBvcHVwID0ge1xuICAgICAgd2lkdGg6IDUwMCxcbiAgICAgIGhlaWdodDogMzUwXG4gICAgfTtcblxuICAgIHBvcHVwLnRvcCA9IChzY3JlZW4uaGVpZ2h0IC8gMikgLSAocG9wdXAuaGVpZ2h0IC8gMik7XG4gICAgcG9wdXAubGVmdCA9IChzY3JlZW4ud2lkdGggLyAyKSAgLSAocG9wdXAud2lkdGggLyAyKTtcblxuICAgIGxldCBxcyA9ICgoKSA9PiB7XG4gICAgICBsZXQgcmVzdWx0cyA9IFtdO1xuICAgICAgZm9yIChsZXQgayBvZiBPYmplY3Qua2V5cyhwYXJhbXMpKSB7XG4gICAgICAgIGxldCB2ID0gcGFyYW1zW2tdO1xuICAgICAgICByZXN1bHRzLnB1c2goYCR7a309JHt0aGlzLl9lbmNvZGUodil9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0cy5qb2luKCcmJyk7XG4gICAgfSkoKTtcblxuICAgIGlmIChxcykgcXMgPSBgPyR7cXN9YDtcblxuICAgIC8vIFRoaXMgZG9lcyB3b3JrIGV2ZW4gdGhvdWdoIGl0IGNvbnRhaW5zIFxcbiBvbmNlIGNvbnZlcnRlZC5cbiAgICB3aW5kb3cub3BlbihcbiAgICAgIHVybCtxcyxcbiAgICAgICd0YXJnZXRXaW5kb3cnLCBgXG4gICAgICAgIHRvb2xiYXI9bm8sXG4gICAgICAgIGxvY2F0aW9uPW5vLFxuICAgICAgICBzdGF0dXM9bm8sXG4gICAgICAgIG1lbnViYXI9bm8sXG4gICAgICAgIHNjcm9sbGJhcnM9eWVzLFxuICAgICAgICByZXNpemFibGU9eWVzLFxuICAgICAgICBsZWZ0PSR7cG9wdXAubGVmdH0sXG4gICAgICAgIHRvcD0ke3BvcHVwLnRvcH0sXG4gICAgICAgIHdpZHRoPSR7cG9wdXAud2lkdGh9LFxuICAgICAgICBoZWlnaHQ9JHtwb3B1cC5oZWlnaHR9XG4gICAgICBgXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9tZXJnZVxuICAgKiBAZGVzY3JpcHRpb24gQ29tYmluZXMgdHdvIChvciBtb3JlKSBvYmplY3RzLCBnaXZpbmcgdGhlIGxhc3Qgb25lIHByZWNlZGVuY2VcbiAgICogQGF1dGhvciBzdmxhc292LWdpc3RzXG4gICAqIFtPcmlnaW5hbCBHaXN0XXtAbGluayBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9zdmxhc292LWdpc3RzLzIzODM3NTF9XG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSAgdGFyZ2V0XG4gICAqIEBwYXJhbSB7T2JqZWN0fSAgc291cmNlXG4gICAqIEByZXR1cm4ge09iamVjdH0gdGFyZ2V0XG4gICAqL1xuICBfbWVyZ2UodGFyZ2V0LCBzb3VyY2UpIHtcbiAgICBpZiAodHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcpIHRhcmdldCA9IHt9O1xuXG4gICAgZm9yIChsZXQgcHJvcGVydHkgaW4gc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KHByb3BlcnR5KSkge1xuICAgICAgICBsZXQgc291cmNlUHJvcGVydHkgPSBzb3VyY2VbcHJvcGVydHldO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygc291cmNlUHJvcGVydHkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHRoaXMuX21lcmdlKHRhcmdldFtwcm9wZXJ0eV0sIHNvdXJjZVByb3BlcnR5KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRhcmdldFtwcm9wZXJ0eV0gPSBzb3VyY2VQcm9wZXJ0eTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGxldCBhID0gMiwgbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGEgPCBsOyBhKyspXG4gICAgICBfbWVyZ2UodGFyZ2V0LCBhcmd1bWVudHNbYV0pO1xuXG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9vYmplY3RUb0FycmF5XG4gICAqIEBkZXNjcmlwdGlvbiBUYWtlcyBhbiBPYmplY3QgYW5kIGNvbnZlcnRzIGl0IGludG8gYW4gYXJyYXkgb2YgT2JqZWN0cy4gVGhpcyBpcyB1c2VkIHdoZW4gY29udmVydGluZyBhIGxpc3Qgb2YgRE9NTm9kZXMgaW50byBhbiBhcnJheS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9ialxuICAgKiBAcmV0dXJucyB7QXJyYXl9IGFyclxuICAgKi9cbiAgX29ialRvQXJyYXkob2JqKSB7XG4gICAgbGV0IGFyciA9IFtdO1xuXG4gICAgZm9yIChsZXQgayBpbiBvYmopXG4gICAgICBpZiAodHlwZW9mIG9ialtrXSA9PT0gJ29iamVjdCcpIGFyci5wdXNoKG9ialtrXSk7XG5cbiAgICByZXR1cm4gYXJyO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2lzTW9iaWxlXG4gICAqIEBkZXNjcmlwdGlvbiBSZXR1cm5zIHRydWUgaWYgY3VycmVudCBkZXZpY2UgaXMgbW9iaWxlIChvciBQaGFudG9tSlMgZm9yXG4gICAqIHRlc3RpbmcgcHVycG9zZXMpLCBhbmQgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqIEBhdXRob3Iga3Jpc2tieFxuICAgKiBbT3JpZ2luYWwgR2lzdF0ge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9rcmlza2J4L3doYXRzYXBwLXNoYXJpbmcvYmxvYi9tYXN0ZXIvc3JjL2J1dHRvbi5qc31cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pc01vYmlsZSgpIHtcbiAgICBpZihuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkfGlQaG9uZXxQaGFudG9tSlMvaSkgJiZcbiAgICAgICAhbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvaVBvZHxpUGFkL2kpKVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59XG5cbi8qKlxuICogQG1ldGhvZCB0b1JGQzM5ODZcbiAqIEBkZXNjcmlwdGlvbiBFbmNvZGVzIHRoZSBzdHJpbmcgaW4gUkZDMzk4NlxuICogQG1lbWJlcm9mIFN0cmluZ1xuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuU3RyaW5nLnByb3RvdHlwZS50b1JGQzM5ODYgPSBmdW5jdGlvbigpIHtcbiAgbGV0IHRtcCA9IGVuY29kZVVSSUNvbXBvbmVudCh0aGlzKTtcbiAgdG1wLnJlcGxhY2UoL1shJygpKl0vZywgZnVuY3Rpb24oYykge1xuICAgIHJldHVybiBgJSR7Yy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KX1gO1xuICB9KTtcbn07XG5cbi8qKlxuICogQG1ldGhvZCBjYXBGTGV0dGVyXG4gKiBAZGVzY3JpcHRpb24gRG9lcyBleGFjdGx5IHdoYXQgdGhlIG1ldGhvZCBuYW1lIHN0YXRlc1xuICogQG1lbWJlcm9mIFN0cmluZ1xuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuU3RyaW5nLnByb3RvdHlwZS5jYXBGTGV0dGVyID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdGhpcy5zbGljZSgxKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlVXRpbHM7XG4iXX0=
},{}]},{},[41])
(41)
});