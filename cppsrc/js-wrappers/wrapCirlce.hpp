#pragma once
#include <napi.h>
#include "../util/referenceFactory.hpp"

void wrapCircle (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
