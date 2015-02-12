// Copyright 2012 The Obvious Corporation.

#include <node.h>
#include <nan.h>
#include <v8.h>

using namespace v8;

NAN_METHOD(ObjectIdHash) {
    NanScope();

    Local<Value> val = args[0];
    if (val->IsNull()) {
        NanReturnValue(NanNew<Integer>(99961)); // A prime number.
    }

    Local<Object> obj = val->ToObject();
    if (obj.IsEmpty()) {
        return NanThrowError("Not an object.");
    }

    int hash = obj->GetIdentityHash() & 0x7fffffff;

    if (hash == 0) {
        // V8 guarantees the original hash is non-zero, but it doesn't
        // guarantee that it's not MININT. We want to guarantee a positive
        // number (that is non-zero and non-negative), and so we have to
        // deal with this case specially.
        hash = 1;
    }

    NanReturnValue(NanNew<Integer>(hash));
}

NAN_METHOD(NumberIdHash) {
    NanScope();

    Local<Number> num = args[0]->ToNumber();
    if (num.IsEmpty()) {
        return NanThrowError("Not a number.");
    }

    union {
        double doubleValue;
        unsigned char buffer[sizeof(double)];
    } hood;

    hood.doubleValue = num->Value();

    int hash = 56081; // A prime number.
    for (size_t i = 0; i < sizeof(double); i++) {
        hash = (hash * 31) + hood.buffer[i];
    }

    hash &= 0x7fffffff;

    if (hash == 0) {
        // Guarantee non-zero.
        hash = 1;
    }

    NanReturnValue(NanNew<Number>((double) hash));
}

void init(Handle<Object> target) {
    target->Set(NanNew<String>("objectIdHash"),
                NanNew<FunctionTemplate>(ObjectIdHash)->GetFunction());
    target->Set(NanNew<String>("numberIdHash"),
                NanNew<FunctionTemplate>(NumberIdHash)->GetFunction());
}

NODE_MODULE(oidNative, init)
