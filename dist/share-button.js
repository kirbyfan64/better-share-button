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

      if (typeof element === 'undefined') instances = _get(Object.getPrototypeOf(ShareButton.prototype), '_objToArray', this).call(this, this.config.root.querySelectorAll('share-button'));else instances = document.querySelectorAll(element);

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
      // Adding user configs to default configs
      this._merge(this.config, opts);

      var instances = undefined;

      if (typeof element === 'undefined') instances = _get(Object.getPrototypeOf(ShareButton.prototype), '_objToArray', this).call(this, this.config.root.querySelectorAll('share-button'));else {
        instances = this.config.root.querySelectorAll('share-button' + element);
        if (typeof instances === 'object') instances = _get(Object.getPrototypeOf(ShareButton.prototype), '_objToArray', this).call(this, instances);
      }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tZWRpYS9yeWFuL3N0dWZmL3NoYXJlLWJ1dHRvbi9zcmMvc2hhcmUtYnV0dG9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OzswQkFHdUIsZUFBZTs7OzsyQkFDZCxnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7QUFKeEMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDN0IsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDckMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7O0lBYTNCLFdBQVc7WUFBWCxXQUFXOztBQUNKLFdBRFAsV0FBVyxDQUNILE9BQU8sRUFBRSxPQUFPLEVBQUU7MEJBRDFCLFdBQVc7O0FBRWIsK0JBRkUsV0FBVyw2Q0FFTDs7QUFFUixRQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtBQUMvQixVQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztBQUN6QixhQUFPLEdBQUcsT0FBTyxDQUFDO0tBQ25CLE1BQ0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxFQUFFLEdBQUc7QUFDUixVQUFJLEVBQUUsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QyxVQUFJLEVBQUUsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUMvQyxDQUFDOztBQUVGLFFBQUksQ0FBQyxNQUFNLEdBQUc7QUFDWixxQkFBZSxFQUFFLENBQUM7QUFDbEIsY0FBUSxFQUFFLElBQUk7QUFDZCxTQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJO0FBQ3pCLGFBQU8sRUFBRSxJQUFJO0FBQ2IsV0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDM0IsV0FBSyxFQUFFLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDM0IsaUJBQVcsRUFBRSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7QUFDdkMsVUFB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QUMsRUFBRSxDQUFDLFNBQVMsV0FBUSxDQUFDO0FBQzNELG9CQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLFlBQVMsQ0FBQztBQUMvRCxvQkFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxVQUFPLENBQUM7QUFDN0Qsa0JBQU07QUFBQSxBQUNSLGVBQUssUUFBUTtBQUNYLGdCQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQ3ZCLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsU0FBTSxDQUFDO0FBQzNELG9CQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLFlBQVMsQ0FBQztBQUM1RCxvQkFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxVQUFPLENBQUM7QUFDN0Qsb0JBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsV0FBUSxDQUFDO0FBQzlELG9CQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLFlBQVMsQ0FBQztBQUMvRCxrQkFBTTtBQUFBLEFBQ1IsZUFBSyxPQUFPO0FBQ1Ysb0JBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFNBQVMsVUFBTyxDQUFDO0FBQzFELG9CQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxTQUFTLFlBQVMsQ0FBQztBQUMvRCxvQkFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFN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RUFBRTtBQUNsQyxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRTtBQUN0RCxlQUFPLENBQUMsSUFBSSxDQUFDLHFJQUFxSSxDQUFDLENBQUM7QUFDcEosZUFBTyxJQUFJLENBQUMsS0FBSyxBQUFDLENBQUM7T0FDcEI7O0FBRUQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFDMUQsZUFBTyxDQUFDLElBQUksQ0FBQyw4SUFBOEksQ0FBQyxDQUFDO0FBQzdKLGVBQU8sSUFBSSxDQUFDLEtBQUssQUFBQyxDQUFDO09BQ3BCOztBQUVELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztTQTd3QkcsV0FBVzs7O0FBZ3hCakIsTUFBTSxDQUFDLE9BQU8sR0FBRyxXQUFXLENBQUMiLCJmaWxlIjoiL21lZGlhL3J5YW4vc3R1ZmYvc2hhcmUtYnV0dG9uL3NyYy9zaGFyZS1idXR0b24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCdjb3JlLWpzL2ZuL3N5bWJvbCcpO1xucmVxdWlyZSgnY29yZS1qcy9mbi9hcnJheS9pdGVyYXRvcicpO1xucmVxdWlyZSgnY29yZS1qcy9mbi9tYXRoL3RydW5jJyk7XG5pbXBvcnQgU2hhcmVVdGlscyBmcm9tICcuL3NoYXJlLXV0aWxzJztcbmltcG9ydCBTdHJpbmdVdGlscyBmcm9tICcuL3N0cmluZy11dGlscyc7XG5cbi8qKlxuICogU2hhcmVidXR0b25cbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzY1xuICogQGV4dGVuZHMgU2hhcmVVdGlsc1xuXG4gKiBAcGFyYW0ge1N0cmluZ30gZWxlbWVudFxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqL1xuY2xhc3MgU2hhcmVCdXR0b24gZXh0ZW5kcyBTaGFyZVV0aWxzIHtcbiAgY29uc3RydWN0b3IoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG5cbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICB0aGlzLmVsZW1lbnQgPSB1bmRlZmluZWQ7XG4gICAgICBvcHRpb25zID0gZWxlbWVudDtcbiAgICB9IGVsc2VcbiAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cbiAgICB0aGlzLmVsID0ge1xuICAgICAgaGVhZDogZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXSxcbiAgICAgIGJvZHk6IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF1cbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWcgPSB7XG4gICAgICBlbmFibGVkTmV0d29ya3M6IDAsXG4gICAgICBwcm90b2NvbDogJy8vJyxcbiAgICAgIHVybDogd2luZG93LmxvY2F0aW9uLmhyZWYsXG4gICAgICBjYXB0aW9uOiBudWxsLFxuICAgICAgdGl0bGU6IHRoaXMuX2RlZmF1bHRUaXRsZSgpLFxuICAgICAgaW1hZ2U6IHRoaXMuX2RlZmF1bHRJbWFnZSgpLFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuX2RlZmF1bHREZXNjcmlwdGlvbigpLFxuICAgICAgcm9vdDogZG9jdW1lbnQsXG5cbiAgICAgIHVpOiB7XG4gICAgICAgIGZseW91dDogJ3NiLXRvcCBzYi1jZW50ZXInLFxuICAgICAgICBidXR0b25UZXh0OiAnU2hhcmUnLFxuICAgICAgICBuYW1lc3BhY2U6ICdzYi0nLFxuICAgICAgICBuZXR3b3JrT3JkZXI6IFtdLFxuICAgICAgICBjb2xsaXNpb246IGZhbHNlLFxuICAgICAgfSxcblxuICAgICAgbmV0d29ya3M6IHtcbiAgICAgICAgZ29vZ2xlUGx1czoge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgdXJsOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHR3aXR0ZXI6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBmYWNlYm9vazoge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgbG9hZFNkazogdHJ1ZSxcbiAgICAgICAgICB1cmw6IG51bGwsXG4gICAgICAgICAgYXBwSWQ6IG51bGwsXG4gICAgICAgICAgdGl0bGU6IG51bGwsXG4gICAgICAgICAgY2FwdGlvbjogbnVsbCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgICAgICBpbWFnZTogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBwaW50ZXJlc3Q6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgICBpbWFnZTogbnVsbCxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICByZWRkaXQ6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHVybDogbnVsbCxcbiAgICAgICAgICB0aXRsZTogbnVsbFxuICAgICAgICB9LFxuICAgICAgICBsaW5rZWRpbjoge1xuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgdXJsOiBudWxsLFxuICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHdoYXRzYXBwOiB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgICAgICB1cmw6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICAgIHRpdGxlOiBudWxsLFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiBudWxsXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5saXN0ZW5lciA9IG51bGw7XG4gICAgdGhpcy5fc2V0dXAodGhpcy5lbGVtZW50LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIG9wZW5cbiAgICogQGRlc2NyaXB0aW9uIE9wZW5zIFNoYXJlIEJ1dHRvblxuICAgKi9cbiAgb3BlbigpIHsgdGhpcy5fcHVibGljKCdPcGVuJyk7IH1cblxuICAvKipcbiAgICogQG1ldGhvZCBjbG9zZVxuICAgKiBAZGVzY3JpcHRpb24gQ3BlbnMgU2hhcmUgQnV0dG9uXG4gICAqL1xuICBjbG9zZSgpIHsgdGhpcy5fcHVibGljKCdDbG9zZScpOyB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgdG9nZ2xlXG4gICAqIEBkZXNjcmlwdGlvbiBUb2dnbGVzIFNoYXJlIEJ1dHRvblxuICAgKi9cbiAgdG9nZ2xlKCkgeyB0aGlzLl9wdWJsaWMoJ1RvZ2dsZScpOyB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgdG9nZ2xlTGlzdGVuXG4gICAqIEBkZXNjcmlwdGlvbiBUb2dnbGVzIHRoZSBTaGFyZSBCdXR0b24gbGlzdGVuZXIsIGdvb2QgZm9yIHVwZGFpbmcgc2hhcmVcbiAgICogYnV0dG9uIGZvciBDU1MgYW5pbWF0aW9ucy5cbiAgICovXG4gIHRvZ2dsZUxpc3RlbigpIHsgdGhpcy5fcHVibGljKCdMaXN0ZW4nKTsgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9wdWJsaWNcbiAgICogQGRlc2NyaXB0aW9uIEV4ZWN1dGVzIGFjdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWN0aW9uXG4gICAqL1xuICBfcHVibGljKGFjdGlvbikge1xuICAgIGxldCBpbnN0YW5jZXM7XG5cbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnKVxuICAgICAgaW5zdGFuY2VzID1cbiAgICAgICAgc3VwZXIuX29ialRvQXJyYXkodGhpcy5jb25maWcucm9vdC5xdWVyeVNlbGVjdG9yQWxsKCdzaGFyZS1idXR0b24nKSk7XG4gICAgZWxzZVxuICAgICAgaW5zdGFuY2VzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtZW50KTtcblxuICAgIGZvciAobGV0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xuICAgICAgbGV0IG5ldHdvcmtzID1cbiAgICAgICAgaW5zdGFuY2UuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9c29jaWFsYClbMF07XG4gICAgICB0aGlzW2BfZXZlbnQke2FjdGlvbn1gXShpbnN0YW5jZSwgbmV0d29ya3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9zZXR1cFxuICAgKiBAZGVzY3JpcHRpb24gU2V0cyB1cCBTaGFyZSBCdXR0b25cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVsZW1lbnQgc2VsZWN0b3JcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICovXG4gIF9zZXR1cChlbGVtZW50LCBvcHRzKSB7XG4gICAgLy8gQWRkaW5nIHVzZXIgY29uZmlncyB0byBkZWZhdWx0IGNvbmZpZ3NcbiAgICB0aGlzLl9tZXJnZSh0aGlzLmNvbmZpZywgb3B0cyk7XG5cbiAgICBsZXQgaW5zdGFuY2VzO1xuXG4gICAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJylcbiAgICAgIGluc3RhbmNlcyA9XG4gICAgICAgIHN1cGVyLl9vYmpUb0FycmF5KHRoaXMuY29uZmlnLnJvb3QucXVlcnlTZWxlY3RvckFsbCgnc2hhcmUtYnV0dG9uJykpO1xuICAgIGVsc2Uge1xuICAgICAgaW5zdGFuY2VzID0gdGhpcy5jb25maWcucm9vdC5xdWVyeVNlbGVjdG9yQWxsKGBzaGFyZS1idXR0b24ke2VsZW1lbnR9YCk7XG4gICAgICBpZiAodHlwZW9mIGluc3RhbmNlcyA9PT0gJ29iamVjdCcpXG4gICAgICAgIGluc3RhbmNlcyA9IHN1cGVyLl9vYmpUb0FycmF5KGluc3RhbmNlcyk7XG4gICAgfVxuXG4gICAgLy8gRGlzYWJsZSB3aGF0c2FwcCBkaXNwbGF5IGlmIG5vdCBhIG1vYmlsZSBkZXZpY2VcbiAgICBpZiAodGhpcy5jb25maWcubmV0d29ya3Mud2hhdHNhcHAuZW5hYmxlZCAmJiAhdGhpcy5faXNNb2JpbGUoKSlcbiAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzLndoYXRzYXBwLmVuYWJsZWQgPSBmYWxzZTtcblxuICAgIC8vIERlZmF1bHQgb3JkZXIgb2YgbmV0d29ya3MgaWYgbm8gbmV0d29yayBvcmRlciBlbnRlcmVkXG4gICAgaWYgKHRoaXMuY29uZmlnLnVpLm5ldHdvcmtPcmRlci5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLmNvbmZpZy51aS5uZXR3b3JrT3JkZXIgPSBbXG4gICAgICAgICdwaW50ZXJlc3QnLFxuICAgICAgICAndHdpdHRlcicsXG4gICAgICAgICdmYWNlYm9vaycsXG4gICAgICAgICd3aGF0c2FwcCcsXG4gICAgICAgICdnb29nbGVQbHVzJyxcbiAgICAgICAgJ3JlZGRpdCcsXG4gICAgICAgICdsaW5rZWRpbicsXG4gICAgICAgICdlbWFpbCdcbiAgICAgIF07XG5cbiAgICBmb3IgKGxldCBuZXR3b3JrIG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLm5ldHdvcmtzKSkge1xuICAgICAgaWYgKHRoaXMuY29uZmlnLnVpLm5ldHdvcmtPcmRlci5pbmRleE9mKG5ldHdvcmsudG9TdHJpbmcoKSkgPCAwKSB7XG4gICAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzW25ldHdvcmtdLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jb25maWcudWkubmV0d29ya09yZGVyLnB1c2gobmV0d29yayk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fZml4Rmx5b3V0KCk7XG4gICAgdGhpcy5fZGV0ZWN0TmV0d29ya3MoKTtcbiAgICB0aGlzLl9ub3JtYWxpemVOZXR3b3JrQ29uZmlndXJhdGlvbigpO1xuXG4gICAgLy8gSW5qZWN0IEZhY2Vib29rIEpTIFNESyAoaWYgRmFjZWJvb2sgaXMgZW5hYmxlZClcbiAgICBpZiAodGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suZW5hYmxlZCAmJlxuICAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmxvYWRTZGspXG4gICAgICAgdGhpcy5faW5qZWN0RmFjZWJvb2tTZGsoKTtcblxuICAgIC8vIEluaXRpYWxpemUgaW5zdGFuY2VzXG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBmb3IgKGxldCBpbnN0YW5jZSBvZiBpbnN0YW5jZXMpIHtcbiAgICAgIHRoaXMuX3NldHVwSW5zdGFuY2UoaW5zdGFuY2UsIGluZGV4KyspO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9zZXR1cEluc3RhbmNlXG4gICAqIEBkZXNjcmlwdGlvbiBTZXRzIHVwIGVhY2ggaW5zdGFuY2Ugd2l0aCBjb25maWcgYW5kIHN0eWxlc1xuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGluc3RhbmNlXG4gICAqIEBwYXJhbSB7SW50ZWdlcn0gaW5kZXhcbiAgICovXG4gIF9zZXR1cEluc3RhbmNlKGluc3RhbmNlLCBpbmRleCkge1xuICAgIHRoaXMuX2hpZGUoaW5zdGFuY2UpO1xuXG4gICAgLy8gQWRkIG5lY2Vzc2FyeSBjbGFzc2VzIHRvIGluc3RhbmNlXG4gICAgLy8gKE5vdGU6IEZGIGRvZXNuJ3Qgc3VwcG9ydCBhZGRpbmcgbXVsdGlwbGUgY2xhc3NlcyBpbiBhIHNpbmdsZSBjYWxsKVxuICAgIHRoaXMuX2FkZENsYXNzKGluc3RhbmNlLCBgc2hhcmVyLSR7aW5kZXh9YCk7XG4gICAgdGhpcy5faW5qZWN0SHRtbChpbnN0YW5jZSk7XG4gICAgdGhpcy5fc2hvdyhpbnN0YW5jZSk7XG5cbiAgICBsZXQgbmV0d29ya3NDb24gPVxuICAgICAgaW5zdGFuY2UuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9c29jaWFsYClbMF07XG4gICAgbGV0IG5ldHdvcmtzID0gaW5zdGFuY2UuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2xpJyk7XG5cbiAgICB0aGlzLl9hZGRDbGFzcyhuZXR3b3Jrc0NvbiwgYG5ldHdvcmtzLSR7dGhpcy5jb25maWcuZW5hYmxlZE5ldHdvcmtzfWApO1xuICAgIGluc3RhbmNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT5cbiAgICAgIHRoaXMuX2V2ZW50VG9nZ2xlKGluc3RhbmNlLCBuZXR3b3Jrc0NvbilcbiAgICApO1xuXG4gICAgLy8gQWRkIGxpc3RlbmVyIHRvIGFjdGl2YXRlIG5ldHdvcmtzIGFuZCBjbG9zZSBidXR0b25cbiAgICBmb3IgKGxldCBrIGluIE9iamVjdC5rZXlzKG5ldHdvcmtzKSkge1xuICAgICAgbGV0IG5ldHdvcmsgPSBuZXR3b3Jrc1trXTtcblxuICAgICAgaWYgKHR5cGVvZihuZXR3b3JrKSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBsZXQgbmFtZSA9IG5ldHdvcmsuZ2V0QXR0cmlidXRlKCdkYXRhLW5ldHdvcmsnKTtcbiAgICAgICAgbGV0IGEgPSBuZXR3b3JrLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdhJylbMF07XG5cbiAgICAgICAgdGhpcy5fYWRkQ2xhc3MobmV0d29yaywgdGhpcy5jb25maWcubmV0d29ya3NbbmFtZV0uY2xhc3MpO1xuXG4gICAgICAgIGlmIChuZXR3b3JrLmNsYXNzTmFtZS5pbmRleE9mKCdlbWFpbCcpIDwgMClcbiAgICAgICAgICBhLnNldEF0dHJpYnV0ZSgnb25jbGljaycsICdyZXR1cm4gZmFsc2UnKTtcblxuICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsICgpID0+IHtcbiAgICAgICAgICB0aGlzLl9ob29rKCdiZWZvcmUnLCBuYW1lLCBpbnN0YW5jZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCAoKSA9PiB7XG4gICAgICAgICAgdGhpc1tgX25ldHdvcmske1N0cmluZ1V0aWxzLmNhcEZMZXR0ZXIobmFtZSl9YF0obmV0d29yayk7XG4gICAgICAgIH0pO1xuICAgICAgICBhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2hvb2soJ2FmdGVyJywgbmFtZSwgaW5zdGFuY2UpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZXZlbnRUb2dnbGVcbiAgICogQGRlc2NyaXB0aW9uIFRvZ2dsZXMgJ2FjdGl2ZScgY2xhc3Mgb24gYnV0dG9uXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gYnV0dG9uXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gbmV0d29ya3NcbiAgICovXG4gIF9ldmVudFRvZ2dsZShidXR0b24sIG5ldHdvcmtzKSB7XG4gICAgaWYgKHRoaXMuX2hhc0NsYXNzKG5ldHdvcmtzLCAnYWN0aXZlJykpXG4gICAgICB0aGlzLl9ldmVudENsb3NlKG5ldHdvcmtzKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9ldmVudE9wZW4oYnV0dG9uLCBuZXR3b3Jrcyk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZXZlbnRPcGVuXG4gICAqIEBkZXNjcmlwdGlvbiBBZGQgJ2FjdGl2ZScgY2xhc3MgJiByZW1vdmUgJ2xvYWQnIGNsYXNzIG9uIGJ1dHRvblxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGJ1dHRvblxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IG5ldHdvcmtzXG4gICAqL1xuICBfZXZlbnRPcGVuKGJ1dHRvbiwgbmV0d29ya3MpIHtcbiAgICBpZiAodGhpcy5faGFzQ2xhc3MobmV0d29ya3MsICdsb2FkJykpXG4gICAgICB0aGlzLl9yZW1vdmVDbGFzcyhuZXR3b3JrcywgJ2xvYWQnKTtcbiAgICBpZiAodGhpcy5jb2xsaXNpb24pXG4gICAgICB0aGlzLl9jb2xsaXNpb25EZXRlY3Rpb24oYnV0dG9uLCBuZXR3b3Jrcyk7XG5cbiAgICB0aGlzLl9hZGRDbGFzcyhuZXR3b3JrcywgJ2FjdGl2ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2V2ZW50Q2xvc2VcbiAgICogQGRlc2NyaXB0aW9uIFJlbW92ZSAnYWN0aXZlJyBjbGFzcyBvbiBidXR0b25cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtET01Ob2RlfSBidXR0b25cbiAgICovXG4gIF9ldmVudENsb3NlKGJ1dHRvbikge1xuICAgIHRoaXMuX3JlbW92ZUNsYXNzKGJ1dHRvbiwgJ2FjdGl2ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2V2ZW50TGlzdGVuXG4gICAqIEBkZXNjcmlwdGlvbiBUb2dnbGVzIHdlYXRoZXIgb3Igbm90IGEgYnV0dG9uJ3MgY2xhc3NlcyBhcmUgYmVpbmdcbiAgICogY29uc3RhbnRseSB1cGRhdGVkIHJlZ2FyZGxlc3Mgb2Ygc2Nyb2xscyBvciB3aW5kb3cgcmVzaXplcy5cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtET01Ob2RlfSBidXR0b25cbiAgICogQHBhcmFtIHtET01Ob2RlfSBuZXR3b3Jrc1xuICAgKi9cbiAgX2V2ZW50TGlzdGVuKGJ1dHRvbiwgbmV0d29ya3MpIHtcbiAgICBsZXQgZGltZW5zaW9ucyA9IHRoaXMuX2dldERpbWVuc2lvbnMoYnV0dG9uLCBuZXR3b3Jrcyk7XG4gICAgaWYgKHRoaXMubGlzdGVuZXIgPT09IG51bGwpXG4gICAgICB0aGlzLmxpc3RlbmVyID0gd2luZG93LnNldEludGVydmFsKCgpID0+XG4gICAgICAgIHRoaXMuX2FkanVzdENsYXNzZXMoYnV0dG9uLCBuZXR3b3JrcywgZGltZW5zaW9ucyksIDEwMFxuICAgICAgKTtcbiAgICBlbHNlIHtcbiAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKHRoaXMubGlzdGVuZXIpO1xuICAgICAgdGhpcy5saXN0ZW5lciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2ZpeEZseW91dFxuICAgKiBAZGVzY3JpcHRpb24gRml4ZXMgdGhlIGZseW91dCBlbnRlcmVkIGJ5IHRoZSB1c2VyIHRvIG1hdGNoIHRoZWlyIHByb3ZpZGVkXG4gICAqIG5hbWVzcGFjZVxuICAgKkBwcml2YXRlXG4gICAqL1xuICBfZml4Rmx5b3V0KCkge1xuICAgIGxldCBmbHlvdXRzID0gdGhpcy5jb25maWcudWkuZmx5b3V0LnNwbGl0KCcgJyk7XG4gICAgaWYgKGZseW91dHNbMF0uc3Vic3RyaW5nKDAsdGhpcy5jb25maWcudWkubmFtZXNwYWNlLmxlbmd0aCkgIT09XG4gICAgICAgdGhpcy5jb25maWcudWkubmFtZXNwYWNlKVxuICAgICAgZmx5b3V0c1swXSA9IGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX0ke2ZseW91dHNbMF19YDtcbiAgICBpZiAoZmx5b3V0c1sxXS5zdWJzdHJpbmcoMCx0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2UubGVuZ3RoKSAhPT1cbiAgICAgICB0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2UpXG4gICAgICBmbHlvdXRzWzFdID0gYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfSR7Zmx5b3V0c1sxXX1gO1xuICAgIHRoaXMuY29uZmlnLnVpLmZseW91dCA9IGZseW91dHMuam9pbignICcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2NvbGxpc2lvbkRldGVjdGlvblxuICAgKiBAZGVzY3JpcHRpb24gQWRkcyBsaXN0ZW5lcnMgdGhlIGZpcnN0IHRpbWUgYSBidXR0b24gaXMgY2xpY2tlZCB0byBjYWxsXG4gICAqIHRoaXMuX2FkanVzdENsYXNzZXMgZHVyaW5nIHNjcm9sbHMgYW5kIHJlc2l6ZXMuXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gYnV0dG9uIC0gc2hhcmUgYnV0dG9uXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gbmV0d29ya3MgLSBsaXN0IG9mIHNvY2lhbCBuZXR3b3Jrc1xuICAgKi9cbiAgX2NvbGxpc2lvbkRldGVjdGlvbihidXR0b24sIG5ldHdvcmtzKSB7XG4gICAgbGV0IGRpbWVuc2lvbnMgPSB0aGlzLl9nZXREaW1lbnNpb25zKGJ1dHRvbiwgbmV0d29ya3MpO1xuICAgIHRoaXMuX2FkanVzdENsYXNzZXMoYnV0dG9uLCBuZXR3b3JrcywgZGltZW5zaW9ucyk7XG5cbiAgICBpZiAoIWJ1dHRvbi5jbGFzc0xpc3QuY29udGFpbnMoJ2NsaWNrZWQnKSkge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsICgpID0+XG4gICAgICAgIHRoaXMuX2FkanVzdENsYXNzZXMoYnV0dG9uLCBkaW1lbnNpb25zKSk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT5cbiAgICAgICAgdGhpcy5fYWRqdXN0Q2xhc3NlcyhidXR0b24sIGRpbWVuc2lvbnMpKTtcbiAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdjbGlja2VkJyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2dldERpbWVuc2lvbnNcbiAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgYW4gb2JqZWN0IHdpdGggdGhlIGRpbWVuc2lvbnMgb2YgdGhlIGJ1dHRvbiBhbmRcbiAgICogbGFiZWwgZWxlbWVudHMgb2YgYSBTaGFyZSBCdXR0b24uXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gYnV0dG9uXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gbmV0d29ya3NcbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIF9nZXREaW1lbnNpb25zKGJ1dHRvbiwgbmV0d29ya3MpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmV0d29ya3NXaWR0aDogbmV0d29ya3Mub2Zmc2V0V2lkdGgsXG4gICAgICBidXR0b25IZWlnaHQ6IGJ1dHRvbi5vZmZzZXRIZWlnaHQsXG4gICAgICBidXR0b25XaWR0aDogYnV0dG9uLm9mZnNldFdpZHRoXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9hZGp1c3RDbGFzc2VzXG4gICAqIEBkZXNjcmlwdGlvbiBBZGp1c3RzIHRoZSBwb3NpdGlvbmluZyBvZiB0aGUgbGlzdCBvZiBzb2NpYWwgbmV0d29ya3MgYmFzZWRcbiAgICogb2ZmIG9mIHdoZXJlIHRoZSBzaGFyZSBidXR0b24gaXMgcmVsYXRpdmUgdG8gdGhlIHdpbmRvdy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtET01Ob2RlfSBidXR0b25cbiAgICogQHBhcmFtIHtET01Ob2RlfSBuZXR3b3Jrc1xuICAgKiBAcGFyYW0ge09iamVjdH0gZGltZW5zaW9uc1xuICAgKi9cbiAgX2FkanVzdENsYXNzZXMoYnV0dG9uLCBuZXR3b3JrcywgZGltZW5zaW9ucykge1xuICAgIGxldCB3aW5kb3dXaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIGxldCB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgbGV0IGxlZnRPZmZzZXQgPSBidXR0b24uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArXG4gICAgICBkaW1lbnNpb25zLmJ1dHRvbldpZHRoIC8gMjtcbiAgICBsZXQgcmlnaHRPZmZzZXQgPSB3aW5kb3dXaWR0aCAtIGxlZnRPZmZzZXQ7XG4gICAgbGV0IHRvcE9mZnNldCA9IGJ1dHRvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgK1xuICAgICAgZGltZW5zaW9ucy5idXR0b25IZWlnaHQgLyAyO1xuICAgIGxldCBwb3NpdGlvbiA9XG4gICAgICB0aGlzLl9maW5kTG9jYXRpb24obGVmdE9mZnNldCwgdG9wT2Zmc2V0LCB3aW5kb3dXaWR0aCwgd2luZG93SGVpZ2h0KTtcblxuICAgIGlmIChwb3NpdGlvblsxXSA9PT0gXCJtaWRkbGVcIiAmJiBwb3NpdGlvblswXSAhPT0gXCJjZW50ZXJcIiAmJlxuICAgICAgICAoKHBvc2l0aW9uWzBdID09PSBcImxlZnRcIiAmJlxuICAgICAgICAgIHdpbmRvd1dpZHRoIDw9IGxlZnRPZmZzZXQgKyAyMjAgKyBkaW1lbnNpb25zLmJ1dHRvbldpZHRoIC8gMikgfHxcbiAgICAgICAgKHBvc2l0aW9uWzBdID09PSBcInJpZ2h0XCIgJiZcbiAgICAgICAgICB3aW5kb3dXaWR0aCA8PSByaWdodE9mZnNldCArIDIyMCArIGRpbWVuc2lvbnMuYnV0dG9uV2lkdGggLyAyKVxuICAgICAgICApXG4gICAgICApIHtcbiAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9dG9wYCk7XG4gICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfW1pZGRsZWApO1xuICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1ib3R0b21gKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzd2l0Y2gocG9zaXRpb25bMF0pIHtcbiAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QuYWRkKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1yaWdodGApO1xuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWNlbnRlcmApO1xuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWxlZnRgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNlbnRlclwiOlxuICAgICAgICAgIGlmIChwb3NpdGlvblsxXSAhPT0gXCJ0b3BcIilcbiAgICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfXRvcGApO1xuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWNlbnRlcmApO1xuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWxlZnRgKTtcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QucmVtb3ZlKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1yaWdodGApO1xuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfW1pZGRsZWApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICBuZXR3b3Jrcy5jbGFzc0xpc3QuYWRkKGAke3RoaXMuY29uZmlnLnVpLm5hbWVzcGFjZX1sZWZ0YCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9Y2VudGVyYCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9cmlnaHRgKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHN3aXRjaChwb3NpdGlvblsxXSkge1xuICAgICAgICBjYXNlIFwidG9wXCI6XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9Ym90dG9tYCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9bWlkZGxlYCk7XG4gICAgICAgICAgaWYgKHBvc2l0aW9uWzBdICE9PSBcImNlbnRlclwiKVxuICAgICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9dG9wYCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtaWRkbGVcIjpcbiAgICAgICAgICBpZiAocG9zaXRpb25bMF0gIT09IFwiY2VudGVyXCIpIHtcbiAgICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5hZGQoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfW1pZGRsZWApO1xuICAgICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9dG9wYCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5ldHdvcmtzLmNsYXNzTGlzdC5yZW1vdmUoYCR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfWJvdHRvbWApO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm90dG9tXCI6XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LmFkZChgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9dG9wYCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9bWlkZGxlYCk7XG4gICAgICAgICAgbmV0d29ya3MuY2xhc3NMaXN0LnJlbW92ZShgJHt0aGlzLmNvbmZpZy51aS5uYW1lc3BhY2V9Ym90dG9tYCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2ZpbmRMb2NhdGlvblxuICAgKiBAZGVzY3JpcHRpb24gRmluZHMgdGhlIGxvY2F0aW9uIG9mIHRoZSBsYWJlbCBnaXZlbiBieSBpdHMgeCBhbmQgeSB2YWx1ZVxuICAgKiB3aXRoIHJlc3BlY3QgdG8gdGhlIHdpbmRvdyB3aWR0aCBhbmQgd2luZG93IGhlaWdodCBnaXZlbi5cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtudW1iZXJ9IGxhYmVsWFxuICAgKiBAcGFyYW0ge251bWJlcn0gbGFiZWxZXG4gICAqIEBwYXJhbSB7bnVtYmVyfSB3aW5kb3dXaWR0aFxuICAgKiBAcGFyYW0ge251bWJlcn0gd2luZG93SGVpZ2h0XG4gICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICovXG4gIF9maW5kTG9jYXRpb24obGFiZWxYLCBsYWJlbFksIHdpbmRvd1dpZHRoLCB3aW5kb3dIZWlnaHQpIHtcbiAgICBsZXQgeFBvc2l0aW9uID0gW1wibGVmdFwiLCBcImNlbnRlclwiLCBcInJpZ2h0XCJdO1xuICAgIGxldCB5UG9zaXRpb24gPSBbXCJ0b3BcIiwgXCJtaWRkbGVcIiwgXCJib3R0b21cIl07XG4gICAgbGV0IHhMb2NhdGlvbiA9XG4gICAgICBNYXRoLnRydW5jKDMgKiAoMSAtICgod2luZG93V2lkdGggLSBsYWJlbFgpIC8gd2luZG93V2lkdGgpKSk7XG4gICAgbGV0IHlMb2NhdGlvbiA9XG4gICAgICBNYXRoLnRydW5jKDMgKiAoMSAtICgod2luZG93SGVpZ2h0IC0gbGFiZWxZKSAvIHdpbmRvd0hlaWdodCkpKTtcbiAgICBpZiAoeExvY2F0aW9uID49IDMpIHhMb2NhdGlvbiA9IDI7XG4gICAgZWxzZSBpZiAoeExvY2F0aW9uIDw9IC0xKSB4TG9jYXRpb24gPSAwO1xuICAgIGlmICh5TG9jYXRpb24gPj0gMykgeUxvY2F0aW9uID0gMjtcbiAgICBlbHNlIGlmICh5TG9jYXRpb24gPD0gLTEpIHlMb2NhdGlvbiA9IDA7XG4gICAgcmV0dXJuIFt4UG9zaXRpb25beExvY2F0aW9uXSwgeVBvc2l0aW9uW3lMb2NhdGlvbl1dO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX25ldHdvcmtGYWNlYm9va1xuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlICYgZGlzcGxheSBhIEZhY2Vib29rIHdpbmRvd1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25ldHdvcmtGYWNlYm9vayhlbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmxvYWRTZGspIHtcbiAgICAgIGlmICghd2luZG93LkZCKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1RoZSBGYWNlYm9vayBKUyBTREsgaGFzblxcJ3QgbG9hZGVkIHlldC4nKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZUhyZWYoZWxlbWVudCwgJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9zaGFyZXIvc2hhcmVyLnBocCcsIHtcbiAgICAgICAgICB1OiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay51cmxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gRkIudWkoe1xuICAgICAgICBtZXRob2Q6J2ZlZWQnLFxuICAgICAgICBuYW1lOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay50aXRsZSxcbiAgICAgICAgbGluazogdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2sudXJsLFxuICAgICAgICBwaWN0dXJlOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5pbWFnZSxcbiAgICAgICAgY2FwdGlvbjogdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suY2FwdGlvbixcbiAgICAgICAgZGVzY3JpcHRpb246IHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmRlc2NyaXB0aW9uXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZUhyZWYoXG4gICAgICAgIGVsZW1lbnQsXG4gICAgICAgICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyL3NoYXJlci5waHAnLCB7XG4gICAgICAgICAgdTogdGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2sudXJsXG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX25ldHdvcmtUd2l0dGVyXG4gICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgJiBkaXNwbGF5IGEgVHdpdHRlciB3aW5kb3dcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9uZXR3b3JrVHdpdHRlcihlbGVtZW50KSB7XG4gICAgdGhpcy5fdXBkYXRlSHJlZihlbGVtZW50LCAnaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQnLCB7XG4gICAgICB0ZXh0OiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy50d2l0dGVyLmRlc2NyaXB0aW9uLFxuICAgICAgdXJsOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy50d2l0dGVyLnVybFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX25ldHdvcmtHb29nbGVQbHVzXG4gICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgJiBkaXNwbGF5IGEgR29vZ2xlIFBsdXMgd2luZG93XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbmV0d29ya0dvb2dsZVBsdXMoZWxlbWVudCkge1xuICAgIHRoaXMuX3VwZGF0ZUhyZWYoZWxlbWVudCwgJ2h0dHBzOi8vcGx1cy5nb29nbGUuY29tL3NoYXJlJywge1xuICAgICAgdXJsOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5nb29nbGVQbHVzLnVybFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX25ldHdvcmtQaW50ZXJlc3RcbiAgICogQGRlc2NyaXB0aW9uIENyZWF0ZSAmIGRpc3BsYXkgYSBQaW50ZXJlc3Qgd2luZG93XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbmV0d29ya1BpbnRlcmVzdChlbGVtZW50KSB7XG4gICAgdGhpcy5fdXBkYXRlSHJlZihlbGVtZW50LCAnaHR0cHM6Ly93d3cucGludGVyZXN0LmNvbS9waW4vY3JlYXRlL2J1dHRvbicsIHtcbiAgICAgIHVybDogdGhpcy5jb25maWcubmV0d29ya3MucGludGVyZXN0LnVybCxcbiAgICAgIG1lZGlhOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5waW50ZXJlc3QuaW1hZ2UsXG4gICAgICBkZXNjcmlwdGlvbjogdGhpcy5jb25maWcubmV0d29ya3MucGludGVyZXN0LmRlc2NyaXB0aW9uXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfbmV0d29ya0xpbmtlZEluXG4gICAqIEBkZXNjcmlwdGlvbiBDcmVhdGUgJiBkaXNwbGF5IGEgTGlua2VkaW4gd2luZG93XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfbmV0d29ya0xpbmtlZGluKGVsZW1lbnQpIHtcbiAgICB0aGlzLl91cGRhdGVIcmVmKGVsZW1lbnQsICdodHRwczovL3d3dy5saW5rZWRpbi5jb20vc2hhcmVBcnRpY2xlJywge1xuICAgICAgbWluaTogJ3RydWUnLFxuICAgICAgdXJsOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5saW5rZWRpbi51cmwsXG4gICAgICB0aXRsZTogdGhpcy5jb25maWcubmV0d29ya3MubGlua2VkaW4udGl0bGUsXG4gICAgICBzdW1tYXJ5OiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5saW5rZWRpbi5kZXNjcmlwdGlvblxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX25ldHdvcmtFbWFpbFxuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlICYgZGlzcGxheSBhbiBFbWFpbCB3aW5kb3dcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9uZXR3b3JrRW1haWwoZWxlbWVudCkge1xuICAgIHRoaXMuX3VwZGF0ZUhyZWYoZWxlbWVudCwgJ21haWx0bzonLCB7XG4gICAgICBzdWJqZWN0OiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5lbWFpbC50aXRsZSxcbiAgICAgIGJvZHk6IHRoaXMuY29uZmlnLm5ldHdvcmtzLmVtYWlsLmRlc2NyaXB0aW9uXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfbmV0d29ya1JlZGRpdFxuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlICYgZGlzcGxheSBhIFJlZGRpdCB3aW5kb3dcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9uZXR3b3JrUmVkZGl0KGVsZW1lbnQpIHtcbiAgICB0aGlzLl91cGRhdGVIcmVmKGVsZW1lbnQsICdodHRwOi8vd3d3LnJlZGRpdC5jb20vc3VibWl0Jywge1xuICAgICAgdXJsOiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5yZWRkaXQudXJsLFxuICAgICAgdGl0bGU6IHRoaXMuY29uZmlnLm5ldHdvcmtzLnJlZGRpdC50aXRsZVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX25ldHdvcmtXaGF0c2FwcFxuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlICYgZGlzcGxheSBhIFdoYXRzYXBwIHdpbmRvd1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX25ldHdvcmtXaGF0c2FwcChlbGVtZW50KSB7XG4gICAgdGhpcy5fdXBkYXRlSHJlZihlbGVtZW50LCAnd2hhdHNhcHA6Ly9zZW5kJywge1xuICAgICAgdGV4dDogdGhpcy5jb25maWcubmV0d29ya3Mud2hhdHNhcHAuZGVzY3JpcHRpb24gKyBcIiBcIiArXG4gICAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzLndoYXRzYXBwLnVybFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2luamVjdFN0eWxlc2hlZXRcbiAgICogQGRlc2NyaXB0aW9uIEluamVjdCBsaW5rIHRvIHN0eWxlc2hlZXRcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICAgKi9cbiAgX2luamVjdFN0eWxlc2hlZXQodXJsKSB7XG4gICAgaWYgKCF0aGlzLmVsLmhlYWQucXVlcnlTZWxlY3RvcihgbGlua1tocmVmPScke3VybH0nXWApKSB7XG4gICAgICBsZXQgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuICAgICAgbGluay5zZXRBdHRyaWJ1dGUoXCJyZWxcIiwgXCJzdHlsZXNoZWV0XCIpO1xuICAgICAgbGluay5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIHVybCk7XG4gICAgICB0aGlzLmVsLmhlYWQuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2luamVjdEh0bWxcbiAgICogQGRlc2NyaXB0aW9uIEluamVjdCBidXR0b24gc3RydWN0dXJlXG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gaW5zdGFuY2VcbiAgICovXG4gIF9pbmplY3RIdG1sKGluc3RhbmNlKSB7XG4gICAgbGV0IG5ldHdvcmtzID0gdGhpcy5jb25maWcudWkubmV0d29ya09yZGVyO1xuICAgIGxldCBuZXR3b3JrTGlzdCA9ICcnO1xuXG4gICAgZm9yIChsZXQgbmV0d29yayBvZiBuZXR3b3Jrcykge1xuICAgICAgbmV0d29ya0xpc3QgKz0gYDxsaSBjbGFzcz0nJHtuZXR3b3JrfScgZGF0YS1uZXR3b3JrPScke25ldHdvcmt9Jz48YT48L2E+PC9saT5gO1xuICAgIH1cbiAgICBpbnN0YW5jZS5pbm5lckhUTUwgPSBgJHt0aGlzLmNvbmZpZy51aS5idXR0b25UZXh0fTxkaXYgY2xhc3M9JyR7dGhpcy5jb25maWcudWkubmFtZXNwYWNlfXNvY2lhbCBsb2FkICR7dGhpcy5jb25maWcudWkuZmx5b3V0fSc+PHVsPmAgKyBuZXR3b3JrTGlzdCArIGA8L3VsPjwvZGl2PmA7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfaW5qZWN0RmFjZWJvb2tTZGtcbiAgICogQGRlc2NyaXB0aW9uIEluamVjdCBGYWNlYm9vayBTREtcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9pbmplY3RGYWNlYm9va1NkaygpIHtcbiAgICBpZiAoIXdpbmRvdy5GQiAmJiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5hcHBJZCAmJlxuICAgICAgICAhdGhpcy5lbC5ib2R5LnF1ZXJ5U2VsZWN0b3IoJyNmYi1yb290JykpIHtcbiAgICAgIGxldCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgIHNjcmlwdC50ZXh0ID0gYHdpbmRvdy5mYkFzeW5jSW5pdD1mdW5jdGlvbigpe0ZCLmluaXQoe2FwcElkOicke3RoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmFwcElkfScsc3RhdHVzOnRydWUseGZibWw6dHJ1ZX0pfTsoZnVuY3Rpb24oZSx0LG4pe3ZhciByLGk9ZS5nZXRFbGVtZW50c0J5VGFnTmFtZSh0KVswXTtpZiAoZS5nZXRFbGVtZW50QnlJZChuKSl7cmV0dXJufXI9ZS5jcmVhdGVFbGVtZW50KHQpO3IuaWQ9bjtyLnNyYz0nLy9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9VUy9hbGwuanMnO2kucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUocixpKX0pKGRvY3VtZW50LCdzY3JpcHQnLCdmYWNlYm9vay1qc3NkaycpO2A7XG5cbiAgICAgIGxldCBmYlJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGZiUm9vdC5pZCA9ICdmYi1yb290JztcblxuICAgICAgdGhpcy5lbC5ib2R5LmFwcGVuZENoaWxkKGZiUm9vdCk7XG4gICAgICB0aGlzLmVsLmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfaG9va1xuICAgKiBAZGVzY3JpcHRpb24gSG9vayBoZWxwZXIgZnVuY3Rpb25cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9ICAgdHlwZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gICBuZXR3b3JrXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gIGluc3RhbmNlXG4gICAqL1xuICBfaG9vayh0eXBlLCBuZXR3b3JrLCBpbnN0YW5jZSkge1xuICAgIGxldCBmbiA9IHRoaXMuY29uZmlnLm5ldHdvcmtzW25ldHdvcmtdW3R5cGVdO1xuXG4gICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgbGV0IG9wdHMgPSBmbi5jYWxsKHRoaXMuY29uZmlnLm5ldHdvcmtzW25ldHdvcmtdLCBpbnN0YW5jZSk7XG5cbiAgICAgIGlmIChvcHRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgb3B0cyA9IHRoaXMuX25vcm1hbGl6ZUZpbHRlckNvbmZpZ1VwZGF0ZXMob3B0cyk7XG4gICAgICAgIHRoaXMuZXh0ZW5kKHRoaXMuY29uZmlnLm5ldHdvcmtzW25ldHdvcmtdLCBvcHRzLCB0cnVlKTtcbiAgICAgICAgdGhpcy5fbm9ybWFsaXplTmV0d29ya0NvbmZpZ3VyYXRpb24oKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfZGVmYXVsdFRpdGxlXG4gICAqIEBkZXNjcmlwdGlvbiBHZXRzIGRlZmF1bHQgdGl0bGVcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHJldHVybnMge1N0cmluZ31cbiAgICovXG4gIF9kZWZhdWx0VGl0bGUoKSB7XG4gICAgbGV0IGNvbnRlbnQ7XG4gICAgaWYgKChjb250ZW50ID0gKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbcHJvcGVydHk9XCJvZzp0aXRsZVwiXScpIHx8XG4gICAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdtZXRhW25hbWU9XCJ0d2l0dGVyOnRpdGxlXCJdJykpKSlcbiAgICAgIHJldHVybiBjb250ZW50LmdldEF0dHJpYnV0ZSgnY29udGVudCcpO1xuICAgIGVsc2UgaWYgKChjb250ZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcigndGl0bGUnKSkpXG4gICAgICByZXR1cm4gY29udGVudC50ZXh0Q29udGVudCB8fCBjb250ZW50LmlubmVyVGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9kZWZhdWx0SW1hZ2VcbiAgICogQGRlc2NyaXB0aW9uIEdldHMgZGVmYXVsdCBpbWFnZVxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgKi9cbiAgX2RlZmF1bHRJbWFnZSgpIHtcbiAgICBsZXQgY29udGVudDtcbiAgICBpZiAoKGNvbnRlbnQgPSAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtwcm9wZXJ0eT1cIm9nOmltYWdlXCJdJykgfHxcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPVwidHdpdHRlcjppbWFnZVwiXScpKSkpXG4gICAgICByZXR1cm4gY29udGVudC5nZXRBdHRyaWJ1dGUoJ2NvbnRlbnQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9kZWZhdWx0RGVzY3JpcHRpb25cbiAgICogQGRlc2NyaXB0aW9uIEdldHMgZGVmYXVsdCBkZXNjcmlwdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfVxuICAgKi9cbiAgX2RlZmF1bHREZXNjcmlwdGlvbigpIHtcbiAgICBsZXQgY29udGVudDtcbiAgICBpZiAoKGNvbnRlbnQgPSAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtwcm9wZXJ0eT1cIm9nOmRlc2NyaXB0aW9uXCJdJykgfHxcbiAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ21ldGFbbmFtZT1cInR3aXR0ZXI6ZGVzY3JpcHRpb25cIl0nKSB8fFxuICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPVwiZGVzY3JpcHRpb25cIl0nKSkpKVxuICAgICAgcmV0dXJuIGNvbnRlbnQuZ2V0QXR0cmlidXRlKCdjb250ZW50Jyk7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2RldGVjdE5ldHdvcmtzXG4gICAqIEBkZXNjcmlwdGlvbiBEZXRlY3QgbnVtYmVyIG9mIG5ldHdvcmtzIGluIHVzZSBhbmQgZGlzcGxheS9oaWRlXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGV0ZWN0TmV0d29ya3MoKSB7XG4gICAgLy8gVXBkYXRlIG5ldHdvcmstc3BlY2lmaWMgY29uZmlndXJhdGlvbiB3aXRoIGdsb2JhbCBjb25maWd1cmF0aW9uc1xuICAgIGZvciAobGV0IG5ldHdvcmsgb2YgT2JqZWN0LmtleXModGhpcy5jb25maWcubmV0d29ya3MpKSB7XG4gICAgICBsZXQgZGlzcGxheTtcbiAgICAgIGZvciAobGV0IG9wdGlvbiBvZiBPYmplY3Qua2V5cyh0aGlzLmNvbmZpZy5uZXR3b3Jrc1tuZXR3b3JrXSkpIHtcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLm5ldHdvcmtzW25ldHdvcmtdW29wdGlvbl0gPT09IG51bGwpIHtcbiAgICAgICAgICB0aGlzLmNvbmZpZy5uZXR3b3Jrc1tuZXR3b3JrXVtvcHRpb25dID0gdGhpcy5jb25maWdbb3B0aW9uXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayBmb3IgZW5hYmxlZCBuZXR3b3JrcyBhbmQgZGlzcGxheSB0aGVtXG4gICAgICBpZiAodGhpcy5jb25maWcubmV0d29ya3NbbmV0d29ya10uZW5hYmxlZCkge1xuICAgICAgICB0aGlzLmNsYXNzID0gJ2VuYWJsZWQnO1xuICAgICAgICB0aGlzLmNvbmZpZy5lbmFibGVkTmV0d29ya3MgKz0gMTtcbiAgICAgIH1cbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5jbGFzcyA9ICdkaXNhYmxlZCc7XG5cbiAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzW25ldHdvcmtdLmNsYXNzID0gdGhpcy5jbGFzcztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfbm9ybWFsaXplTmV0d29ya0NvbmZpZ3VyYXRpb25cbiAgICogQGRlc2NyaXB0aW9uIE5vcm1hbGl6ZXMgbmV0d29yayBjb25maWd1cmF0aW9uIGZvciBGYWNlYm9vayAmIFR3aXR0ZXJcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9ub3JtYWxpemVOZXR3b3JrQ29uZmlndXJhdGlvbigpIHtcbiAgICAvLyBEb24ndCBsb2FkIEZCIFNESyBpZiBGQiBhcHBJZCBpc24ndCBwcmVzZW50XG4gICAgaWYgKCF0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5hcHBJZClcbiAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmxvYWRTZGsgPSBmYWxzZTtcblxuICAgIC8vIEVuY29kZSBUd2l0dGVyIGRlc2NyaXB0aW9uIGZvciBVUkxcbiAgICBpZiAoISF0aGlzLmNvbmZpZy5uZXR3b3Jrcy50d2l0dGVyLmRlc2NyaXB0aW9uKVxuICAgICAgaWYgKCF0aGlzLl9pc0VuY29kZWQodGhpcy5jb25maWcubmV0d29ya3MudHdpdHRlci5kZXNjcmlwdGlvbikpXG4gICAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzLnR3aXR0ZXIuZGVzY3JpcHRpb24gPVxuICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLmNvbmZpZy5uZXR3b3Jrcy50d2l0dGVyLmRlc2NyaXB0aW9uKTtcblxuICAgIC8vIFR5cGVjYXN0IEZhY2Vib29rIGFwcElkIHRvIGEgU3RyaW5nXG4gICAgaWYgKHR5cGVvZiB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5hcHBJZCA9PT0gJ251bWJlcicpXG4gICAgICB0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5hcHBJZCA9XG4gICAgICAgIHRoaXMuY29uZmlnLm5ldHdvcmtzLmZhY2Vib29rLmFwcElkLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfbm9ybWFsaXplRmlsdGVyQ29uZmlnVXBkYXRlc1xuICAgKiBAZGVzY3JpcHRpb24gTm9ybWFsaXplcyBGYWNlYm9vayBjb25maWdcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdHNcbiAgICogQHJldHVybnMge09iamVjdH1cbiAgICovXG4gIF9ub3JtYWxpemVGaWx0ZXJDb25maWdVcGRhdGVzKG9wdHMpIHtcbiAgICBpZiAodGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2suYXBwSWQgIT09IG9wdHMuYXBwSWQpIHtcbiAgICAgIGNvbnNvbGUud2FybignWW91IGFyZSB1bmFibGUgdG8gY2hhbmdlIHRoZSBGYWNlYm9vayBhcHBJZCBhZnRlciB0aGUgYnV0dG9uIGhhcyBiZWVuIGluaXRpYWxpemVkLiBQbGVhc2UgdXBkYXRlIHlvdXIgRmFjZWJvb2sgZmlsdGVycyBhY2NvcmRpbmdseS4nKTtcbiAgICAgIGRlbGV0ZShvcHRzLmFwcElkKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcubmV0d29ya3MuZmFjZWJvb2subG9hZFNkayAhPT0gb3B0cy5sb2FkU2RrKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1lvdSBhcmUgdW5hYmxlIHRvIGNoYW5nZSB0aGUgRmFjZWJvb2sgbG9hZFNkayBvcHRpb24gYWZ0ZXIgdGhlIGJ1dHRvbiBoYXMgYmVlbiBpbml0aWFsaXplZC4gUGxlYXNlIHVwZGF0ZSB5b3VyIEZhY2Vib29rIGZpbHRlcnMgYWNjb3JkaW5nbHkuJyk7XG4gICAgICBkZWxldGUob3B0cy5hcHBJZCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wdHM7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTaGFyZUJ1dHRvbjtcbiJdfQ==
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

          if (typeof sourceProperty === 'object' &&
          // Avoid an infinite loop if a DOM element is hit.
          !(sourceProperty instanceof Node)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9tZWRpYS9yeWFuL3N0dWZmL3NoYXJlLWJ1dHRvbi9zcmMvc2hhcmUtdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OzJCQUF3QixnQkFBZ0I7Ozs7Ozs7Ozs7SUFPbEMsVUFBVTtXQUFWLFVBQVU7MEJBQVYsVUFBVTs7O2VBQVYsVUFBVTs7V0FDTCxtQkFBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0FBQ2xCLFVBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsVUFBSSxRQUFRLENBQUMsV0FBVyxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7QUFDakUsZ0JBQVEsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FDdEQsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDMUIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxZQUFZLEVBQUU7QUFDM0IsV0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLFVBQVUsUUFBUSxFQUFFLEVBQUUsRUFBRTtBQUNuRCxpQkFBTyxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDekIsQ0FBQyxDQUFDO0FBQ0gsZ0JBQVEsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2xDOztBQUVELGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7Ozs7Ozs7OztXQVNJLGVBQUMsRUFBRSxFQUFFO0FBQ1IsUUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0tBQzNCOzs7Ozs7Ozs7OztXQVNJLGVBQUMsRUFBRSxFQUFFO0FBQ1IsUUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0tBQzlCOzs7Ozs7Ozs7Ozs7O1dBV1EsbUJBQUMsRUFBRSxFQUFFLFNBQVMsRUFBRTtBQUN2QixhQUFPLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFNB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QUFBLEFBRW5ELE9BQU8sR0FBRyxDQUFDO0tBQ1o7Ozs7Ozs7Ozs7OztXQVVRLHFCQUFHO0FBQ1YsYUFBTyxTQUFTLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxJQUN0RCxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ2pEOzs7U0FwUkcsVUFBVTs7O3FCQXVSRCxVQUFVIiwiZmlsZSI6Ii9tZWRpYS9yeWFuL3N0dWZmL3NoYXJlLWJ1dHRvbi9zcmMvc2hhcmUtdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3RyaW5nVXRpbHMgZnJvbSAnLi9zdHJpbmctdXRpbHMnO1xuXG4vKipcbiAqIFNoYXJlVXRpbHNcbiAqIEBjbGFzc1xuICogQGNsYXNzZGVzYyBBIG5pY2Ugc2V0IG9mIHV0aWxpdGllcy5cbiAqL1xuY2xhc3MgU2hhcmVVdGlscyB7XG4gIF9nZXRTdHlsZShlbGUsIGNzcykge1xuICAgIHZhciBzdHJWYWx1ZSA9IFwiXCI7XG5cbiAgICBpZiAoZG9jdW1lbnQuZGVmYXVsdFZpZXcgJiYgZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZSkge1xuICAgICAgc3RyVmFsdWUgPSBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGVsZSwgXCJcIilcbiAgICAgICAgLmdldFByb3BlcnR5VmFsdWUoY3NzKTtcbiAgICB9IGVsc2UgaWYgKGVsZS5jdXJyZW50U3R5bGUpIHtcbiAgICAgIGNzcyA9IGNzcy5yZXBsYWNlKC9cXC0oXFx3KS9nLCBmdW5jdGlvbiAoc3RyTWF0Y2gsIHAxKSB7XG4gICAgICAgIHJldHVybiBwMS50b1VwcGVyQ2FzZSgpO1xuICAgICAgfSk7XG4gICAgICBzdHJWYWx1ZSA9IGVsZS5jdXJyZW50U3R5bGVbY3NzXTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyVmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfaGlkZVxuICAgKiBAZGVzY3JpcHRpb24gQ2hhbmdlIGVsZW1lbnQncyBkaXNwbGF5IHRvICdub25lJ1xuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGVsXG4gICAqL1xuICBfaGlkZShlbCkge1xuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9zaG93XG4gICAqIEBkZXNjcmlwdGlvbiBDaGFuZ2UgZWxlbWVudCdzIGRpc3BsYXkgdG8gJ2Jsb2NrJ1xuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGVsXG4gICAqL1xuICBfc2hvdyhlbCkge1xuICAgIGVsLnN0eWxlLmRpc3BsYXkgPSBcImluaXRpYWxcIjtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9oYXNDbGFzc1xuICAgKiBAZGVzY3JpcHRpb24gV3JhcHBlciB0byBzZWUgaWYgYW4gZWxlbWVudCBjb250YWlucyBhIGNsYXNzLlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgY2xhc3NOYW1lXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgX2hhc0NsYXNzKGVsLCBjbGFzc05hbWUpIHtcbiAgICByZXR1cm4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBhZGRDbGFzc1xuICAgKiBAZGVzY3JpcHRpb24gV3JhcHBlciB0byBhZGQgY2xhc3MgdG8gZWxlbWVudC5cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtET01Ob2RlfSBlbFxuICAgKiBAcGFyYW0ge1N0cmluZ30gIGNsYXNzTmFtZVxuICAgKi9cbiAgX2FkZENsYXNzKGVsLCBjbGFzc05hbWUpIHtcbiAgICBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCByZW1vdmVDbGFzc1xuICAgKiBAZGVzY3JpcHRpb24gV3JhcHBlciB0byByZW1vdmUgY2xhc3MgZnJvbSBlbGVtZW50LlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgY2xhc3NOYW1lXG4gICAqL1xuICBfcmVtb3ZlQ2xhc3MoZWwsIGNsYXNzTmFtZSkge1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIF9pc0VuY29kZWRcbiAgICogQGRlc2NyaXB0aW9uIFdyYXBwZXIgdG8gY2hlY2sgaWYgdGhlIHN0cmluZyBpcyBlbmNvZGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gIHN0clxuICAgKiBAcGFyYW0ge0Jvb2xlYW59XG4gICAqL1xuICBfaXNFbmNvZGVkKHN0cikge1xuICAgIHN0ciA9IFN0cmluZ1V0aWxzLnRvUkZDMzk4NihzdHIpO1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKSAhPT0gc3RyO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2VuY29kZVxuICAgKiBAZGVzY3JpcHRpb24gV3JhcHBlciB0byBfZW5jb2RlIGEgc3RyaW5nIGlmIHRoZSBzdHJpbmcgaXNuJ3QgYWxyZWFkeSBlbmNvZGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKlxuICAgKiBAcGFyYW0ge0RPTU5vZGV9IGVsXG4gICAqIEBwYXJhbSB7U3RyaW5nfSAgY2xhc3NOYW1lXG4gICAqL1xuICBfZW5jb2RlKHN0cikge1xuICAgIGlmICh0eXBlb2Ygc3RyID09PSAndW5kZWZpbmVkJyB8fCBzdHIgPT09IG51bGwgfHwgdGhpcy5faXNFbmNvZGVkKHN0cikpXG4gICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHN0cik7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFN0cmluZ1V0aWxzLnRvUkZDMzk4NihzdHIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX2dldFVybFxuICAgKiBAZGVzY3JpcHRpb24gUmV0dXJucyB0aGUgY29ycmVjdCBzaGFyZSBVUkwgYmFzZWQgb2ZmIG9mIHRoZSBpbmNvbWluZ1xuICAgKiBVUkwgYW5kIHBhcmFtZXRlcnMgZ2l2ZW5cbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IGVuY29kZVxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zXG4gICAqL1xuICBfZ2V0VXJsKHVybCwgZW5jb2RlPWZhbHNlLCBwYXJhbXM9e30pIHtcbiAgICBsZXQgcXMgPSAoKCkgPT4ge1xuICAgICAgbGV0IHJlc3VsdHMgPSBbXTtcbiAgICAgIGZvciAobGV0IGsgb2YgT2JqZWN0LmtleXMocGFyYW1zKSkge1xuICAgICAgICBsZXQgdiA9IHBhcmFtc1trXTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGAke2t9PSR7dGhpcy5fZW5jb2RlKHYpfWApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHMuam9pbignJicpO1xuICAgIH0pKCk7XG5cbiAgICBpZiAocXMpIHFzID0gYD8ke3FzfWA7XG5cbiAgICByZXR1cm4gdXJsICsgcXM7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfdXBkYXRlSHJlZlxuICAgKiBAZGVzY3JpcHRpb24gTWFrZXMgdGhlIGVsZW1lbnRzIGEgdGFnIGhhdmUgYSBocmVmIG9mIHRoZSBwb3B1cCBsaW5rIGFuZFxuICAgKiBhcyBwb3BzIHVwIHRoZSBzaGFyZSB3aW5kb3cgZm9yIHRoZSBlbGVtZW50XG4gICAqIEBwcml2YXRlXG4gICAqXG4gICAqIEBwYXJhbSB7RE9NTm9kZX0gZWxlbWVudFxuICAgKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXNcbiAgICovXG4gIF91cGRhdGVIcmVmKGVsZW1lbnQsIHVybCwgcGFyYW1zKSB7XG4gICAgbGV0IGVuY29kZSA9IHVybC5pbmRleE9mKCdtYWlsdG86JykgPj0gMDtcbiAgICBsZXQgYSA9IGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2EnKVswXTtcbiAgICBhLnNldEF0dHJpYnV0ZSgnaHJlZicsIHRoaXMuX2dldFVybCh1cmwsICFlbmNvZGUsIHBhcmFtcykpO1xuICAgIGlmKCFlbmNvZGUgJiYgKCF0aGlzLmNvbmZpZy5uZXR3b3Jrcy5mYWNlYm9vay5sb2FkU2RrIHx8IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdjbGFzcycpICE9PSAnZmFjZWJvb2snKSkge1xuICAgICAgbGV0IHBvcHVwID0ge1xuICAgICAgICB3aWR0aDogNTAwLFxuICAgICAgICBoZWlnaHQ6IDM1MFxuICAgICAgfTtcblxuICAgICAgcG9wdXAudG9wID0gKHNjcmVlbi5oZWlnaHQgLyAyKSAtIChwb3B1cC5oZWlnaHQgLyAyKTtcbiAgICAgIHBvcHVwLmxlZnQgPSAoc2NyZWVuLndpZHRoIC8gMikgIC0gKHBvcHVwLndpZHRoIC8gMik7XG5cbiAgICAgIHdpbmRvdy5vcGVuKFxuICAgICAgICBhLmhyZWYsXG4gICAgICAgICd0YXJnZXRXaW5kb3cnLCBgXG4gICAgICAgICAgdG9vbGJhcj1ubyxcbiAgICAgICAgICBsb2NhdGlvbj1ubyxcbiAgICAgICAgICBzdGF0dXM9bm8sXG4gICAgICAgICAgbWVudWJhcj1ubyxcbiAgICAgICAgICBzY3JvbGxiYXJzPXllcyxcbiAgICAgICAgICByZXNpemFibGU9eWVzLFxuICAgICAgICAgIGxlZnQ9JHtwb3B1cC5sZWZ0fSxcbiAgICAgICAgICB0b3A9JHtwb3B1cC50b3B9LFxuICAgICAgICAgIHdpZHRoPSR7cG9wdXAud2lkdGh9LFxuICAgICAgICAgIGhlaWdodD0ke3BvcHVwLmhlaWdodH1cbiAgICAgICAgYFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBwb3B1cFxuICAgKiBAZGVzY3JpcHRpb24gQ3JlYXRlIGEgd2luZG93IGZvciBzcGVjaWZpZWQgbmV0d29ya1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gIHVybFxuICAgKiBAcGFyYW0ge09iamVjdH0gIHBhcmFtc1xuICAgKi9cbiAgcG9wdXAodXJsLCBwYXJhbXM9e30pIHtcbiAgICBsZXQgcG9wdXAgPSB7XG4gICAgICB3aWR0aDogNTAwLFxuICAgICAgaGVpZ2h0OiAzNTBcbiAgICB9O1xuXG4gICAgcG9wdXAudG9wID0gKHNjcmVlbi5oZWlnaHQgLyAyKSAtIChwb3B1cC5oZWlnaHQgLyAyKTtcbiAgICBwb3B1cC5sZWZ0ID0gKHNjcmVlbi53aWR0aCAvIDIpICAtIChwb3B1cC53aWR0aCAvIDIpO1xuXG4gICAgbGV0IHFzID0gKCgpID0+IHtcbiAgICAgIGxldCByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGxldCBrIG9mIE9iamVjdC5rZXlzKHBhcmFtcykpIHtcbiAgICAgICAgbGV0IHYgPSBwYXJhbXNba107XG4gICAgICAgIHJlc3VsdHMucHVzaChgJHtrfT0ke3RoaXMuX2VuY29kZSh2KX1gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByZXN1bHRzLmpvaW4oJyYnKTtcbiAgICB9KSgpO1xuXG4gICAgaWYgKHFzKSBxcyA9IGA/JHtxc31gO1xuXG4gICAgLy8gVGhpcyBkb2VzIHdvcmsgZXZlbiB0aG91Z2ggaXQgY29udGFpbnMgXFxuIG9uY2UgY29udmVydGVkLlxuICAgIHdpbmRvdy5vcGVuKFxuICAgICAgdXJsK3FzLFxuICAgICAgJ3RhcmdldFdpbmRvdycsIGBcbiAgICAgICAgdG9vbGJhcj1ubyxcbiAgICAgICAgbG9jYXRpb249bm8sXG4gICAgICAgIHN0YXR1cz1ubyxcbiAgICAgICAgbWVudWJhcj1ubyxcbiAgICAgICAgc2Nyb2xsYmFycz15ZXMsXG4gICAgICAgIHJlc2l6YWJsZT15ZXMsXG4gICAgICAgIGxlZnQ9JHtwb3B1cC5sZWZ0fSxcbiAgICAgICAgdG9wPSR7cG9wdXAudG9wfSxcbiAgICAgICAgd2lkdGg9JHtwb3B1cC53aWR0aH0sXG4gICAgICAgIGhlaWdodD0ke3BvcHVwLmhlaWdodH1cbiAgICAgIGBcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX21lcmdlXG4gICAqIEBkZXNjcmlwdGlvbiBDb21iaW5lcyB0d28gKG9yIG1vcmUpIG9iamVjdHMsIGdpdmluZyB0aGUgbGFzdCBvbmUgcHJlY2VkZW5jZVxuICAgKiBAYXV0aG9yIHN2bGFzb3YtZ2lzdHNcbiAgICogW09yaWdpbmFsIEdpc3Rde0BsaW5rIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3N2bGFzb3YtZ2lzdHMvMjM4Mzc1MX1cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9ICB0YXJnZXRcbiAgICogQHBhcmFtIHtPYmplY3R9ICBzb3VyY2VcbiAgICogQHJldHVybiB7T2JqZWN0fSB0YXJnZXRcbiAgICovXG4gIF9tZXJnZSh0YXJnZXQsIHNvdXJjZSkge1xuICAgIGlmICh0eXBlb2YgdGFyZ2V0ICE9PSAnb2JqZWN0JykgdGFyZ2V0ID0ge307XG5cbiAgICBmb3IgKGxldCBwcm9wZXJ0eSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XG4gICAgICAgIGxldCBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtwcm9wZXJ0eV07XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzb3VyY2VQcm9wZXJ0eSA9PT0gJ29iamVjdCcgJiZcbiAgICAgICAgICAgIC8vIEF2b2lkIGFuIGluZmluaXRlIGxvb3AgaWYgYSBET00gZWxlbWVudCBpcyBoaXQuXG4gICAgICAgICAgICAhKHNvdXJjZVByb3BlcnR5IGluc3RhbmNlb2YgTm9kZSkpIHtcbiAgICAgICAgICB0YXJnZXRbcHJvcGVydHldID0gdGhpcy5fbWVyZ2UodGFyZ2V0W3Byb3BlcnR5XSwgc291cmNlUHJvcGVydHkpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGFyZ2V0W3Byb3BlcnR5XSA9IHNvdXJjZVByb3BlcnR5O1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGEgPSAyLCBsID0gYXJndW1lbnRzLmxlbmd0aDsgYSA8IGw7IGErKylcbiAgICAgIF9tZXJnZSh0YXJnZXQsIGFyZ3VtZW50c1thXSk7XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgLyoqXG4gICAqIEBtZXRob2QgX29iamVjdFRvQXJyYXlcbiAgICogQGRlc2NyaXB0aW9uIFRha2VzIGFuIE9iamVjdCBhbmQgY29udmVydHMgaXQgaW50byBhbiBhcnJheSBvZiBPYmplY3RzLiBUaGlzIGlzIHVzZWQgd2hlbiBjb252ZXJ0aW5nIGEgbGlzdCBvZiBET01Ob2RlcyBpbnRvIGFuIGFycmF5LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gICAqIEByZXR1cm5zIHtBcnJheX0gYXJyXG4gICAqL1xuICBfb2JqVG9BcnJheShvYmopIHtcbiAgICBsZXQgYXJyID0gW107XG5cbiAgICBmb3IgKGxldCBrIGluIG9iailcbiAgICAgIGlmICh0eXBlb2Ygb2JqW2tdID09PSAnb2JqZWN0JykgYXJyLnB1c2gob2JqW2tdKTtcblxuICAgIHJldHVybiBhcnI7XG4gIH1cblxuICAvKipcbiAgICogQG1ldGhvZCBfaXNNb2JpbGVcbiAgICogQGRlc2NyaXB0aW9uIFJldHVybnMgdHJ1ZSBpZiBjdXJyZW50IGRldmljZSBpcyBtb2JpbGUgKG9yIFBoYW50b21KUyBmb3JcbiAgICogdGVzdGluZyBwdXJwb3NlcyksIGFuZCBmYWxzZSBvdGhlcndpc2VcbiAgICogQGF1dGhvciBrcmlza2J4XG4gICAqIFtPcmlnaW5hbCBHaXN0XSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2tyaXNrYngvd2hhdHNhcHAtc2hhcmluZy9ibG9iL21hc3Rlci9zcmMvYnV0dG9uLmpzfVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2lzTW9iaWxlKCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkfGlQaG9uZXxQaGFudG9tSlMvaSkgJiZcbiAgICAgICAgICAgIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQb2R8aVBhZC9pKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaGFyZVV0aWxzO1xuIl19
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