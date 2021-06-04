#pragma once
#include <functional>
#include <optional>
#include <napi.h>

/**
 * Runs provided doWork on a new thread using std::async. Calls provided JavaScript function when done with results.
 * onDone will be called to handle calling the callback and doing cleanup. The string parameter will be set with an
 * error message if doWork failed.
 *
 * \param env
 * \param jsCallback
 * \param doWork
 * \param onDone
 */
void doAsync(
    Napi::Env& env,
    Napi::Function& jsCallback,
    std::function<void()> doWork,
    std::function<void(Napi::Env, Napi::Function, std::optional<std::string>)> onDone
);
