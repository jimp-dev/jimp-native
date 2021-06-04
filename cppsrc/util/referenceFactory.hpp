#pragma once
#include <map>
#include <napi.h>

/**
 * In order to prevent important JavaScript values from getting garbage collected while we're working in another thread,
 * we want to pretend that we have a JavaScript reference to them for as long as they need to stay around. The node
 * addon api lets us do this with the help of the Reference class. Sadly, node addon api doesn't let us pass a
 * Napi::Reference around between threads, and anything that we allocate on the stack goes out of scope after we start
 * our thread. 
 * 
 * This class aims to solve this by providing permanent storage for Napi::Reference objects and handing out
 * "TransferableReferences" which only keep a unique ID to the actual Napi::Reference stored in the ReferenceFactory
 * that created it. This lets us pass the reference freely accross threads while we're busy without the reference
 * going out of scope. It's important that the ReferenceFactory is created such that it is guaranteed to stay around for
 * the duration of any threads that may use it, e.g. global scope.
 * 
 * It's important to note that while other threads can pass the TransferableReference around *only* the main thread
 * should call the unref function, as that interacts with V8 internals.
 */
class ReferenceFactory {
    public:
    class TransferableReference {
        friend class ReferenceFactory;
        protected:
        ReferenceFactory* parent;
        const unsigned long long referenceId;
        bool referenceActive;

        TransferableReference(ReferenceFactory* parent, unsigned long long referenceId);

        public:

        /**
         * De-references whatever JavaScript value this reference was pointing at. Only do this from the main V8 thread.
         */
        void unref();
        
        TransferableReference(const TransferableReference& copy);
    };

    friend class TransferableReference;
    private:
    unsigned long long nextReferenceId = 0;
    std::map<unsigned long long, Napi::Reference<Napi::Value>> references;

    public:
    
    /**
     * Create a reference to the given Napi::Value, preventing it from being garbage collected in JavaScript.
     * 
     * \param env
     * \param value
     */
    TransferableReference ref(Napi::Env& env, Napi::Value& value);
    ReferenceFactory(const ReferenceFactory&) = delete;
    ReferenceFactory() {};


    protected:
    void unref(unsigned long long referenceId);

};
