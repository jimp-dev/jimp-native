#pragma once
#include <napi.h>
#include "../util/referenceFactory.hpp"

void wrapBlit (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
