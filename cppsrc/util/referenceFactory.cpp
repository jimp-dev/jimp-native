#include "referenceFactory.hpp"

ReferenceFactory::TransferableReference ReferenceFactory::ref(Napi::Env& env, Napi::Value& value) {
    unsigned long long id = ++nextReferenceId;
    references.insert(std::pair(id, Napi::Reference<Napi::Value>::New(value, 1)));
    return TransferableReference(this, id);
};

void ReferenceFactory::unref(unsigned long long referenceId) {
    if (references.find(referenceId) != references.end()) {
        references[referenceId].Unref();
        references.erase(referenceId);
    }
}

void ReferenceFactory::TransferableReference::unref() {
    if (referenceActive) {
        parent->unref(referenceId);
        referenceActive = false;
    }
}

ReferenceFactory::TransferableReference::TransferableReference(ReferenceFactory* parent, unsigned long long referenceId) :
    parent(parent),
    referenceId(referenceId),
    referenceActive(true) {
}

ReferenceFactory::TransferableReference::TransferableReference(const TransferableReference& copy) :
    parent(copy.parent),
    referenceId(copy.referenceId),
    referenceActive(copy.referenceActive) {
}
