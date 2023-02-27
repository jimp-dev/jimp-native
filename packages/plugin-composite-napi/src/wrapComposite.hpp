#pragma once
#include <napi.h>
#include "referenceFactory.hpp"

void wrapComposite (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
