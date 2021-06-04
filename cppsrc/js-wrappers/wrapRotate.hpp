#pragma once
#include <napi.h>
#include "../util/referenceFactory.hpp"

void wrapRotate (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
