// Copyright 2012 The Obvious Corporation.

#include <node.h>
#include <v8.h>

using namespace v8;

/**
 * Helper to schedule an exception with the given message and return
 * undefined.
 */
static Handle<Value> scheduleException(const char* messsage) {
    Local<Value> exception = Exception::Error(String::New(message));
    ThrowException(exception);
    return Undefined();
}

Handle<Value> ObjectIdHash(const Arguments& args) {
    HandleScope scope;

    Local<Object> obj = args[0]->ToObject();
    if (obj->IsEmpty()) {
        return scheduleException("Not an object.");
    }

    if (obj->IsNull()) {
        return scheduleException("~~~ Got null.");
    }

    int hash = obj->GetIdentityHash() & 0x7fffffff;

    if (hash == 0) {
        // V8 guarantees the original hash is non-zero, but it doesn't
        // guarantee that it's not MININT. We want to guarantee a positive
        // number (that is non-zero and non-negative), and so we have to
        // deal with this case specially.
        hash = 1;
    }

    return scope.Close(Integer::New(hash));
}

Handle<Value> NumberIdHash(const Arguments& args) {
    HandleScope scope;

    Local<Number> num = args[0]->ToNumber();
    if (num->IsEmpty()) {
        return scheduleException("Not a number.");
    }

    union {
        double doubleValue;
        unsigned char[sizeof(double)] buffer;
    } hood;

    hood.doubleValue = num->Value();

    int hash = 0xdbdb;
    for (int i = 0; i < sizeof(double); i++) {
        hash = (hash * 31) + hood.buffer[i];
    }

    hash &= 0x7fffffff;
    return scope.Close(Number::New((double) hash));
}

void init(Handle<Object> target) {
    target->Set(String::NewSymbol("objectIdHash"),
                FunctionTemplate::New(ObjectIdHash)->GetFunction());
    target->Set(String::NewSymbol("numberIdHash"),
                FunctionTemplate::New(NumberIdHash)->GetFunction());
}

NODE_MODULE(oidNative, init)
