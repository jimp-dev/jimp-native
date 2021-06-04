#pragma once
#include <napi.h>
#include "../util/referenceFactory.hpp"

void wrapInvert (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
