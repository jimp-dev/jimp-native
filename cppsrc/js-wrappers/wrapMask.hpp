#pragma once
#include <napi.h>
#include "../util/referenceFactory.hpp"

void wrapMask (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
