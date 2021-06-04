#pragma once
#include <napi.h>
#include "../util/referenceFactory.hpp"

void wrapBlur (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
