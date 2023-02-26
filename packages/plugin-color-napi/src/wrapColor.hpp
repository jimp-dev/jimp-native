#pragma once
#include <napi.h>
#include "referenceFactory.hpp"

void wrapBrightness (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);

void wrapOpacity (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);

void wrapOpaque (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);

void wrapContrast (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);

void wrapPosterize (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);

void wrapSepia (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);

void wrapConvolution (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);

void wrapGreyscale (const Napi::CallbackInfo& info, ReferenceFactory& referenceFactory);
