#pragma once
#include <mutex>
#include <condition_variable>
#include <thread>
#include <deque>
#include <functional>
#include <cmath>
#include <algorithm>

class ThreadPool {
    private:
    std::mutex workLock;
    std::mutex threadCountLock;
    std::mutex threadsAvailableLock;
    std::condition_variable waitForWork;
    std::deque<std::function<void()>> work;

    const unsigned int minThreads = 2;
    const unsigned int maxThreads = std::max(minThreads, std::thread::hardware_concurrency());
    const unsigned int threadLingerMs = 1000 * 30; // Thirty seconds
    unsigned int threadCount = 0;
    unsigned int threadsAvailable = 0;

    void workLoop(bool permanent);

    void decrementThreadCount();
    void incrementThreadsAvailable();
    void decrementThreadsAvailable();

    public:
    ThreadPool() {};
    ~ThreadPool();

    void queue(std::function<void()> job);
};
