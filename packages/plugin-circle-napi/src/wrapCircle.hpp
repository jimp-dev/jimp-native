#pragma once
#include <napi.h>
#include "referenceFactory.hpp"

void wrapCircle (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
