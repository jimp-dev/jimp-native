#pragma once
#include <napi.h>
#include "../util/referenceFactory.hpp"

void wrapCrop (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);

void wrapAutocrop (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
