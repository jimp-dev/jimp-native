#pragma once
#include <napi.h>
#include "../util/referenceFactory.hpp"

void wrapDither (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
