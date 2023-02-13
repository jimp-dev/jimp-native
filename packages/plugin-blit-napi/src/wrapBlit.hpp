#pragma once
#include <napi.h>
#include "referenceFactory.hpp"

/**
 * Node Addon API wrapper for the generic blit implementation.
*/
void blit (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
