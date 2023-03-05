#pragma once
#include <mutex>
#include <condition_variable>
#include <thread>
#include <deque>
#include <functional>
#include <cmath>
#include <algorithm>
#include <iostream>

class ThreadPool {
private:
    std::mutex workLock;
    std::mutex threadCountLock;
    std::mutex threadsAvailableLock;
    std::condition_variable waitForWork;
    std::deque<std::function<void()>> work;

    const unsigned int minThreads = 2;
    const unsigned int maxThreads = std::max(minThreads, std::thread::hardware_concurrency());
    const unsigned int threadLingerMs = 1000 * 30;
    unsigned int threadCount = 0;
    unsigned int threadsAvailable = 0;

    void workLoop(bool permanent) {
        while (true) {
            incrementThreadsAvailable();

            std::unique_lock<std::mutex> uniqueWorkLock(workLock);
            std::function<void()> fn;

            if (work.empty()) {
                work.shrink_to_fit();
                // If this is a permanent thread, then allow waiting on a job forever, otherwise spin down after a timeout.
                if (permanent) {
                    waitForWork.wait(uniqueWorkLock, [&] { return !work.empty(); });
                } else if (!waitForWork.wait_for(uniqueWorkLock, std::chrono::milliseconds(threadLingerMs), [&] { return !work.empty(); })) {
                    uniqueWorkLock.unlock();
                    decrementThreadsAvailable();
                    decrementThreadCount();
                    break;
                }
            }

            fn = std::move(work.front());

            if (!fn) {
                work.front() = std::move(fn);
                uniqueWorkLock.unlock();
                decrementThreadsAvailable();
                decrementThreadCount();
                break;
            }

            work.pop_front();
            uniqueWorkLock.unlock();

            decrementThreadsAvailable();

            try {
                fn();
            } catch (std::exception& err) {
                std::cerr << err.what() << std::endl;
                decrementThreadCount();
                break;
            }
        }
    }

    void decrementThreadCount() {
        threadCountLock.lock();
        if (threadCount != 0) {
            threadCount--;
        }
        threadCountLock.unlock();
    }

    void incrementThreadsAvailable() {
        threadsAvailableLock.lock();
        threadsAvailable++;
        threadsAvailableLock.unlock();
    }

    void decrementThreadsAvailable() {
        threadsAvailableLock.lock();
        if (threadsAvailable != 0) {
            threadsAvailable--;
        }
        threadsAvailableLock.unlock();
    }

public:
    ThreadPool() {};
    ~ThreadPool() {
        workLock.lock();
        work.clear();
        work.push_back({}); // Emplace a non-callable function, causing all threads to quit.
        workLock.unlock();
        waitForWork.notify_all();
    }

    void queue(std::function<void()> job) {
        workLock.lock();
        work.push_back(std::move(job));
        workLock.unlock();

        waitForWork.notify_one();

        threadsAvailableLock.lock();
        bool demandForMoreThreads = threadsAvailable == 0;
        threadsAvailableLock.unlock();

        threadCountLock.lock();
        // Start a new thread regardless if we're still under minThreads. We wait with this until we actually get async jobs
        // as we don't want to spin up threads that go unused if the library is only used synchronously.
        if (threadCount < minThreads || (demandForMoreThreads && threadCount < maxThreads)) {
            bool permanent = false;
            if (threadCount < minThreads) {
                permanent = true;
            }

            threadCount++;
            std::thread([this, permanent]() { workLoop(permanent); }).detach();
        }
        threadCountLock.unlock();
    }
};
