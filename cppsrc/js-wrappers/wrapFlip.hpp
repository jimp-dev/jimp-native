#pragma once
#include <napi.h>
#include "../util/referenceFactory.hpp"

void wrapFlip (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
