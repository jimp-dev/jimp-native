#pragma once
#include <napi.h>
#include "../util/referenceFactory.hpp"

void wrapResize (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
