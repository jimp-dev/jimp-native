#pragma once
#include <napi.h>
#include "referenceFactory.hpp"

void wrapAdvancedRotate (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
void wrapMatrixRotate (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
