#pragma once
#include <functional>
#include <optional>
#include <napi.h>
#include "threadPool.hpp"

ThreadPool pool;

/**
 * Runs provided doWork on a separate thread. Calls provided JavaScript function when done with results.
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
) {
    auto threadSafeJSCallback = Napi::ThreadSafeFunction::New(
        env,
        jsCallback,
        Napi::String::New(env, "doAsync call jimp-native"),
        0,
        1
    );

    pool.queue(
        [
            doWork = std::move(doWork),
            threadSafeJSCallback = std::move(threadSafeJSCallback),
            onDone = std::move(onDone)
        ]() mutable {
            std::optional<std::string> errorMessage;
            try {
                doWork();
            } catch (std::exception& err) {
                errorMessage = std::string("An exception occurred on a C++ thread within Jimp native: ").append(err.what());
            }

            threadSafeJSCallback.BlockingCall(
                [
                    onDone = std::move(onDone),
                    errorMessage = std::move(errorMessage)
                ] (Napi::Env env, Napi::Function jsCallback) mutable {
                    try {
                        onDone(env, jsCallback, errorMessage);
                    } catch (std::exception& err) {
                        std::cerr << "An exception occurred during the onDone callback: " << err.what() << std::endl;
                    }
                }
            );

            threadSafeJSCallback.Release();
        });
}
