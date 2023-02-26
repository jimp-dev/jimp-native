#pragma once
#include <napi.h>
#include "referenceFactory.hpp"

void wrapBlur (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
