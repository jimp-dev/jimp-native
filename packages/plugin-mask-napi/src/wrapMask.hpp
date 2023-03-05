#pragma once
#include <napi.h>
#include "referenceFactory.hpp"

void wrapMask (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
