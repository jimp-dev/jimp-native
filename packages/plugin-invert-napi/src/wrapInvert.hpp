#pragma once
#include <napi.h>
#include "referenceFactory.hpp"

void wrapInvert (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
