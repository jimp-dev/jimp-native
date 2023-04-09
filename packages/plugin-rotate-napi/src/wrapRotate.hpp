#pragma once
#include <napi.h>
#include "referenceFactory.hpp"

void wrapRotate (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
