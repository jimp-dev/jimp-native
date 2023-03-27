#pragma once
#include <napi.h>
#include "referenceFactory.hpp"

void wrapResize (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
