#pragma once
#include <napi.h>
#include "referenceFactory.hpp"

void wrapDither (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
